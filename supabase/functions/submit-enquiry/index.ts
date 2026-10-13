import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const ALLOWED_ORIGINS = [
  "https://yashpalsince2004.github.io",
  "http://localhost:8080",
  "http://localhost:4321",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
];

const VALID_PROFESSIONS = ["Graduate or above", "Undergraduate", "Class 12 or below"] as const;

type Profession = (typeof VALID_PROFESSIONS)[number];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
  const allowOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
  };
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Only POST is supported." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return new Response(JSON.stringify({ error: "Malformed JSON payload." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawName = typeof body.student_name === "string" ? body.student_name.trim() : "";
    const rawPhone = typeof body.phone_number === "string" ? body.phone_number.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    let rawProfession = typeof body.profession === "string" ? body.profession.trim() : "";

    // Normalize raw qualification if sent directly
    if (rawProfession === "Pursuing Graduation") {
      rawProfession = "Undergraduate";
    }

    // 1. Validate student_name
    if (!rawName || rawName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid student name. Must be 1 to 100 characters." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2. Validate Indian phone number (10 digits, starts with 1-9)
    const phoneDigits = rawPhone.replace(/\D/g, "");
    const normalizedPhone =
      phoneDigits.startsWith("91") && phoneDigits.length === 12
        ? phoneDigits.slice(2)
        : phoneDigits;

    if (!/^[1-9][0-9]{9}$/.test(normalizedPhone)) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number. Must be a 10-digit Indian mobile number." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Validate profession / education level
    if (!VALID_PROFESSIONS.includes(rawProfession as Profession)) {
      return new Response(
        JSON.stringify({
          error: `Invalid profession. Allowed values: ${VALID_PROFESSIONS.join(", ")}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4. Validate email if present
    let validatedEmail: string | null = null;
    if (rawEmail && rawEmail.length > 0) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(rawEmail) || rawEmail.length > 150) {
        return new Response(JSON.stringify({ error: "Invalid email address format." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      validatedEmail = rawEmail;
    }

    // 5. Connect to Supabase using server-side service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey =
      Deno.env.get("AKSNOVA_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 6. Duplicate check: prevent re-inserting within 2 minutes for identical phone
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("student_enquiries")
      .select("id")
      .eq("phone_number", normalizedPhone)
      .gte("created_at", twoMinutesAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Enquiry already registered recently.",
          duplicate: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 7. Insert lead securely
    const { error: insertError } = await supabase.from("student_enquiries").insert({
      student_name: rawName,
      phone_number: normalizedPhone,
      email: validatedEmail,
      profession: rawProfession,
    });

    if (insertError) {
      console.error("Database insert error:", insertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to store enquiry. Please try again later." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Enquiry submitted successfully.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Unexpected handler exception:", errorMessage);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred while processing your request." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
