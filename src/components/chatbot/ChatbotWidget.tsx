import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Minus, Sparkles, ChevronRight, Phone, Check, ChevronDown, Send } from "lucide-react";
import {
  DEFAULT_MESSAGES,
  INITIAL_USER_QUESTIONS,
  EXPLORING_FOLLOWUP_OPTIONS,
  AKSNOVA_DOMAIN_OPTIONS,
  DOMAIN_DETAILS,
} from "@/data/chatbot-courses";
import { withBase } from "@/lib/paths";

const QUALIFICATION_OPTIONS = ["Graduate or above", "Pursuing Graduation", "Class 12 or below"];

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export interface ChatbotWidgetProps {
  brandVariant?: "aksnova";
  welcomeMessage?: string;
  programsIntroMessage?: string;
  instituteName?: string;
  initialQuestions?: string[];
}

const STORAGE_KEY_SEEN = "aksnova_chat_welcome_seen_v1";
const STORAGE_KEY_MESSAGES = "aksnova_chat_history_v1";
const STORAGE_KEY_OPTIONS = "aksnova_chat_options_v1";

export default function ChatbotWidget({
  brandVariant = "aksnova",
  welcomeMessage,
  programsIntroMessage,
  instituteName = "AKSNOVA",
  initialQuestions,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [chatInputMode, setChatInputMode] = useState<"name" | "phone" | "email" | "text" | null>(
    null,
  );
  const [chatNameInput, setChatNameInput] = useState("");
  const [chatPhoneNumber, setChatPhoneNumber] = useState("");
  const [chatEmailInput, setChatEmailInput] = useState("");
  const [chatTextInput, setChatTextInput] = useState("");
  const [userName, setUserName] = useState("");
  const [, setUserEmail] = useState("");
  const [hasUnread, setHasUnread] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickOptions, setQuickOptions] = useState<string[] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSequenceRunningRef = useRef(false);
  const userNameRef = useRef("");
  const userEmailRef = useRef("");

  // Default initial questions requested by the user
  const activeInitialQuestions = useMemo(
    () => initialQuestions || [...INITIAL_USER_QUESTIONS],
    [initialQuestions],
  );

  // Resolved copy
  const activeWelcomeMessage =
    welcomeMessage || DEFAULT_MESSAGES[brandVariant]?.welcome || DEFAULT_MESSAGES.aksnova.welcome;
  const activeProgramsIntroMessage =
    programsIntroMessage ||
    DEFAULT_MESSAGES[brandVariant]?.programsIntro ||
    DEFAULT_MESSAGES.aksnova.programsIntro;

  // Format timestamp helper
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Auto scroll to bottom
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  };

  // Initialize session state on mount
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY_SEEN);
      const saved = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      const savedOptions = sessionStorage.getItem(STORAGE_KEY_OPTIONS);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setHasUnread(false);
          if (savedOptions) {
            try {
              setQuickOptions(JSON.parse(savedOptions));
            } catch {
              // ignore json parse error
            }
          }
          return;
        }
      }

      if (seen === "true") {
        // Welcome flow previously seen in this session
        setMessages([
          {
            id: "welcome-1",
            sender: "bot",
            text: activeWelcomeMessage,
            timestamp: getTimestamp(),
          },
          {
            id: "welcome-2",
            sender: "bot",
            text: activeProgramsIntroMessage,
            timestamp: getTimestamp(),
          },
        ]);
        setHasUnread(false);
        setQuickOptions(activeInitialQuestions);
      }
    } catch {
      // sessionStorage unavailable or disabled
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeWelcomeMessage, activeProgramsIntroMessage, activeInitialQuestions]);

  // Scroll whenever messages change or typing changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, quickOptions, isOpen]);

  // Handle panel open and trigger welcome sequence if not previously run
  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);

    // If welcome messages are already populated, don't replay
    if (messages.length > 0 || isSequenceRunningRef.current) {
      return;
    }

    isSequenceRunningRef.current = true;
    const msg1Time = getTimestamp();

    // Step 1: Immediately show Message 1
    const firstMsg: ChatMessage = {
      id: "welcome-1",
      sender: "bot",
      text: activeWelcomeMessage,
      timestamp: msg1Time,
    };

    setMessages([firstMsg]);
    setIsTyping(true);

    // Step 2: After 1.4 seconds, show Message 2 and stop typing
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      const secondMsg: ChatMessage = {
        id: "welcome-2",
        sender: "bot",
        text: activeProgramsIntroMessage,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => {
        // Guard against duplicate insertion
        if (prev.some((m) => m.id === "welcome-2")) return prev;
        const updated = [...prev, secondMsg];
        try {
          sessionStorage.setItem(STORAGE_KEY_SEEN, "true");
          sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
          sessionStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(activeInitialQuestions));
        } catch {
          // ignore storage quota errors
        }
        return updated;
      });

      // Display the 3 initial questions
      setQuickOptions(activeInitialQuestions);
      isSequenceRunningRef.current = false;
    }, 1400);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSpeedDialOpen(false);
  };

  const handleOpenChat = () => {
    setIsSpeedDialOpen(false);
    handleOpen();
  };

  // Keyboard shortcut: Escape to close chat or speed dial
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpen) {
          handleClose();
        } else if (isSpeedDialOpen) {
          setIsSpeedDialOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSpeedDialOpen]);

  // Handle clicking on a predefined quick reply option
  const handleSelectOption = (optionText: string) => {
    if (isTyping) return;

    setChatInputMode(null);

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: optionText,
      timestamp: getTimestamp(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuickOptions(null);
    setIsTyping(true);

    try {
      sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(newMessages));
      sessionStorage.setItem(STORAGE_KEY_SEEN, "true");
      sessionStorage.removeItem(STORAGE_KEY_OPTIONS);
    } catch {
      // ignore storage error
    }

    // 2. Compute the bot's contextual response after short typing delay
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsTyping(false);

      let botReplyText = "";
      let nextOptions: string[] | null = null;
      let nextInputMode: "name" | "phone" | "email" | null = null;

      if (optionText.toLowerCase() === "i am just exploring") {
        // Step 2 from prompt:
        botReplyText = "Could you please elaborate what you are looking for?";
        nextOptions = [...EXPLORING_FOLLOWUP_OPTIONS];
      } else if (optionText.toLowerCase() === "not sure of a specific program") {
        // Step 3 from prompt: ask cross-question with AKSNOVA course domains
        botReplyText = "Please select domain of your interest!";
        nextOptions = [...AKSNOVA_DOMAIN_OPTIONS];
      } else if (optionText.toLowerCase() === "i'm just looking around") {
        botReplyText =
          "Take your time! You can explore our job-ready diploma courses, student placement records, and free learning roadmaps whenever you're ready.";
        nextOptions = ["Explore Courses", "Wish to talk to counselor", "Explore other domains"];
      } else if (optionText.toLowerCase() === "wish to talk to counselor") {
        botReplyText =
          "Please provide your 10-digit mobile number so our counselor will connect with you.";
        nextOptions = null;
        nextInputMode = "phone";
      } else if (
        optionText === "I am looking for career growth/transition" ||
        optionText.toLowerCase().includes("career growth")
      ) {
        botReplyText = "May I know your name please to begin with?";
        nextOptions = null;
        nextInputMode = "name";
      } else if (
        optionText === "Learn about AKSNOVA programs" ||
        optionText.toLowerCase().includes("learn about")
      ) {
        botReplyText =
          "We offer comprehensive, career-focused diploma programs and advanced certifications with 250+ hiring partners. Please select domain of your interest to learn more:";
        nextOptions = [...AKSNOVA_DOMAIN_OPTIONS];
      } else if (optionText in DOMAIN_DETAILS && DOMAIN_DETAILS[optionText]) {
        const domainInfo = DOMAIN_DETAILS[optionText];
        botReplyText = `${domainInfo?.summary}\n\nWould you like to review full curriculum details or connect with our career advisor?`;
        nextOptions = ["Explore Courses", "Wish to talk to counselor", "Explore other domains"];
      } else if (optionText === "Explore other domains") {
        botReplyText = "Please select domain of your interest!";
        nextOptions = [...AKSNOVA_DOMAIN_OPTIONS];
      } else if (
        optionText === "Graduate or above" ||
        optionText.toLowerCase().includes("graduate and above") ||
        optionText.toLowerCase().includes("graduate or above")
      ) {
        botReplyText =
          "Please provide your email id for the live chat agent to assist you further. ✍️";
        nextOptions = null;
        nextInputMode = "email";
      } else if (optionText === "Pursuing Graduation" || optionText === "Class 12 or below") {
        const currentName = userNameRef.current || userName;
        const greeting = currentName ? `Thank you, ${currentName}!` : "Thank you!";
        botReplyText = `${greeting} We have noted your qualification (${optionText}). Our senior career counselor will connect with you shortly between 9 AM to 9 PM to recommend programs suited to your background.`;
        nextOptions = ["Explore Courses", "Explore other domains"];
      } else if (optionText === "Explore Courses") {
        botReplyText =
          "You can check out our complete course catalog with detailed modules, projects, and roadmaps in our Courses section!";
        nextOptions = ["Wish to talk to counselor", "Explore other domains"];
      } else {
        botReplyText =
          "Thank you for sharing! Our career counseling team is happy to assist you with any questions about our curriculum, batches, and placements.";
        nextOptions = null;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReplyText,
        timestamp: getTimestamp(),
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      setQuickOptions(nextOptions);
      setChatInputMode(nextInputMode);

      try {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(finalMessages));
        if (nextOptions) {
          sessionStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(nextOptions));
        } else {
          sessionStorage.removeItem(STORAGE_KEY_OPTIONS);
        }
      } catch {
        // ignore storage error
      }
    }, 600);
  };

  // Escape key listener for callback modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCallbackModalOpen) {
        setIsCallbackModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCallbackModalOpen]);

  // Phone input rule handlers:
  // 1. Only numbers accepted (no letters or symbols)
  // 2. First digit cannot be 0
  // 3. Max length limited to 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Strip non-digits
    let digits = raw.replace(/\D/g, "");
    // Numbers starting with 0 are not accepted
    if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "");
    }
    // Limit to 10 digits
    digits = digits.slice(0, 10);
    setPhoneNumber(digits);
    setPhoneTouched(true);
    if (callbackSubmitted) {
      setCallbackSubmitted(false);
    }
  };

  // Submit button only enabled when all rules are satisfied:
  // Exactly 10 digits, digits only, starting with 1-9
  const isPhoneValid = /^[1-9][0-9]{9}$/.test(phoneNumber);

  const handleCallbackSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    setCallbackSubmitted(true);
  };

  // Auto-dismiss popup after submission with clean timer cleanup
  useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;
    if (callbackSubmitted) {
      dismissTimer = setTimeout(() => {
        handleCloseCallbackModal();
      }, 3500);
    }
    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [callbackSubmitted]);

  const handleCloseCallbackModal = () => {
    setIsCallbackModalOpen(false);
    setCallbackSubmitted(false);
    setPhoneTouched(false);
  };

  // Chat counselor & career transition handlers:
  const isChatNameValid = chatNameInput.trim().length > 0;

  const handleChatNameSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isChatNameValid) return;

    const trimmedName = chatNameInput.trim();
    userNameRef.current = trimmedName;
    setUserName(trimmedName);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedName,
      timestamp: getTimestamp(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatNameInput("");
    setChatInputMode(null);
    setIsTyping(true);
    setTimeout(() => scrollToBottom(), 50);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Please provide your contact number.",
        timestamp: getTimestamp(),
      };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      setQuickOptions(null);
      setChatInputMode("phone");

      try {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(finalMessages));
        sessionStorage.removeItem(STORAGE_KEY_OPTIONS);
      } catch {
        // ignore
      }
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  // Chat counselor phone input handlers:
  // 1. Only numbers accepted (no letters or symbols)
  // 2. Numbers starting with 0 are not accepted
  // 3. Limit is set to 10
  const handleChatPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "");
    }
    digits = digits.slice(0, 10);
    setChatPhoneNumber(digits);
  };

  const isChatPhoneValid = /^[1-9][0-9]{9}$/.test(chatPhoneNumber);

  const handleChatPhoneSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isChatPhoneValid) return;

    const submittedPhone = chatPhoneNumber;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `+91 ${submittedPhone}`,
      timestamp: getTimestamp(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatPhoneNumber("");
    setChatInputMode(null);
    setIsTyping(true);
    setTimeout(() => scrollToBottom(), 50);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Please share your highest qualification.",
        timestamp: getTimestamp(),
      };
      const finalMessages = [...newMessages, botMsg];
      const nextOptions = [...QUALIFICATION_OPTIONS];
      setMessages(finalMessages);
      setQuickOptions(nextOptions);

      try {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(finalMessages));
        sessionStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(nextOptions));
      } catch {
        // ignore
      }
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  // Chat student email handlers:
  // 1. Whitespace stripped automatically
  // 2. Standard email pattern: local@domain.tld with at least 2 char TLD
  // 3. Send button disabled until valid
  const isChatEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    chatEmailInput.trim(),
  );

  const handleChatEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Disallow whitespace in email input
    const sanitized = e.target.value.replace(/\s/g, "");
    setChatEmailInput(sanitized);
  };

  const handleChatEmailSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isChatEmailValid) return;

    const submittedEmail = chatEmailInput.trim().toLowerCase();
    setUserEmail(submittedEmail);
    userEmailRef.current = submittedEmail;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: submittedEmail,
      timestamp: getTimestamp(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatEmailInput("");
    setChatInputMode(null);
    setIsTyping(true);
    setTimeout(() => scrollToBottom(), 50);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Please wait while I connect you with our Admission Counselor!",
        timestamp: getTimestamp(),
      };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      setQuickOptions(null);
      setChatInputMode("text");

      try {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(finalMessages));
        sessionStorage.removeItem(STORAGE_KEY_OPTIONS);
      } catch {
        // ignore
      }
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  const isChatTextValid = chatTextInput.trim().length > 0;

  const handleChatTextSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isChatTextValid) return;

    const submittedText = chatTextInput.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: submittedText,
      timestamp: getTimestamp(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatTextInput("");
    setIsTyping(true);
    setTimeout(() => scrollToBottom(), 50);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Thank you for your message! Our Admission Counselor has received your note and will reply shortly.",
        timestamp: getTimestamp(),
      };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);

      try {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(finalMessages));
      } catch {
        // ignore
      }
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  return (
    <aside aria-label="Website Chatbot Assistant" className="relative">
      {/* Floating Speed Dial & Chat Launcher (Bottom-Right Corner) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6 flex flex-col items-end gap-3">
          {/* Rolled Upward Options */}
          {isSpeedDialOpen && (
            <>
              {/* Option 1 (Top): Chat with us */}
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-200">
                <span className="rounded-lg bg-black px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xl whitespace-nowrap">
                  Chat with us
                </span>
                <button
                  type="button"
                  onClick={handleOpenChat}
                  aria-label="Chat with us"
                  className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/30 transition-all duration-200 hover:scale-110 hover:bg-brand-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <img
                    src={withBase("/logos/aksnova-icon-dark.svg")}
                    alt="Chat with us"
                    className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                  />
                </button>
              </div>

              {/* Option 2 (Middle): Call me back */}
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <span className="rounded-lg bg-black px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xl whitespace-nowrap">
                  Call me back
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSpeedDialOpen(false);
                    setIsCallbackModalOpen(true);
                    setCallbackSubmitted(false);
                  }}
                  aria-label="Call me back"
                  className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/30 transition-all duration-200 hover:scale-110 hover:bg-brand-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                >
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 fill-white text-brand" />
                </button>
              </div>

              {/* Bottom Toggle Button: White Circle with Black X */}
              <button
                type="button"
                onClick={() => setIsSpeedDialOpen(false)}
                aria-label="Close options"
                className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white text-zinc-900 border border-zinc-200/90 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="h-6 w-6 text-zinc-900 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Initial Closed Floating Launcher Button */}
          {!isSpeedDialOpen && (
            <button
              type="button"
              onClick={() => setIsSpeedDialOpen(true)}
              aria-label="Chatbot options"
              aria-expanded={false}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/25 transition-all duration-200 hover:scale-110 hover:bg-brand-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {/* Notification Pulse Indicator */}
              {hasUnread && (
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-red-500" />
                </span>
              )}

              {/* Message Logo */}
              <img
                src={withBase("/logos/aksnova-icon-dark.svg")}
                alt="AKSNOVA chatbot"
                className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          )}
        </div>
      )}

      {/* Floating Chatbot Panel (Bottom-Right Corner) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
          className="fixed bottom-20 right-4 z-50 flex h-[550px] max-h-[calc(100vh-5rem)] w-[calc(100vw-2rem)] sm:w-[410px] max-w-[440px] flex-col rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-300 md:bottom-6 md:right-6 animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 bg-secondary/50 px-4 py-3 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F2023] p-1.5 shadow-xs border border-border/70 overflow-hidden">
                <img
                  src={withBase("/logos/aksnova-app-icon.svg")}
                  alt={`${instituteName} logo`}
                  className="h-full w-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = withBase(
                      "/logos/aksnova-app-icon.png",
                    );
                  }}
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500"
                  title="Online"
                />
              </div>
              <div>
                <h2 id="chatbot-title" className="text-sm font-bold text-foreground">
                  We are online!
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{instituteName} Support</span>
                </p>
              </div>
            </div>

            {/* Minimize / Close Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClose}
                aria-label="Minimize chat"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                title="Minimize chat"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth"
            aria-live="polite"
            tabIndex={0}
            role="log"
            aria-label="Conversation history"
          >
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-sm shadow-xs ${
                      isBot
                        ? "rounded-tl-xs border border-border/70 bg-card text-foreground"
                        : "rounded-tr-xs bg-brand text-white font-medium"
                    }`}
                  >
                    {msg.text.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-2.5" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Subtle Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-border/70 bg-card px-3.5 py-2.5 shadow-xs">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
                </div>
                <span className="text-xs text-muted-foreground italic">
                  {instituteName} is typing...
                </span>
              </div>
            )}

            {/* Interactive Predefined Question / Reply Options */}
            {quickOptions && quickOptions.length > 0 && !isTyping && (
              <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <p className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {quickOptions.length > 3 ? "Select a Domain:" : "Suggested Options:"}
                </p>
                {quickOptions.length > 3 ? (
                  /* Rectangle with Rounded Corners Grid/Wrap for Domains - Fitted to Text, Reduced Height */
                  <div className="flex flex-wrap items-start gap-1.5">
                    {quickOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className="group inline-flex w-fit items-center justify-center rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-center text-[11px] sm:text-xs font-semibold text-foreground shadow-2xs transition-all duration-150 hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
                      >
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Vertical Stack for Initial / Follow-up Options - Fitted to Text (Does Not Cover Whole Line), Reduced Height */
                  <div className="flex flex-col items-start gap-1.5">
                    {quickOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className="group inline-flex w-fit max-w-full items-center justify-between gap-2.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-left text-xs sm:text-sm font-medium text-foreground shadow-2xs transition-all hover:border-brand hover:bg-brand/10 hover:text-brand active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
                      >
                        <span>{option}</span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-brand" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Area: Input Area with Send Button when asking for name or phone, or Default Guidance Footer */}
          {chatInputMode === "name" ? (
            <form
              onSubmit={handleChatNameSubmit}
              className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                <input
                  type="text"
                  id="chat-name-input"
                  aria-label="Enter your name"
                  placeholder="Enter your name..."
                  value={chatNameInput}
                  onChange={(e) => setChatNameInput(e.target.value)}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!isChatNameValid}
                  aria-label="Send name"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isChatNameValid
                      ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                      : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : chatInputMode === "phone" ? (
            <form
              onSubmit={handleChatPhoneSubmit}
              className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                {/* Country Prefix */}
                <span className="flex items-center gap-1 pl-2 text-xs font-semibold text-muted-foreground select-none">
                  <span role="img" aria-label="India flag">
                    🇮🇳
                  </span>{" "}
                  +91
                </span>
                {/* Phone Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  id="chat-counselor-phone-input"
                  aria-label="Enter your contact number"
                  placeholder="Enter 10-digit mobile number"
                  value={chatPhoneNumber}
                  onChange={handleChatPhoneChange}
                  maxLength={10}
                  className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!isChatPhoneValid}
                  aria-label="Send number"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isChatPhoneValid
                      ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                      : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                <span>10 digits only, cannot start with 0</span>
                <span>{chatPhoneNumber.length}/10</span>
              </div>
            </form>
          ) : chatInputMode === "email" ? (
            <form
              onSubmit={handleChatEmailSubmit}
              className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  id="chat-email-input"
                  aria-label="Enter your email ID"
                  placeholder="Enter your email ID..."
                  value={chatEmailInput}
                  onChange={handleChatEmailChange}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!isChatEmailValid}
                  aria-label="Send email"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isChatEmailValid
                      ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                      : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                <span>Valid email format required (e.g. name@example.com)</span>
                {chatEmailInput.length > 0 && (
                  <span
                    className={
                      isChatEmailValid
                        ? "text-emerald-600 font-semibold"
                        : "text-amber-600 font-medium"
                    }
                  >
                    {isChatEmailValid ? "✓ Valid" : "Incomplete"}
                  </span>
                )}
              </div>
            </form>
          ) : chatInputMode === "text" ? (
            <form
              onSubmit={handleChatTextSubmit}
              className="border-t border-border/70 bg-secondary/40 p-2.5 sm:p-3 rounded-b-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                <input
                  type="text"
                  id="chat-counselor-message-input"
                  aria-label="Type your message"
                  placeholder="Type your message here..."
                  value={chatTextInput}
                  onChange={(e) => setChatTextInput(e.target.value)}
                  className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!isChatTextValid}
                  aria-label="Send message"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isChatTextValid
                      ? "bg-brand text-white shadow-xs hover:bg-brand-deep active:scale-95 cursor-pointer"
                      : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                <span>Connecting live with Admission Counselor</span>
                <span>Type and press send</span>
              </div>
            </form>
          ) : (
            <div className="border-t border-border/70 bg-secondary/40 px-4 py-3 rounded-b-2xl flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3 w-3 text-brand" />
                Guided Career Assistant
              </span>
              <span className="text-[10px]">Select an option above</span>
            </div>
          )}
        </div>
      )}

      {/* Request a Call Back Modal Popup (Centered with Dull / Dimmed Background) */}
      {isCallbackModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="callback-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseCallbackModal();
            }
          }}
        >
          {/* Prominent White Close Button in Top-Right Corner */}
          <button
            type="button"
            onClick={handleCloseCallbackModal}
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
                    <rect
                      x="18"
                      y="18"
                      width="64"
                      height="64"
                      rx="14"
                      transform="rotate(45 50 50)"
                    />
                  </g>

                  {/* Vibrant Emerald Rosette Foreground */}
                  <g fill="#10b981">
                    <rect x="18" y="18" width="64" height="64" rx="14" />
                    <rect
                      x="18"
                      y="18"
                      width="64"
                      height="64"
                      rx="14"
                      transform="rotate(45 50 50)"
                    />
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
              <form onSubmit={handleCallbackSubmit}>
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
                      onChange={handlePhoneChange}
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
      )}
    </aside>
  );
}
