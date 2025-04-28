
import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === "assistant";
  
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isBot 
          ? "bg-white shadow-sm border border-gray-100" 
          : "bg-blue-50"
      )}
    >
      <div className="flex-shrink-0">
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot size={18} className="text-blue-600" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="text-sm font-medium">
          {isBot ? "PDF Genius" : "You"}
        </div>
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
