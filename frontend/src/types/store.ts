import type { Message } from "react-hook-form";
import type { Conversation } from "./chat";
import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    clearState: () => void;

    setAccessToken: (accessToken: string) => void;

    signUp: (
        username: string, 
        password: string,
        email: string,
        firstname: string,
        lastname: string
    ) => Promise<void>; 

    signIn: (
        username: string,
        password: string
    ) => Promise<void>;

    signOut: () => Promise<void>;

    fetchMe: () => Promise<void>;

    refresh: () => Promise<void>;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (isDark: boolean) => void;
}

export interface ChatState {
    conversations: Conversation[];
    messages: Record<string, {
        items: Message[];
        hasMore: boolean; //infinite scroll
        nextCursor?: string | null; //pagination
    }>;
    activeConversationId: string | null;
    loading: boolean;
    reset: () => void;

    setActiveConversation: (id: string | null) => void;
    fetchConversations: () => Promise<void>;
}