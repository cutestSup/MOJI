import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

interface FetchMessagesProps {
    messages: Message[];
    cursor?: string;
}

const pageLimit = 50;

export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const res = await api.get("/conversations");
        return res.data;
    },

    async fetchMessages(conversationId: string, cursor?: string): Promise<FetchMessagesProps> {
        const res = await api.get(`/conversations/${conversationId}/messages?limit=${pageLimit}&cursor=${cursor || ""}`
        );

        return { messages: res.data.messages, cursor: res.data.nextCursor };

    },

    async sendDirectMessage(recipientId: string, content: string = "", imageUlr?: string, conversationId?: string): Promise<void> {
        const res = await api.post("/messages/direct", { recipientId, content, imageUlr, conversationId });

        return res.data.message;
    },
    
    async sendGroupMessage(conversationId: string, content: string = "", imageUlr?: string): Promise<void> {
        const res = await api.post("/messages/group", { conversationId, content, imageUlr });
        
        return res.data.message;
    }
       

};