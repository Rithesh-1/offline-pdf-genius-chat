
import React, { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  disabled = false,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-background flex items-center gap-2">
      <Input
        placeholder="Ask a question about your PDFs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || disabled}
        className={`flex-1 transition-all duration-300 ${
          !value.trim() ? 
          "shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(96,165,250,0.5)] border-blue-400 dark:border-blue-500" : 
          ""
        }`}
      />
      <Button 
        onClick={onSend} 
        disabled={isLoading || disabled || !value.trim()} 
        size="icon"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
