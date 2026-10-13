import {
  EXPLORING_FOLLOWUP_OPTIONS,
  AKSNOVA_DOMAIN_OPTIONS,
  DOMAIN_DETAILS,
} from "@/data/chatbot-courses";
import type { ChatInputMode } from "../chatbot-types";

export const QUALIFICATION_OPTIONS = [
  "Graduate or above",
  "Pursuing Graduation",
  "Class 12 or below",
] as const;

export type QualificationOption = (typeof QUALIFICATION_OPTIONS)[number];

export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function isChatPhoneValid(phone: string): boolean {
  return /^[1-9][0-9]{9}$/.test(phone);
}

export function isChatEmailValid(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

export function isChatNameValid(name: string): boolean {
  return name.trim().length > 0;
}

export function isChatTextValid(text: string): boolean {
  return text.trim().length > 0;
}

export interface ConversationalResponse {
  botReplyText: string;
  nextOptions: string[] | null;
  nextInputMode: ChatInputMode;
}

/**
 * Computes pure conversational bot responses for non-lead options.
 */
export function computeConversationalReply(optionText: string): ConversationalResponse {
  const lower = optionText.toLowerCase();

  if (lower === "i am just exploring") {
    return {
      botReplyText: "Could you please elaborate what you are looking for?",
      nextOptions: [...EXPLORING_FOLLOWUP_OPTIONS],
      nextInputMode: null,
    };
  }

  if (lower === "not sure of a specific program") {
    return {
      botReplyText: "Please select domain of your interest!",
      nextOptions: [...AKSNOVA_DOMAIN_OPTIONS],
      nextInputMode: null,
    };
  }

  if (lower === "i'm just looking around") {
    return {
      botReplyText:
        "Take your time! You can explore our job-ready diploma courses, student placement records, and free learning roadmaps whenever you're ready.",
      nextOptions: ["Explore Courses", "Wish to talk to counselor", "Explore other domains"],
      nextInputMode: null,
    };
  }

  if (lower === "wish to talk to counselor") {
    return {
      botReplyText:
        "Please provide your 10-digit mobile number so our counselor will connect with you.",
      nextOptions: null,
      nextInputMode: "phone",
    };
  }

  if (
    optionText === "I am looking for career growth/transition" ||
    lower.includes("career growth")
  ) {
    return {
      botReplyText: "May I know your name please to begin with?",
      nextOptions: null,
      nextInputMode: "name",
    };
  }

  if (optionText === "Learn about AKSNOVA programs" || lower.includes("learn about")) {
    return {
      botReplyText:
        "We offer comprehensive, career-focused diploma programs and advanced certifications with 250+ hiring partners. Please select domain of your interest to learn more:",
      nextOptions: [...AKSNOVA_DOMAIN_OPTIONS],
      nextInputMode: null,
    };
  }

  if (optionText in DOMAIN_DETAILS && DOMAIN_DETAILS[optionText]) {
    const domainInfo = DOMAIN_DETAILS[optionText];
    return {
      botReplyText: `${domainInfo?.summary}\n\nWould you like to review full curriculum details or connect with our career advisor?`,
      nextOptions: ["Explore Courses", "Wish to talk to counselor", "Explore other domains"],
      nextInputMode: null,
    };
  }

  if (optionText === "Explore other domains") {
    return {
      botReplyText: "Please select domain of your interest!",
      nextOptions: [...AKSNOVA_DOMAIN_OPTIONS],
      nextInputMode: null,
    };
  }

  if (
    optionText === "Graduate or above" ||
    lower.includes("graduate and above") ||
    lower.includes("graduate or above")
  ) {
    return {
      botReplyText:
        "Please provide your email id for the live chat agent to assist you further. ✍️",
      nextOptions: null,
      nextInputMode: "email",
    };
  }

  if (optionText === "Explore Courses") {
    return {
      botReplyText:
        "You can check out our complete course catalog with detailed modules, projects, and roadmaps in our Courses section!",
      nextOptions: ["Wish to talk to counselor", "Explore other domains"],
      nextInputMode: null,
    };
  }

  return {
    botReplyText:
      "Thank you for sharing! Our career counseling team is happy to assist you with any questions about our curriculum, batches, and placements.",
    nextOptions: null,
    nextInputMode: null,
  };
}
