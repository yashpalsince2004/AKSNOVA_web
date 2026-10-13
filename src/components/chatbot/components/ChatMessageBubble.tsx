import React from "react";
import type { ChatMessage } from "../chatbot-types";

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div
      className={`flex flex-col ${isBot ? "items-start" : "items-end"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      <div
        className={`max-w-[88%] rounded-2xl p-3.5 text-sm shadow-xs ${
          isBot
            ? "rounded-tl-xs border border-border/70 bg-card text-foreground"
            : "rounded-tr-xs bg-brand text-white font-medium"
        }`}
      >
        {message.text.split("\n\n").map((paragraph, idx) => (
          <p key={idx} className={idx > 0 ? "mt-2.5" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
      <span className="mt-1 px-1 text-[10px] text-muted-foreground">{message.timestamp}</span>
    </div>
  );
};
