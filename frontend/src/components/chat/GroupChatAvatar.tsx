import type { Participant } from "@/types/chat"
import { User } from "lucide-react";
import UserAvatar from "./UserAvatar";


interface GroupChatAvatarProps {
    participants: Participant[];
    type: "sidebar" | "chat";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
    const avatars = []; // Logic to create group avatar based on participants and type
    const limit = Math.min(participants.length, 4);

    for (let i = 0; i < limit; i++) {
        const member = participants[i];
        // Add avatar logic here
        avatars.push(
            <UserAvatar
                key={i}
                type={type}
                name={member.displayName ?? "Unknown User"}
                avatarUrl={member.avatarUrl ?? undefined}
            />
        );
    }
    return <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2">
        {avatars}

        {/* If more than 4 participants, show a +X avatar */}
        {participants.length > limit && (
            <div className={`
                size-${type === "sidebar" ? "12" : "8"} 
                bg-muted 
                text-muted-foreground 
                flex    
                items-center
                justify-center
                rounded-full
                ring-2
                ring-background
            `}>
                +{participants.length - limit}
            </div>
        )}
    </div>
}

export default GroupChatAvatar