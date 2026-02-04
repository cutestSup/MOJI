import type React from "react";
import { Card } from "../ui/card"
import { formatOnlineTime, cn } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react";

interface ChatCardProps {
    conversationId: string;
    name: string;
    timestamp?: Date;
    isActive: boolean;
    onSelect: (conversationId: string) => void;
    unreadCount?: number;
    leftSection: React.ReactNode; // Avatar or icon
    subtitle: React.ReactNode; // Last message or status
}


const ChatCard = ({
    conversationId, name, timestamp, isActive, onSelect, unreadCount, leftSection, subtitle }: ChatCardProps) => {
    return (
        <Card
            key={conversationId}
            className={cn("border-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30",
                isActive && "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-foreground")}
            onClick={() => onSelect(conversationId)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">{leftSection}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={cn(
                            "text-sm font-semibold truncate",
                            unreadCount && unreadCount > 0 && "text-foreground"
                        )}>{name}</h3>
                        <span className="text-xs text-muted-foreground"
                        >{timestamp ? formatOnlineTime(timestamp) : ""}</span>
                    </div>

                    <div className="flex item justify-between">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                            {subtitle}
                        </div>
                        <MoreHorizontal className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover: size-5 transition-smooth" />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ChatCard