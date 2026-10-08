import { useRef, useState } from "react";
import { withBase } from "@/lib/paths";

const ACCEPT = [".pdf", ".docx", ".txt"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MIN_CHARS = 200;

export default function ResumeBuilderApp() {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = (f?: File) => {
    if (!f) return;
    const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPT.includes(ext)) {
      setError("Please upload a PDF, DOCX or TXT file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("File is larger than 5 MB.");
      return;
    }
    setError("");
    setFile(f);
  };

  const ready = mode === "upload" ? Boolean(file) : text.trim().length >= MIN_CHARS;

  if (done) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rb-soft text-rb">
          <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Resume Received!</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Our AI parser is extracting your work experience, projects, and technologies. An AKSNOVA career mentor will help you tailor it for hiring partners.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setFile(null);
              setText("");
            }}
            className="rounded-xl bg-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-accent transition"
          >
            Upload Another Resume
          </button>
          <a
            href={withBase('/contact')}
            className="rounded-xl bg-rb px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition"
          >
            Schedule Mentor Review
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mode selection tabs */}
      <div role="tablist" className="inline-flex rounded-xl bg-secondary p-1">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "upload"}
          onClick={() => {
            setMode("upload");
            setError("");
          }}
          className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
            mode === "upload" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload file
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "paste"}
          onClick={() => {
            setMode("paste");
            setError("");
          }}
          className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
            mode === "paste" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Paste text
        </button>
      </div>

      {mode === "upload" ? (
        file ? (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rb-soft text-rb">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · Ready to parse</p>
            </div>
            <button
              type="button"
              aria-label="Remove selected file"
              onClick={() => setFile(null)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              handlePick(e.dataTransfer.files[0]);
            }}
            className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
              drag ? "border-rb bg-rb-soft" : "border-border hover:border-rb bg-background/50"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rb-soft text-rb">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="mt-4 text-base font-bold text-foreground">Drag & drop your resume here</span>
            <span className="mt-1 text-sm text-muted-foreground">
              or <span className="font-semibold text-rb underline">browse files</span> · PDF, DOCX or TXT up to 5 MB
            </span>
          </div>
        )
      ) : (
        <div className="mt-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 20000))}
            rows={10}
            placeholder="Paste the full text of your resume here (experience, projects, skills)..."
            className="w-full resize-y rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none transition focus:border-rb"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {text.trim().length < MIN_CHARS
              ? `At least ${MIN_CHARS} characters required (${text.trim().length} entered so far)`
              : `${text.trim().length} characters`}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
        className="hidden"
        onChange={(e) => {
          handlePick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your resume stays strictly private and is only used to build your career profile.
        </p>

        <button
          type="button"
          disabled={!ready}
          onClick={() => setDone(true)}
          className="group inline-flex h-11 items-center gap-2 rounded-xl bg-rb px-6 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Parse & Continue
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
