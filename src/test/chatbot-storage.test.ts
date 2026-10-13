import { describe, it, expect, beforeEach } from "vitest";
import {
  loadSavedLeadData,
  saveSessionLeadData,
  recoverPhoneFromMessages,
  loadSessionMessages,
  saveSessionMessages,
} from "../components/chatbot/utils/chatbot-storage";
import type { ChatMessage } from "../components/chatbot/chatbot-types";

describe("chatbot-storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("lead data storage", () => {
    it("returns null when no lead data exists", () => {
      expect(loadSavedLeadData()).toBeNull();
    });

    it("saves and reloads lead data", () => {
      saveSessionLeadData({
        phone: "9876543210",
        name: "Aman",
        qualification: "Pursuing Graduation",
      });

      const loaded = loadSavedLeadData();
      expect(loaded).toEqual({
        phone: "9876543210",
        name: "Aman",
        qualification: "Pursuing Graduation",
        email: undefined,
      });
    });
  });

  describe("recoverPhoneFromMessages", () => {
    it("recovers 10 digit number from user messages with +91 prefix", () => {
      const messages: ChatMessage[] = [
        { id: "1", sender: "bot", text: "Please provide contact", timestamp: "10:00" },
        { id: "2", sender: "user", text: "+91 9876543210", timestamp: "10:01" },
      ];
      expect(recoverPhoneFromMessages(messages)).toBe("9876543210");
    });

    it("returns null if no valid phone found in user messages", () => {
      const messages: ChatMessage[] = [
        { id: "1", sender: "user", text: "Hello", timestamp: "10:00" },
        { id: "2", sender: "user", text: "12345", timestamp: "10:01" },
      ];
      expect(recoverPhoneFromMessages(messages)).toBeNull();
    });
  });

  describe("session messages storage", () => {
    it("saves and reloads chat messages and options", () => {
      const msgs: ChatMessage[] = [{ id: "1", sender: "bot", text: "Welcome", timestamp: "10:00" }];
      const opts = ["Explore Courses", "Wish to talk to counselor"];

      saveSessionMessages(msgs, opts, true);
      const session = loadSessionMessages();

      expect(session.seen).toBe(true);
      expect(session.messages).toEqual(msgs);
      expect(session.options).toEqual(opts);
    });

    it("removes options key if options is null or empty", () => {
      const msgs: ChatMessage[] = [{ id: "1", sender: "bot", text: "Welcome", timestamp: "10:00" }];
      saveSessionMessages(msgs, null);
      const session = loadSessionMessages();

      expect(session.options).toBeNull();
    });
  });
});
