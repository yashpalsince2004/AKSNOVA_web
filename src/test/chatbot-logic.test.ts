import { describe, it, expect } from "vitest";
import {
  isChatPhoneValid,
  isChatEmailValid,
  isChatNameValid,
  isChatTextValid,
  computeConversationalReply,
  QUALIFICATION_OPTIONS,
} from "@/components/chatbot/utils/chatbot-logic";

describe("Chatbot Logic & Validators", () => {
  it("validates qualification options list", () => {
    expect(QUALIFICATION_OPTIONS).toContain("Graduate or above");
    expect(QUALIFICATION_OPTIONS).toContain("Pursuing Graduation");
    expect(QUALIFICATION_OPTIONS).toContain("Class 12 or below");
    expect(QUALIFICATION_OPTIONS).toHaveLength(3);
  });

  it("validates 10-digit Indian phone numbers", () => {
    expect(isChatPhoneValid("9876543210")).toBe(true);
    expect(isChatPhoneValid("1234567890")).toBe(true);
    expect(isChatPhoneValid("0987654321")).toBe(false); // starts with 0
    expect(isChatPhoneValid("987654321")).toBe(false); // only 9 digits
    expect(isChatPhoneValid("98765432100")).toBe(false); // 11 digits
    expect(isChatPhoneValid("abc1234567")).toBe(false);
  });

  it("validates emails correctly", () => {
    expect(isChatEmailValid("student@example.com")).toBe(true);
    expect(isChatEmailValid("user.name+tag@domain.co.in")).toBe(true);
    expect(isChatEmailValid("invalid-email")).toBe(false);
    expect(isChatEmailValid("user@domain")).toBe(false);
    expect(isChatEmailValid("")).toBe(false);
  });

  it("validates name input", () => {
    expect(isChatNameValid("Rahul")).toBe(true);
    expect(isChatNameValid("   ")).toBe(false);
    expect(isChatNameValid("")).toBe(false);
  });

  it("validates chat text input", () => {
    expect(isChatTextValid("Hello")).toBe(true);
    expect(isChatTextValid("   ")).toBe(false);
    expect(isChatTextValid("")).toBe(false);
  });

  it("computes conversational replies for standard user intents", () => {
    const exploring = computeConversationalReply("I am just exploring");
    expect(exploring.botReplyText).toContain("elaborate");
    expect(exploring.nextOptions).not.toBeNull();
    expect(exploring.nextInputMode).toBeNull();

    const counselor = computeConversationalReply("Wish to talk to counselor");
    expect(counselor.nextInputMode).toBe("phone");
    expect(counselor.nextOptions).toBeNull();

    const graduate = computeConversationalReply("Graduate or above");
    expect(graduate.nextInputMode).toBe("email");
    expect(graduate.nextOptions).toBeNull();

    const career = computeConversationalReply("I am looking for career growth/transition");
    expect(career.nextInputMode).toBe("name");
    expect(career.nextOptions).toBeNull();
  });
});
