import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat"
import ChatCard from "./ChatCard";
import { cn } from "@/lib/utils";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";


const GroupChatCard = ({ conv }: { conv: Conversation }) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();

    if (!user) {
        return null;
    }

    const unreadCount = conv.unreadCounts[user._id] || 0;
    const name = conv.group?.name ?? "Unnamed Group";
    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            await fetchMessages();
        }
    };

    return (
        <ChatCard
            conversationId={conv._id}
            name={name}
            timestamp={
                conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt) : undefined
            }
            isActive={activeConversationId === conv._id}
            onSelect={() => handleSelectConversation(conv._id)}
            unreadCount={unreadCount}
            leftSection={<>
                {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
                <GroupChatAvatar
                    participants={conv.participants}
                    type="chat"
                />
            </>}
            subtitle={
                <p className={cn(
                    "text-sm truncate text-muted-foreground")}>
                    {conv.participants.length} members
                </p>
            }
        />

    )
}

export default GroupChatCard