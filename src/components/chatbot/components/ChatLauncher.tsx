import React from "react";
import { Phone, X } from "lucide-react";
import { withBase } from "@/lib/paths";

export interface ChatLauncherProps {
  isOpen: boolean;
  isSpeedDialOpen: boolean;
  hasUnread: boolean;
  onOpenChat: () => void;
  onOpenSpeedDial: () => void;
  onCloseSpeedDial: () => void;
  onOpenCallbackModal: () => void;
}

export function ChatLauncher({
  isOpen,
  isSpeedDialOpen,
  hasUnread,
  onOpenChat,
  onOpenSpeedDial,
  onCloseSpeedDial,
  onOpenCallbackModal,
}: ChatLauncherProps) {
  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6 flex flex-col items-end gap-3">
      {/* Rolled Upward Options */}
      {isSpeedDialOpen && (
        <>
          {/* Option 1 (Top): Chat with us */}
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <span className="rounded-lg bg-black px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xl whitespace-nowrap">
              Chat with us
            </span>
            <button
              type="button"
              onClick={onOpenChat}
              aria-label="Chat with us"
              className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/30 transition-all duration-200 hover:scale-110 hover:bg-brand-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <img
                src={withBase("/logos/aksnova-icon-dark.svg")}
                alt="Chat with us"
                className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
              />
            </button>
          </div>

          {/* Option 2 (Middle): Call me back */}
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="rounded-lg bg-black px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xl whitespace-nowrap">
              Call me back
            </span>
            <button
              type="button"
              onClick={onOpenCallbackModal}
              aria-label="Call me back"
              className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/30 transition-all duration-200 hover:scale-110 hover:bg-brand-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
            >
              <Phone className="h-5 w-5 sm:h-6 sm:w-6 fill-white text-brand" />
            </button>
          </div>

          {/* Bottom Toggle Button: White Circle with Black X */}
          <button
            type="button"
            onClick={onCloseSpeedDial}
            aria-label="Close options"
            className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white text-zinc-900 border border-zinc-200/90 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="h-6 w-6 text-zinc-900 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Initial Closed Floating Launcher Button */}
      {!isSpeedDialOpen && (
        <button
          type="button"
          onClick={onOpenSpeedDial}
          aria-label="Chatbot options"
          aria-expanded={false}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/25 transition-all duration-200 hover:scale-110 hover:bg-brand-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {/* Notification Pulse Indicator */}
          {hasUnread && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-red-500" />
            </span>
          )}

          {/* Message Logo */}
          <img
            src={withBase("/logos/aksnova-icon-dark.svg")}
            alt="AKSNOVA chatbot"
            className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-110"
          />
        </button>
      )}
    </div>
  );
}
