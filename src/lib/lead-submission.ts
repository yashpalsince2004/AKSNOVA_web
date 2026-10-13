/**
 * Client lead submission service for the AKSNOVA Chatbot.
 * Submits validated student inquiries to the secure Supabase Edge Function.
 */

export interface LeadPayload {
  student_name: string;
  phone_number: string;
  qualification: "Graduate or above" | "Pursuing Graduation" | "Class 12 or below" | string;
  email?: string | null;
}

export interface LeadSubmissionResult {
  success: boolean;
  duplicate?: boolean | undefined;
  error?: string | undefined;
}

const submittedLeadsCache = new Set<string>();

/**
 * Normalizes user-facing qualification option to the database profession column value.
 */
export function mapQualificationToProfession(qualification: string): string {
  switch (qualification) {
    case "Graduate or above":
      return "Graduate or above";
    case "Pursuing Graduation":
      return "Undergraduate";
    case "Class 12 or below":
      return "Class 12 or below";
    default:
      return qualification;
  }
}

/**
 * Validates lead inputs before initiating network transmission.
 */
export function validateLeadPayload(payload: LeadPayload): { valid: boolean; error?: string } {
  const trimmedName = (payload.student_name || "").trim();
  if (!trimmedName || trimmedName.length > 100) {
    return { valid: false, error: "Please enter a valid name (1 to 100 characters)." };
  }

  const rawPhone = (payload.phone_number || "").replace(/\D/g, "");
  const normalizedPhone =
    rawPhone.startsWith("91") && rawPhone.length === 12 ? rawPhone.slice(2) : rawPhone;

  if (!/^[1-9][0-9]{9}$/.test(normalizedPhone)) {
    return { valid: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }

  const profession = mapQualificationToProfession(payload.qualification);
  const allowedProfessions = ["Graduate or above", "Undergraduate", "Class 12 or below"];
  if (!allowedProfessions.includes(profession)) {
    return { valid: false, error: "Please select a valid educational qualification." };
  }

  if (payload.email && payload.email.trim().length > 0) {
    const trimmedEmail = payload.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      return { valid: false, error: "Please enter a valid email address." };
    }
  }

  return { valid: true };
}

/**
 * Dispatches the student enquiry to the Supabase Edge Function `submit-enquiry`.
 */
export async function submitStudentEnquiry(
  payload: LeadPayload,
  configOverrides?: { supabaseUrl?: string; anonKey?: string; endpoint?: string },
): Promise<LeadSubmissionResult> {
  const validation = validateLeadPayload(payload);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const trimmedName = payload.student_name.trim();
  const rawPhone = payload.phone_number.replace(/\D/g, "");
  const normalizedPhone =
    rawPhone.startsWith("91") && rawPhone.length === 12 ? rawPhone.slice(2) : rawPhone;
  const profession = mapQualificationToProfession(payload.qualification);
  const normalizedEmail =
    payload.email && payload.email.trim().length > 0 ? payload.email.trim().toLowerCase() : null;

  // Duplicate guard: prevent re-submitting same student & phone in the active session
  const cacheKey = `${normalizedPhone}:${profession}`;
  if (submittedLeadsCache.has(cacheKey)) {
    return { success: true, duplicate: true };
  }

  const supabaseUrl =
    configOverrides?.supabaseUrl ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env["PUBLIC_SUPABASE_URL"] || import.meta.env["SUPABASE_URL"]
      : undefined) ||
    (typeof process !== "undefined" && process.env
      ? process.env["PUBLIC_SUPABASE_URL"] || process.env["SUPABASE_URL"]
      : "") ||
    "";

  const anonKey =
    configOverrides?.anonKey ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env["PUBLIC_SUPABASE_ANON_KEY"] || import.meta.env["SUPABASE_ANON_KEY"]
      : undefined) ||
    (typeof process !== "undefined" && process.env
      ? process.env["PUBLIC_SUPABASE_ANON_KEY"] || process.env["SUPABASE_ANON_KEY"]
      : "") ||
    "";

  if (!supabaseUrl || !anonKey) {
    return {
      success: false,
      error: "Supabase configuration is unavailable. Please check your environment configuration.",
    };
  }

  const endpoint =
    configOverrides?.endpoint || `${supabaseUrl.replace(/\/+$/, "")}/functions/v1/submit-enquiry`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        student_name: trimmedName,
        phone_number: normalizedPhone,
        profession,
        email: normalizedEmail,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: (data && data.error) || "Unable to submit your enquiry at this moment.",
      };
    }

    // Cache successful submission
    submittedLeadsCache.add(cacheKey);

    return {
      success: true,
      duplicate: Boolean(data?.duplicate),
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "Request timed out. Please check your internet connection and try again.",
      };
    }

    return {
      success: false,
      error: "Network error occurred while connecting to the admission service.",
    };
  }
}
