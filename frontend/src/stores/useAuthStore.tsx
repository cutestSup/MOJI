import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => set({
        accessToken: null,
        user: null,
        loading: false,
    }),

    signUp: async (username, password, email, firstname, lastname) => {
        try {
            set({ loading: true });

            await authService.signUp(username, password, email, firstname, lastname);

            toast.success('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
        } catch (error) {
            console.error('Error during sign up:', error);
            toast.error('Đăng ký thất bại! Vui lòng thử lại.');
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username: string, password: string) => {
        try {
            set({ loading: true });

            const { accessToken } = await authService.signIn(username, password);
            set({ accessToken });

            await get().fetchMe();

            toast.success('Chào mừng bạn trở lại với Moji 🎉');

        } catch (error) {
            console.error('Error during sign in:', error);
            toast.error('Đăng nhập thất bại! Vui lòng thử lại.');
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success('Đăng xuất thành công!');
        } catch (error) {
            console.error('Error during sign out:', error);
            toast.error('Đăng xuất thất bại! Vui lòng thử lại.');
        } 
    },

    fetchMe: async () => {
        try {
            set({ loading: true });

            const user = await authService.fetchMe();
            set({ user });

        } catch (error) {
            console.error('Error fetching user data:', error);
            set({ user: null, accessToken: null });
            toast.error('Không thể lấy dữ liệu người dùng. Vui lòng đăng nhập lại.');
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const {user, fetchMe} = get();
            const accessToken = await authService.refresh();

            set({ accessToken });

            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            get().clearState();
        } finally {
            set({ loading: false });
        }
    }

}));