export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export type ChatInputMode = "name" | "phone" | "email" | "text" | null;

export interface ChatbotWidgetProps {
  brandVariant?: "aksnova" | undefined;
  welcomeMessage?: string | undefined;
  programsIntroMessage?: string | undefined;
  instituteName?: string | undefined;
  initialQuestions?: string[] | undefined;
}

export interface SavedLeadData {
  phone?: string | undefined;
  name?: string | undefined;
  qualification?: string | undefined;
  email?: string | null | undefined;
}

export const STORAGE_KEY_SEEN = "aksnova_chat_welcome_seen_v1";
export const STORAGE_KEY_MESSAGES = "aksnova_chat_history_v1";
export const STORAGE_KEY_OPTIONS = "aksnova_chat_options_v1";
export const STORAGE_KEY_LEAD_DATA = "aksnova_chat_lead_v1";
