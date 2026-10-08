import { useState } from "react";

interface Props {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "https://aksnova.in";
  };

  const handleShare = (network: "linkedin" | "twitter" | "whatsapp") => {
    const shareUrl = encodeURIComponent(getShareUrl());
    const shareTitle = encodeURIComponent(title);

    let target = "";
    if (network === "linkedin") {
      target = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    } else if (network === "twitter") {
      target = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
    } else if (network === "whatsapp") {
      target = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
    }

    if (typeof window !== "undefined" && target) {
      window.open(target, "_blank", "noopener,noreferrer,width=600,height=500");
    }
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(getShareUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() => handleShare("linkedin")}
        className="rounded-full bg-secondary p-2 text-foreground hover:bg-accent hover:text-brand transition"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Share on X / Twitter"
        onClick={() => handleShare("twitter")}
        className="rounded-full bg-secondary p-2 text-foreground hover:bg-accent hover:text-brand transition"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Share on WhatsApp"
        onClick={() => handleShare("whatsapp")}
        className="rounded-full bg-secondary p-2 text-foreground hover:bg-accent hover:text-brand transition"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Copy article link"
        onClick={handleCopy}
        className="rounded-full bg-secondary p-2 text-foreground hover:bg-accent hover:text-brand transition relative"
      >
        {copied ? (
          <span className="text-xs font-bold text-brand px-1">Copied!</span>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
