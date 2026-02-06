import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Attach the access token to each request if available
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

// automatically try to refresh token when access token expires
api.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;

    // apis to skip refreshing token
    if (originalRequest.url.includes("/auth/signin") || 
        originalRequest.url.includes("/auth/signup") || 
        originalRequest.url.includes("/auth/refresh")) 
    {
        return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response.status === 403 && originalRequest._retryCount < 4) {
        originalRequest._retryCount += 1;

        try {
            const response = await api.post("/auth/refresh", { withCredentials: true });
            const newAccessToken = response.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;           
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearState();
            return Promise.reject(refreshError);
        }
    }
    
    return Promise.reject(error);
    },

);
            
            
export default api;