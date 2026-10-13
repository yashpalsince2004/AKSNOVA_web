import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  DEFAULT_MESSAGES,
  INITIAL_USER_QUESTIONS,
  EXPLORING_FOLLOWUP_OPTIONS,
  AKSNOVA_DOMAIN_OPTIONS,
  DOMAIN_DETAILS,
} from "@/data/chatbot-courses";
import { submitStudentEnquiry } from "@/lib/lead-submission";
import type { ChatMessage, ChatInputMode, ChatbotWidgetProps } from "../chatbot-types";
import { QUALIFICATION_OPTIONS, isChatPhoneValid, isChatEmailValid } from "../utils/chatbot-logic";
import {
  loadSavedLeadData,
  saveSessionLeadData,
  recoverPhoneFromMessages,
  loadSessionMessages,
  saveSessionMessages,
} from "../utils/chatbot-storage";

export function useChatbot({
  brandVariant = "aksnova",
  welcomeMessage,
  programsIntroMessage,
  initialQuestions,
}: ChatbotWidgetProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [chatInputMode, setChatInputMode] = useState<ChatInputMode>(null);
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
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSequenceRunningRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const userNameRef = useRef("");
  const userEmailRef = useRef("");
  const userPhoneRef = useRef("");
  const userQualificationRef = useRef("");

  const syncAndSaveLeadData = useCallback(() => {
    saveSessionLeadData({
      phone: userPhoneRef.current,
      name: userNameRef.current,
      qualification: userQualificationRef.current,
      email: userEmailRef.current,
    });
  }, []);

  const activeInitialQuestions = useMemo(
    () => initialQuestions || [...INITIAL_USER_QUESTIONS],
    [initialQuestions],
  );

  const activeWelcomeMessage =
    welcomeMessage || DEFAULT_MESSAGES[brandVariant]?.welcome || DEFAULT_MESSAGES.aksnova.welcome;
  const activeProgramsIntroMessage =
    programsIntroMessage ||
    DEFAULT_MESSAGES[brandVariant]?.programsIntro ||
    DEFAULT_MESSAGES.aksnova.programsIntro;

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
    const savedLead = loadSavedLeadData();
    if (savedLead) {
      if (savedLead.phone) userPhoneRef.current = savedLead.phone;
      if (savedLead.name) {
        userNameRef.current = savedLead.name;
        setUserName(savedLead.name);
      }
      if (savedLead.qualification) userQualificationRef.current = savedLead.qualification;
      if (savedLead.email) {
        userEmailRef.current = savedLead.email;
        setUserEmail(savedLead.email);
      }
    }

    const { seen, messages: savedMsgs, options: savedOpts } = loadSessionMessages();

    if (savedMsgs && savedMsgs.length > 0) {
      setMessages(savedMsgs);
      setHasUnread(false);

      if (!userPhoneRef.current) {
        const recoveredPhone = recoverPhoneFromMessages(savedMsgs);
        if (recoveredPhone) {
          userPhoneRef.current = recoveredPhone;
        }
      }

      if (savedOpts) {
        setQuickOptions(savedOpts);
      }
      return;
    }

    if (seen) {
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

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [activeWelcomeMessage, activeProgramsIntroMessage, activeInitialQuestions]);

  // Scroll whenever messages change or typing changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, quickOptions, isOpen]);

  // Auto-dismiss popup after submission with clean timer cleanup
  useEffect(() => {
    if (callbackSubmitted) {
      dismissTimerRef.current = setTimeout(() => {
        setIsCallbackModalOpen(false);
        setCallbackSubmitted(false);
        setPhoneTouched(false);
      }, 3500);
    }
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [callbackSubmitted]);

  // Keyboard shortcut: Escape to close chat or speed dial
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpen) {
          setIsOpen(false);
          setIsSpeedDialOpen(false);
        } else if (isSpeedDialOpen) {
          setIsSpeedDialOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSpeedDialOpen]);

  // Handle panel open and trigger welcome sequence if not previously run
  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);

    if (messages.length > 0 || isSequenceRunningRef.current) {
      return;
    }

    isSequenceRunningRef.current = true;
    const msg1Time = getTimestamp();

    const firstMsg: ChatMessage = {
      id: "welcome-1",
      sender: "bot",
      text: activeWelcomeMessage,
      timestamp: msg1Time,
    };

    setMessages([firstMsg]);
    setIsTyping(true);

    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      const secondMsg: ChatMessage = {
        id: "welcome-2",
        sender: "bot",
        text: activeProgramsIntroMessage,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === "welcome-2")) return prev;
        const updated = [...prev, secondMsg];
        saveSessionMessages(updated, activeInitialQuestions, true);
        return updated;
      });

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

  // Callback modal handlers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "");
    }
    digits = digits.slice(0, 10);
    setPhoneNumber(digits);
    setPhoneTouched(true);
    if (callbackSubmitted) {
      setCallbackSubmitted(false);
    }
  };

  const isPhoneValid = isChatPhoneValid(phoneNumber);

  const handleCallbackSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    setCallbackSubmitted(true);
  };

  const handleCloseCallbackModal = () => {
    setIsCallbackModalOpen(false);
    setCallbackSubmitted(false);
    setPhoneTouched(false);
  };

  // Chat counselor & career transition handlers
  const isChatNameValid = chatNameInput.trim().length > 0;

  const handleChatNameSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isChatNameValid) return;

    const trimmedName = chatNameInput.trim();
    userNameRef.current = trimmedName;
    setUserName(trimmedName);
    syncAndSaveLeadData();

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

      saveSessionMessages(finalMessages, null);
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  const handleChatPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "");
    }
    digits = digits.slice(0, 10);
    setChatPhoneNumber(digits);
  };

  const isCurrentChatPhoneValid = isChatPhoneValid(chatPhoneNumber);

  const handleChatPhoneSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isCurrentChatPhoneValid) return;

    const submittedPhone = chatPhoneNumber;
    userPhoneRef.current = submittedPhone;
    syncAndSaveLeadData();
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

      saveSessionMessages(finalMessages, nextOptions);
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  const isCurrentChatEmailValid = isChatEmailValid(chatEmailInput);

  const handleChatEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/\s/g, "");
    setChatEmailInput(sanitized);
  };

  const handleChatEmailSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isCurrentChatEmailValid || isTyping || isSubmittingRef.current) return;

    const submittedEmail = chatEmailInput.trim().toLowerCase();
    setUserEmail(submittedEmail);
    userEmailRef.current = submittedEmail;
    syncAndSaveLeadData();

    const targetName = userNameRef.current || userName || "Prospective Student";
    const targetPhone = userPhoneRef.current || chatPhoneNumber;
    const targetQual = userQualificationRef.current || "Graduate or above";

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

    saveSessionMessages(newMessages, null);

    if (!targetPhone) {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Please provide your contact number first so we can connect you with our counselor.",
        timestamp: getTimestamp(),
      };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      setQuickOptions(null);
      setChatInputMode("phone");
      return;
    }

    isSubmittingRef.current = true;
    try {
      const [res] = await Promise.all([
        submitStudentEnquiry({
          student_name: targetName,
          phone_number: targetPhone,
          qualification: targetQual,
          email: submittedEmail,
        }),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      setIsTyping(false);

      if (res.success) {
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

        saveSessionMessages(finalMessages, null);
      } else {
        const botMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: `We could not record your details with the counselor server (${res.error || "server unavailable"}). Would you like to retry?`,
          timestamp: getTimestamp(),
        };
        const nextOptions = [
          "Retry connecting to counselor",
          "Explore Courses",
          "Explore other domains",
        ];
        const finalMessages = [...newMessages, botMsg];
        setMessages(finalMessages);
        setQuickOptions(nextOptions);
        setChatInputMode(null);

        saveSessionMessages(finalMessages, nextOptions);
      }
    } catch {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "Network error occurred while connecting to Admission Counselor. Please tap Retry below.",
        timestamp: getTimestamp(),
      };
      const nextOptions = [
        "Retry connecting to counselor",
        "Explore Courses",
        "Explore other domains",
      ];
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      setQuickOptions(nextOptions);
      setChatInputMode(null);

      saveSessionMessages(finalMessages, nextOptions);
    } finally {
      isSubmittingRef.current = false;
      setTimeout(() => scrollToBottom(), 50);
    }
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

      saveSessionMessages(finalMessages, null);
      setTimeout(() => scrollToBottom(), 50);
    }, 600);
  };

  // Handle clicking on a predefined quick reply option
  const handleSelectOption = async (optionText: string) => {
    if (isTyping || isSubmittingRef.current) return;

    setChatInputMode(null);

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

    saveSessionMessages(newMessages, null, true);

    if ((QUALIFICATION_OPTIONS as readonly string[]).includes(optionText)) {
      userQualificationRef.current = optionText;
      syncAndSaveLeadData();
    }

    const isQualificationLead =
      optionText === "Pursuing Graduation" || optionText === "Class 12 or below";
    const isRetry =
      optionText === "Retry Request" || optionText === "Retry connecting to counselor";

    // Counselor Lead Submission Path (Class 12 or below, Pursuing Graduation, or Retry)
    if (isQualificationLead || (isRetry && userQualificationRef.current !== "Graduate or above")) {
      const targetQual = isRetry
        ? userQualificationRef.current || "Pursuing Graduation"
        : optionText;
      const targetPhone = userPhoneRef.current || chatPhoneNumber;
      const targetName = userNameRef.current || userName || "Prospective Student";
      const targetEmail = null;

      if (!targetPhone) {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Please provide your 10-digit mobile number so our counselor will connect with you.",
          timestamp: getTimestamp(),
        };
        const finalMessages = [...newMessages, botMsg];
        setMessages(finalMessages);
        setQuickOptions(null);
        setChatInputMode("phone");
        saveSessionMessages(finalMessages, null);
        setTimeout(() => scrollToBottom(), 50);
        return;
      }

      isSubmittingRef.current = true;
      try {
        const [res] = await Promise.all([
          submitStudentEnquiry(
            {
              student_name: targetName,
              phone_number: targetPhone,
              qualification: targetQual,
              email: targetEmail,
            },
            isRetry ? { bypassCache: true } : undefined,
          ),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);

        setIsTyping(false);

        let botReplyText = "";
        let nextOptions: string[] | null = null;

        if (res.success) {
          const effectiveQual = userQualificationRef.current || targetQual;
          const currentName = userNameRef.current || userName;
          const greeting =
            currentName && currentName !== "Prospective Student"
              ? `Thank you, ${currentName}!`
              : "Thank you!";
          botReplyText = `${greeting} We have noted your qualification (${effectiveQual}). Our senior career counselor will connect with you shortly between 9 AM to 9 PM to recommend programs suited to your background.`;
          nextOptions = ["Explore Courses", "Explore other domains"];
        } else {
          botReplyText = `We could not record your request at this moment (${res.error || "server unavailable"}). Please tap "Retry Request" to try again.`;
          nextOptions = ["Retry Request", "Explore Courses", "Explore other domains"];
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
        setChatInputMode(null);

        saveSessionMessages(finalMessages, nextOptions);
      } catch {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Network error occurred while connecting to the admission service. Please tap Retry Request below.",
          timestamp: getTimestamp(),
        };
        const finalMessages = [...newMessages, botMsg];
        const nextOptions = ["Retry Request", "Explore Courses", "Explore other domains"];
        setMessages(finalMessages);
        setQuickOptions(nextOptions);
        setChatInputMode(null);

        saveSessionMessages(finalMessages, nextOptions);
      } finally {
        isSubmittingRef.current = false;
        setTimeout(() => scrollToBottom(), 50);
      }
      return;
    }

    // Graduate Retry Path
    if (isRetry && userQualificationRef.current === "Graduate or above") {
      const targetPhone = userPhoneRef.current || chatPhoneNumber;
      const targetName = userNameRef.current || userName || "Prospective Student";
      const targetEmail = userEmailRef.current || null;

      if (!targetPhone) {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Please provide your 10-digit mobile number so our counselor will connect with you.",
          timestamp: getTimestamp(),
        };
        const finalMessages = [...newMessages, botMsg];
        setMessages(finalMessages);
        setQuickOptions(null);
        setChatInputMode("phone");
        saveSessionMessages(finalMessages, null);
        setTimeout(() => scrollToBottom(), 50);
        return;
      }

      if (!targetEmail) {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Please provide your email id for the live chat agent to assist you further. ✍️",
          timestamp: getTimestamp(),
        };
        const finalMessages = [...newMessages, botMsg];
        setMessages(finalMessages);
        setQuickOptions(null);
        setChatInputMode("email");
        saveSessionMessages(finalMessages, null);
        setTimeout(() => scrollToBottom(), 50);
        return;
      }

      isSubmittingRef.current = true;
      try {
        const [res] = await Promise.all([
          submitStudentEnquiry(
            {
              student_name: targetName,
              phone_number: targetPhone,
              qualification: "Graduate or above",
              email: targetEmail,
            },
            { bypassCache: true },
          ),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);

        setIsTyping(false);
        let botReplyText = "";
        let nextOptions: string[] | null = null;
        let nextInputMode: ChatInputMode = null;

        if (res.success) {
          botReplyText = "Please wait while I connect you with our Admission Counselor!";
          nextInputMode = "text";
          nextOptions = null;
        } else {
          botReplyText = `We could not record your details with the counselor server (${res.error || "server unavailable"}). Would you like to retry?`;
          nextOptions = [
            "Retry connecting to counselor",
            "Explore Courses",
            "Explore other domains",
          ];
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

        saveSessionMessages(finalMessages, nextOptions);
      } catch {
        setIsTyping(false);
        const botMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Network error occurred while connecting to Admission Counselor. Please tap Retry below.",
          timestamp: getTimestamp(),
        };
        const finalMessages = [...newMessages, botMsg];
        const nextOptions = [
          "Retry connecting to counselor",
          "Explore Courses",
          "Explore other domains",
        ];
        setMessages(finalMessages);
        setQuickOptions(nextOptions);
        setChatInputMode(null);

        saveSessionMessages(finalMessages, nextOptions);
      } finally {
        isSubmittingRef.current = false;
        setTimeout(() => scrollToBottom(), 50);
      }
      return;
    }

    // Conversational bot response with 600ms typing delay
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsTyping(false);

      let botReplyText = "";
      let nextOptions: string[] | null = null;
      let nextInputMode: ChatInputMode = null;

      if (optionText.toLowerCase() === "i am just exploring") {
        botReplyText = "Could you please elaborate what you are looking for?";
        nextOptions = [...EXPLORING_FOLLOWUP_OPTIONS];
      } else if (optionText.toLowerCase() === "not sure of a specific program") {
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

      saveSessionMessages(finalMessages, nextOptions);
    }, 600);
  };

  return {
    isOpen,
    isSpeedDialOpen,
    isCallbackModalOpen,
    phoneNumber,
    phoneTouched,
    callbackSubmitted,
    isPhoneValid,
    chatInputMode,
    chatNameInput,
    chatPhoneNumber,
    chatEmailInput,
    chatTextInput,
    hasUnread,
    isTyping,
    messages,
    quickOptions,
    messagesEndRef,
    isChatNameValid,
    isCurrentChatPhoneValid,
    isCurrentChatEmailValid,
    isChatTextValid,
    setIsOpen,
    setIsSpeedDialOpen,
    setIsCallbackModalOpen,
    setPhoneNumber,
    setCallbackSubmitted,
    setChatNameInput,
    setChatPhoneNumber,
    setChatEmailInput,
    setChatTextInput,
    handleOpen,
    handleClose,
    handleOpenChat,
    handlePhoneChange,
    handleCallbackSubmit,
    handleCloseCallbackModal,
    handleChatNameSubmit,
    handleChatPhoneChange,
    handleChatPhoneSubmit,
    handleChatEmailChange,
    handleChatEmailSubmit,
    handleChatTextSubmit,
    handleSelectOption,
  };
}
