import React from "react";

export interface TypingIndicatorProps {
  instituteName?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ instituteName = "AKSNOVA" }) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-border/70 bg-card px-3.5 py-2.5 shadow-xs">
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
      </div>
      <span className="text-xs text-muted-foreground italic">{instituteName} is typing...</span>
    </div>
  );
};
