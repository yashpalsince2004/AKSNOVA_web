import React from "react";
import { X, Minus } from "lucide-react";
import { withBase } from "@/lib/paths";

export interface ChatHeaderProps {
  instituteName?: string;
  onClose: () => void;
  onMinimize?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  instituteName = "AKSNOVA",
  onClose,
  onMinimize,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border/70 bg-secondary/50 px-4 py-3 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F2023] p-1.5 shadow-xs border border-border/70 overflow-hidden">
          <img
            src={withBase("/logos/aksnova-app-icon.svg")}
            alt={`${instituteName} logo`}
            className="h-full w-full object-contain rounded-lg"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = withBase("/logos/aksnova-app-icon.png");
            }}
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500"
            title="Online"
          />
        </div>
        <div>
          <h2 id="chatbot-title" className="text-sm font-bold text-foreground">
            We are online!
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{instituteName} Support</span>
          </p>
        </div>
      </div>

      {/* Minimize / Close Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onMinimize || onClose}
          aria-label="Minimize chat"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          title="Minimize chat"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          title="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
