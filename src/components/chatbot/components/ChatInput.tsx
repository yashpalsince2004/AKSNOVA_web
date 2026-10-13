import React from "react";
import { Send, Sparkles } from "lucide-react";
import type { ChatInputMode } from "../chatbot-types";

export interface ChatInputProps {
  mode: ChatInputMode;
  // Name
  nameInput: string;
  onNameChange: (val: string) => void;
  onNameSubmit: (e: React.SyntheticEvent) => void;
  isNameValid: boolean;
  // Phone
  phoneNumber: string;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneSubmit: (e: React.SyntheticEvent) => void;
  isPhoneValid: boolean;
  // Email
  emailInput: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailSubmit: (e: React.SyntheticEvent) => void;
  isEmailValid: boolean;
  // Text
  textInput: string;
  onTextChange: (val: string) => void;
  onTextSubmit: (e: React.SyntheticEvent) => void;
  isTextValid: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  mode,
  nameInput,
  onNameChange,
  onNameSubmit,
  isNameValid,
  phoneNumber,
  onPhoneChange,
  onPhoneSubmit,
  isPhoneValid,
  emailInput,
  onEmailChange,
  onEmailSubmit,
  isEmailValid,
  textInput,
  onTextChange,
  onTextSubmit,
  isTextValid,
}) => {
  if (mode === "name") {
    return (
      <form
        onSubmit={onNameSubmit}
        className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
          <input
            type="text"
            id="chat-name-input"
            aria-label="Enter your name"
            placeholder="Enter your name..."
            value={nameInput}
            onChange={(e) => onNameChange(e.target.value)}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!isNameValid}
            aria-label="Send name"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              isNameValid
                ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  if (mode === "phone") {
    return (
      <form
        onSubmit={onPhoneSubmit}
        className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
          {/* Country Prefix */}
          <span className="flex items-center gap-1 pl-2 text-xs font-semibold text-muted-foreground select-none">
            <span role="img" aria-label="India flag">
              🇮🇳
            </span>{" "}
            +91
          </span>
          {/* Phone Input */}
          <input
            type="tel"
            inputMode="numeric"
            id="chat-counselor-phone-input"
            aria-label="Enter your contact number"
            placeholder="Enter 10-digit mobile number"
            value={phoneNumber}
            onChange={onPhoneChange}
            maxLength={10}
            className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          {/* Send Button */}
          <button
            type="submit"
            disabled={!isPhoneValid}
            aria-label="Send number"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              isPhoneValid
                ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
          <span>10 digits only, cannot start with 0</span>
          <span>{phoneNumber.length}/10</span>
        </div>
      </form>
    );
  }

  if (mode === "email") {
    return (
      <form
        onSubmit={onEmailSubmit}
        className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            id="chat-email-input"
            aria-label="Enter your email ID"
            placeholder="Enter your email ID..."
            value={emailInput}
            onChange={onEmailChange}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!isEmailValid}
            aria-label="Send email"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              isEmailValid
                ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
          <span>Valid email format required (e.g. name@example.com)</span>
          {emailInput.length > 0 && (
            <span
              className={
                isEmailValid ? "text-emerald-600 font-semibold" : "text-amber-600 font-medium"
              }
            >
              {isEmailValid ? "✓ Valid" : "Incomplete"}
            </span>
          )}
        </div>
      </form>
    );
  }

  if (mode === "text") {
    return (
      <form
        onSubmit={onTextSubmit}
        className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
          <input
            type="text"
            id="chat-counselor-message-input"
            aria-label="Type your message"
            placeholder="Type your message here..."
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!isTextValid}
            aria-label="Send message"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              isTextValid
                ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
          <span>Connecting live with Admission Counselor</span>
          <span>Type and press send</span>
        </div>
      </form>
    );
  }

  return (
    <div className="border-t border-border/70 bg-secondary/40 px-4 py-3 rounded-b-2xl flex items-center justify-between text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1.5 font-medium">
        <Sparkles className="h-3 w-3 text-brand" />
        Guided Career Assistant
      </span>
      <span className="text-[10px]">Select an option above</span>
    </div>
  );
};
