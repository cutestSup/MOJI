import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            convoLoading: false, // convo loading
            messageLoading: false,
            loading: false,

            setActiveConversation: (id) => set({ activeConversationId: id }),
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    convoLoading: false,
                    messageLoading: false,
                });
            },

            fetchConversations: async () => {
                try {
                    set({ convoLoading: true });
                    const { conversations } = await chatService.fetchConversations();

                    set({ conversations, convoLoading: false });
                } catch (error) {
                    console.error("Error when fetching conversations:", error);
                    set({ convoLoading: false });
                }
            },

            fetchMessages: async (conversationId) => {
                const { activeConversationId, messages } = get();
                const { user } = useAuthStore.getState();

                const convoId = conversationId ?? activeConversationId;

                if (!convoId) return;

                const current = messages?.[convoId];
                const nextCursor =
                    current?.nextCursor === undefined ? "" : current?.nextCursor;

                if (nextCursor === null) return;

                set({ messageLoading: true });

                try {
                    const { messages: fetched, cursor } = await chatService.fetchMessages(
                        convoId,
                        nextCursor
                    );

                    const processed = fetched.map((m) => ({
                        ...m,
                        isOwn: m.senderId === user?._id,
                    }));

                    set((state) => {
                        const prev = state.messages[convoId]?.items ?? [];
                        const merged = prev.length > 0 ? [...processed, ...prev] : processed;

                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: merged,
                                    hasMore: !!cursor,
                                    nextCursor: cursor ?? null,
                                },
                            },
                        };
                    });
                } catch (error) {
                    console.error("Error when fetching messages:", error);
                } finally {
                    set({ messageLoading: false });
                }
            },

            sendDirectMessage: async (recipientId, content, imageUlr) => {
                try {
                    const { activeConversationId } = get();
                    await chatService.sendDirectMessage(recipientId, content, imageUlr, activeConversationId || undefined);

                    set((state) => ({
                        conversations: state.conversations.map((convo) =>
                            convo._id === activeConversationId ? { ...convo, seenBy: [] } : convo
                        ),
                    }));
                } catch (error) {
                    console.error("Error when sending direct message:", error);
                    throw error;
                }
            },

            sendGroupMessage: async (conversationId, content, imageUlr) => {
                try {
                    const { activeConversationId } = get();
                    await chatService.sendGroupMessage(conversationId, content, imageUlr);

                    set((state) => ({
                        conversations: state.conversations.map((convo) =>
                            convo._id === activeConversationId ? { ...convo, seenBy: [] } : convo
                        ),
                    }));
                } catch (error) {
                    console.error("Error when sending group message:", error);
                    throw error;
                }
            },

            addMessage: async (message) => {
                try {
                    const { user } = useAuthStore.getState();
                    const { fetchMessages } = get();

                    message.isOwn = message.senderId === user?._id;

                    const convoId = message.conversationId;

                    let prevItems = get().messages[convoId]?.items ?? [];

                    if (prevItems.length === 0) {
                        await fetchMessages(convoId);
                        prevItems = get().messages[convoId]?.items ?? [];
                    }

                    set((state) => {
                        if (prevItems.some((m) => m._id === message._id)) {
                            return state;
                        }

                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: [...prevItems, message],
                                    hasMore: state.messages[convoId]?.hasMore,
                                    nextCursor: state.messages[convoId]?.nextCursor ?? undefined,
                                },
                            },
                        };
                    });

                } catch (error) {
                    console.error("Error when adding message:", error);
                }
            },

            updateConversation: (conversation) => {
                set((state) => ({
                    conversations: state.conversations.map((convo) =>
                        convo._id === conversation._id ? {...convo,...conversation} : convo
                    ),
                }));
            },

        }),
        {
            name: "chat-storage",
            partialize: (state) => ({ conversations: state.conversations }),
        }
    )
);