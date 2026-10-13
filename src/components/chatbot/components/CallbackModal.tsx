import React, { useEffect } from "react";
import { X, ChevronDown, Check, Phone } from "lucide-react";
import { isChatPhoneValid } from "../utils/chatbot-logic";

export interface CallbackModalProps {
  isOpen: boolean;
  phoneNumber: string;
  phoneTouched: boolean;
  callbackSubmitted: boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onClose: () => void;
}

export function CallbackModal({
  isOpen,
  phoneNumber,
  phoneTouched,
  callbackSubmitted,
  onPhoneChange,
  onSubmit,
  onClose,
}: CallbackModalProps) {
  // Escape key listener for callback modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isPhoneValid = isChatPhoneValid(phoneNumber);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="callback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Prominent White Close Button in Top-Right Corner */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close callback dialog"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-white/80 p-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-60 cursor-pointer"
      >
        <X className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.5]" />
      </button>

      {/* Centered Modal Card / Pop Success Card */}
      {callbackSubmitted ? (
        <div
          className="relative w-full max-w-[420px] rounded-[28px] sm:rounded-3xl bg-white px-8 py-10 sm:px-12 sm:py-12 text-center shadow-2xl animate-in zoom-in-90 fade-in duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Green Scalloped Verified Rosette Badge with 3D Shadow Base */}
          <div className="flex justify-center animate-in zoom-in-75 duration-300 delay-75 fill-mode-both">
            <svg
              className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-xs transition-transform duration-300 hover:scale-105"
              viewBox="0 0 100 105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Dark Navy / Indigo 3D Shadow Underlay */}
              <g fill="#181335" transform="translate(0, 5)">
                <rect x="18" y="18" width="64" height="64" rx="14" />
                <rect x="18" y="18" width="64" height="64" rx="14" transform="rotate(45 50 50)" />
              </g>

              {/* Vibrant Emerald Rosette Foreground */}
              <g fill="#10b981">
                <rect x="18" y="18" width="64" height="64" rx="14" />
                <rect x="18" y="18" width="64" height="64" rx="14" transform="rotate(45 50 50)" />
              </g>

              {/* Crisp Bold White Checkmark */}
              <path
                d="M34 50 L45 61 L67 39"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title & Subtitle Matching User Screenshot */}
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Thanks for update
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-medium text-zinc-600">
            Out team will reach out to you shortly
          </p>
        </div>
      ) : (
        <div
          className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-9 text-zinc-900 shadow-2xl animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={onSubmit}>
            {/* Header */}
            <h2
              id="callback-modal-title"
              className="text-2xl sm:text-3xl font-extrabold text-center text-zinc-900 tracking-tight"
            >
              Request a call back
            </h2>
            <p className="mt-2 text-center text-sm sm:text-base text-zinc-600 font-medium">
              Let us help you guide towards your career path.
            </p>

            {/* Phone Input */}
            <div className="mt-6">
              <div className="flex items-center rounded-xl border border-zinc-300 bg-white transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                {/* Flag & Country Code */}
                <div className="flex items-center gap-1.5 border-r border-zinc-200 px-3.5 py-3 text-sm sm:text-base font-semibold text-zinc-800 select-none">
                  <span className="text-lg leading-none" role="img" aria-label="India flag">
                    🇮🇳
                  </span>
                  <span>+91</span>
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </div>

                {/* Number Input (Only digits, max 10, no leading 0) */}
                <input
                  type="tel"
                  inputMode="numeric"
                  id="callback-phone-input"
                  aria-label="Phone number"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={onPhoneChange}
                  maxLength={10}
                  className="w-full bg-transparent px-3.5 py-3 text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                />
              </div>
              {phoneTouched && phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <p className="mt-1.5 text-xs text-amber-600 font-medium">
                  Please enter a valid 10-digit number ({phoneNumber.length}/10 digits entered).
                </p>
              )}
            </div>

            {/* Benefits List */}
            <div className="mt-6">
              <p className="text-sm sm:text-base font-bold text-zinc-900">
                We will give you a call between 9 AM to 9 PM.
              </p>
              <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm text-zinc-800">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-500 text-red-500">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>Non-biased career guidance</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-500 text-red-500">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>Counselling based on your skills and preference</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-500 text-red-500">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>No repetitive calls, only as per convenience</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={!isPhoneValid}
                className={`w-full rounded-xl py-3.5 text-center text-sm sm:text-base font-bold transition-all duration-200 ${
                  isPhoneValid
                    ? "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-deep cursor-pointer active:scale-[0.99]"
                    : "bg-[#c7c7c7] text-white cursor-not-allowed"
                }`}
              >
                Request a call back
              </button>
            </div>

            {/* Learner Support */}
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-zinc-700">
                OR contact our learner support. We are available 24/7.
              </p>
              <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* Indian Nationals */}
                <div className="w-full sm:w-1/2 flex flex-col items-start sm:items-center">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                    <span role="img" aria-label="India flag">
                      🇮🇳
                    </span>{" "}
                    Indian Nationals
                  </span>
                  <a
                    href="tel:18002102020"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-200"
                  >
                    <Phone className="h-4 w-4 fill-zinc-900 text-zinc-900" />
                    <span>1800 210 2020</span>
                  </a>
                </div>

                {/* Foreign Nationals */}
                <div className="w-full sm:w-1/2 flex flex-col items-start sm:items-center">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                    <span role="img" aria-label="Globe">
                      🌐
                    </span>{" "}
                    Foreign Nationals
                  </span>
                  <a
                    href="tel:+918045604032"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-200"
                  >
                    <Phone className="h-4 w-4 fill-zinc-900 text-zinc-900" />
                    <span>+918045604032</span>
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
