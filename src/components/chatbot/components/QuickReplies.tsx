import React from "react";
import { ChevronRight } from "lucide-react";

export interface QuickRepliesProps {
  options: string[] | null;
  onSelectOption: (option: string) => void;
  isTyping?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  options,
  onSelectOption,
  isTyping,
}) => {
  if (!options || options.length === 0 || isTyping) {
    return null;
  }

  const isDomainList = options.length > 3;

  return (
    <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <p className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {isDomainList ? "Select a Domain:" : "Suggested Options:"}
      </p>

      {isDomainList ? (
        /* Rectangle with Rounded Corners Grid/Wrap for Domains */
        <div className="flex flex-wrap items-start gap-1.5">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectOption(option)}
              className="group inline-flex w-fit items-center justify-center rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-center text-[11px] sm:text-xs font-semibold text-foreground shadow-2xs transition-all duration-150 hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              <span>{option}</span>
            </button>
          ))}
        </div>
      ) : (
        /* Vertical Stack for Initial / Follow-up Options */
        <div className="flex flex-col items-start gap-1.5">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectOption(option)}
              className="group inline-flex w-fit max-w-full items-center justify-between gap-2.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-left text-xs sm:text-sm font-medium text-foreground shadow-2xs transition-all hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              <span>{option}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-brand" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
