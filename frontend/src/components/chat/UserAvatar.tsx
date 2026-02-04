import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IUserAvatarProps {
    type: "sidebar" | "chat" | "profile";
    name: string;
    avatarUrl?: string;
    classname?: string;
}

const UserAvatar = ({ type, name, avatarUrl, classname }: IUserAvatarProps) => {
    const bgColor = !avatarUrl ? "bg-gray-400" : "";

    if (!name) {
        name = "Moji User";
    }

    return (
        <Avatar
            className={cn(classname ?? "",
                type === "sidebar" && "size-12 text-base",
                type === "chat" && "size-8 text-sm",
                type === "profile" && "size-24 text-3xl shadow-md"
            )}
        >
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className={`${bgColor} text-white font-semibold`}>
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>


    )
}

export default UserAvatar