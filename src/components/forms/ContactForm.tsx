import React, { useState } from "react";

const COURSES = [
  "Full Stack Web Development",
  "Data Science & Artificial Intelligence",
  "Cloud Computing & DevOps",
  "Cyber Security & Ethical Hacking",
  "Accounting with Tally Prime & GST",
  "Graphic Design & Visual Communication",
  "Python Programming Masterclass",
  "Java Enterprise Development",
  "Data Analytics with Power BI & SQL",
  "UI/UX Design & Prototyping",
  "Digital Marketing & Growth",
  "Software & Automation Testing",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus("error");
      setErrorMessage("Please provide both your name and phone number.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Simulate accessible form submission or real endpoint
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send enquiry. Please try calling directly.");
    }
  };

  const fieldClasses =
    "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-1 focus:ring-brand";

  if (status === "success") {
    return (
      <div className="rounded-[28px] border border-brand/40 bg-card p-8 text-center md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-foreground">Enquiry Received!</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. Our career counsellor will contact you shortly at <span className="font-semibold text-foreground">{formData.phone}</span>.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFormData({ name: "", phone: "", email: "", course: "", message: "" });
          }}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-secondary px-5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-accent transition"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid content-start gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Full Name <span className="text-brand">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Yashpal Sharma"
          maxLength={100}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Phone Number <span className="text-brand">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          required
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. +91 98765 43210"
          maxLength={15}
          className={fieldClasses}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. you@example.com"
          maxLength={255}
          className={fieldClasses}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Course of Interest
        </label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className={fieldClasses}
        >
          <option value="">Select a course or career goal</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Questions or Preferred Timings (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your background or specific questions..."
          maxLength={1000}
          className={fieldClasses}
        />
      </div>

      {status === "error" && (
        <div role="alert" className="sm:col-span-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2 flex h-12 items-center justify-center rounded-2xl bg-brand text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-md transition hover:bg-brand-deep disabled:opacity-50"
      >
        {status === "submitting" ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Request Free Callback"
        )}
      </button>
    </form>
  );
}
