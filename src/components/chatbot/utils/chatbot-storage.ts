import type { ChatMessage, SavedLeadData } from "../chatbot-types";
import {
  STORAGE_KEY_SEEN,
  STORAGE_KEY_MESSAGES,
  STORAGE_KEY_OPTIONS,
  STORAGE_KEY_LEAD_DATA,
} from "../chatbot-types";
import { isChatPhoneValid } from "./chatbot-logic";

export function loadSavedLeadData(): SavedLeadData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_LEAD_DATA);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      phone: typeof parsed.phone === "string" ? parsed.phone : undefined,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
      qualification: typeof parsed.qualification === "string" ? parsed.qualification : undefined,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      emailSkipped: typeof parsed.emailSkipped === "boolean" ? parsed.emailSkipped : undefined,
    };
  } catch {
    return null;
  }
}

export function saveSessionLeadData(lead: SavedLeadData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_LEAD_DATA, JSON.stringify(lead));
  } catch {
    // ignore quota/security exceptions
  }
}

export function recoverPhoneFromMessages(messages: ChatMessage[]): string | null {
  for (const m of messages) {
    if (m && m.sender === "user" && typeof m.text === "string") {
      const digits = m.text.replace(/\D/g, "");
      const normalized = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
      if (isChatPhoneValid(normalized)) {
        return normalized;
      }
    }
  }
  return null;
}

export function loadSessionMessages(): {
  seen: boolean;
  messages: ChatMessage[] | null;
  options: string[] | null;
} {
  try {
    const seen = sessionStorage.getItem(STORAGE_KEY_SEEN) === "true";
    const rawMessages = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
    const rawOptions = sessionStorage.getItem(STORAGE_KEY_OPTIONS);

    let messages: ChatMessage[] | null = null;
    if (rawMessages) {
      const parsed = JSON.parse(rawMessages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        messages = parsed;
      }
    }

    let options: string[] | null = null;
    if (rawOptions) {
      try {
        const parsed = JSON.parse(rawOptions);
        if (Array.isArray(parsed)) {
          options = parsed;
        }
      } catch {
        // ignore
      }
    }

    return { seen, messages, options };
  } catch {
    return { seen: false, messages: null, options: null };
  }
}

export function saveSessionMessages(
  messages: ChatMessage[],
  options?: string[] | null,
  markSeen = true,
): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    if (markSeen) {
      sessionStorage.setItem(STORAGE_KEY_SEEN, "true");
    }
    if (options && options.length > 0) {
      sessionStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
    } else {
      sessionStorage.removeItem(STORAGE_KEY_OPTIONS);
    }
  } catch {
    // ignore
  }
}
