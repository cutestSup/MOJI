import { useThemeStore } from "@/stores/useThemeStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import Picker from "emoji-picker-react";
import { Theme, type EmojiClickData } from "emoji-picker-react";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={45}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-13"
      >
        <Picker
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={(emojiData: EmojiClickData) => onChange(emojiData.emoji)}
          height={400}
          width={350}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;