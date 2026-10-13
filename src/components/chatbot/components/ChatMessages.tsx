import React from "react";
import type { ChatMessage } from "../chatbot-types";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { QuickReplies } from "./QuickReplies";

export interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  instituteName?: string;
  quickOptions: string[] | null;
  onSelectOption: (option: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  instituteName = "AKSNOVA",
  quickOptions,
  onSelectOption,
  messagesEndRef,
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth"
      aria-live="polite"
      tabIndex={0}
      role="log"
      aria-label="Conversation history"
    >
      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}

      {isTyping && <TypingIndicator instituteName={instituteName} />}

      <QuickReplies options={quickOptions} onSelectOption={onSelectOption} isTyping={isTyping} />

      <div ref={messagesEndRef} />
    </div>
  );
};
