import { describe, it, expect, vi } from "vitest";
import {
  mapQualificationToProfession,
  validateLeadPayload,
  submitStudentEnquiry,
} from "@/lib/lead-submission";

describe("Lead Submission Service", () => {
  it("maps all 3 qualifications correctly to database profession values", () => {
    expect(mapQualificationToProfession("Graduate or above")).toBe("Graduate or above");
    expect(mapQualificationToProfession("Pursuing Graduation")).toBe("Undergraduate");
    expect(mapQualificationToProfession("Class 12 or below")).toBe("Class 12 or below");
  });

  it("validates 10-digit Indian phone numbers starting with 1-9", () => {
    expect(
      validateLeadPayload({
        student_name: "Rahul",
        phone_number: "9876543210",
        qualification: "Graduate or above",
      }).valid,
    ).toBe(true);

    expect(
      validateLeadPayload({
        student_name: "Rahul",
        phone_number: "0987654321", // starts with 0
        qualification: "Graduate or above",
      }).valid,
    ).toBe(false);

    expect(
      validateLeadPayload({
        student_name: "Rahul",
        phone_number: "12345", // too short
        qualification: "Graduate or above",
      }).valid,
    ).toBe(false);
  });

  it("validates email formatting when email is provided", () => {
    expect(
      validateLeadPayload({
        student_name: "Rahul",
        phone_number: "9876543210",
        qualification: "Graduate or above",
        email: "rahul@example.com",
      }).valid,
    ).toBe(true);

    expect(
      validateLeadPayload({
        student_name: "Rahul",
        phone_number: "9876543210",
        qualification: "Graduate or above",
        email: "invalid-email",
      }).valid,
    ).toBe(false);
  });

  it("allows null or empty email for undergraduate and school-level leads", () => {
    expect(
      validateLeadPayload({
        student_name: "Rahul",
        phone_number: "9876543210",
        qualification: "Pursuing Graduation",
        email: null,
      }).valid,
    ).toBe(true);
  });

  it("successfully submits lead to Edge Function when fetch succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitStudentEnquiry(
      {
        student_name: "Rahul Sharma",
        phone_number: "9876543210",
        qualification: "Pursuing Graduation",
        email: null,
      },
      {
        supabaseUrl: "https://test.supabase.co",
        anonKey: "test-anon-key",
      },
    );

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
  });

  it("prevents duplicate submissions within the same session for identical lead", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // First submission
    const res1 = await submitStudentEnquiry(
      {
        student_name: "Anita Verma",
        phone_number: "9811223344",
        qualification: "Class 12 or below",
      },
      {
        supabaseUrl: "https://test.supabase.co",
        anonKey: "test-anon-key",
      },
    );
    expect(res1.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second submission with identical phone and qualification
    const res2 = await submitStudentEnquiry(
      {
        student_name: "Anita Verma",
        phone_number: "9811223344",
        qualification: "Class 12 or below",
      },
      {
        supabaseUrl: "https://test.supabase.co",
        anonKey: "test-anon-key",
      },
    );
    expect(res2.success).toBe(true);
    expect(res2.duplicate).toBe(true);
    // Should NOT have initiated a second network request
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("handles server failure with user-friendly error message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Database unavailable" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitStudentEnquiry(
      {
        student_name: "Vikram Singh",
        phone_number: "9988776655",
        qualification: "Graduate or above",
        email: "vikram@example.com",
      },
      {
        supabaseUrl: "https://test.supabase.co",
        anonKey: "test-anon-key",
      },
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("Database unavailable");
  });

  it("handles network failure gracefully", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Failed to fetch"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitStudentEnquiry(
      {
        student_name: "Pooja Patel",
        phone_number: "9822334455",
        qualification: "Pursuing Graduation",
      },
      {
        supabaseUrl: "https://test.supabase.co",
        anonKey: "test-anon-key",
      },
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Network error");
  });
});
