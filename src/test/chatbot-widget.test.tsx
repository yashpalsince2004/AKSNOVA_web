import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import { DIPLOMA_PROGRAMS_DATA } from "@/data/chatbot-courses";

describe("Chatbot Course Data & Program Catalog (PDF Specification)", () => {
  it("contains all 8 Professional Diploma Programs from the PDF", () => {
    const programs = DIPLOMA_PROGRAMS_DATA.professionalDiplomaPrograms;
    expect(programs).toHaveLength(8);
    expect(programs).toContain("Diploma Program in Data Science with AI");
    expect(programs).toContain("Diploma Program in Full Stack Python with Django");
    expect(programs).toContain("Diploma Program in Full Stack Java");
    expect(programs).toContain("Diploma Program in Full Stack Development");
    expect(programs).toContain("Diploma Program in Cloud Computing");
    expect(programs).toContain("Diploma Program in Software Testing");
    expect(programs).toContain("Diploma Program in Digital Marketing");
    expect(programs).toContain("Data Analyst");
  });

  it("contains all 13 Advanced IT Certification Courses from the PDF", () => {
    const certs = DIPLOMA_PROGRAMS_DATA.advancedItCertificationCourses;
    expect(certs).toHaveLength(13);
    expect(certs).toContain("Python");
    expect(certs).toContain("Machine Learning");
    expect(certs).toContain("Artificial Intelligence");
    expect(certs).toContain("SQL");
    expect(certs).toContain("Power BI");
    expect(certs).toContain("Tableau");
    expect(certs).toContain("Manual Testing");
    expect(certs).toContain("Automation Testing");
    expect(certs).toContain("Core Java and Java");
    expect(certs).toContain("Web Design and Web Development");
    expect(certs).toContain("Bootstrap, React JS, Django, MongoDB, and WordPress");
    expect(certs).toContain("CCNA, CEH v13, Penetration Testing (PT), Linux/RHCE, AWS, and Azure");
    expect(certs).toContain("Digital Marketing");
  });
});

describe("ChatbotWidget Component & Speed Dial Roll-up Flow", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const openSpeedDial = () => {
    const launcher = screen.getByRole("button", { name: /chatbot options/i });
    act(() => {
      fireEvent.click(launcher);
    });
  };

  const openChatPanel = () => {
    openSpeedDial();
    const chatBtn = screen.getByRole("button", { name: /chat with us/i });
    act(() => {
      fireEvent.click(chatBtn);
    });
  };

  it("renders closed circular floating button at bottom-right", () => {
    render(<ChatbotWidget />);
    const button = screen.getByRole("button", { name: /chatbot options/i });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rolls upward with 'Chat with us' and 'Call me back' options when clicked", () => {
    render(<ChatbotWidget />);
    openSpeedDial();

    // Verify both options roll upward with labels
    expect(screen.getByText("Chat with us")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /chat with us/i })).toBeInTheDocument();

    expect(screen.getByText("Call me back")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /call me back/i })).toBeInTheDocument();

    // Verify bottom toggle button with X
    const closeMenuBtn = screen.getByRole("button", { name: /close options/i });
    expect(closeMenuBtn).toBeInTheDocument();

    // Clicking X rolls back down
    act(() => {
      fireEvent.click(closeMenuBtn);
    });
    expect(screen.queryByText("Chat with us")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /chatbot options/i })).toBeInTheDocument();
  });

  it("opens panel and displays Message 1 immediately, followed by typing indicator, Message 2, and the 3 initial questions", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Header displays "We are online!" and AKSNOVA logo
    expect(screen.getByText("We are online!")).toBeInTheDocument();
    expect(screen.getByAltText(/AKSNOVA logo/i)).toBeInTheDocument();

    // Message 1 is displayed immediately
    expect(screen.getByText(/Hey! Welcome to AKSNOVA!/i)).toBeInTheDocument();
    expect(screen.getByText(/Ab Aage Ki Socho 🤔💭 and start exploring\./i)).toBeInTheDocument();

    // Typing indicator is active
    expect(screen.getByText(/AKSNOVA is typing\.\.\./i)).toBeInTheDocument();

    // Fast-forward 1.4s for Message 2
    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // Typing indicator should disappear
    expect(screen.queryByText(/AKSNOVA is typing\.\.\./i)).not.toBeInTheDocument();

    // Message 2 is now visible
    expect(screen.getByText(/We have a wide range of programs for you/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you ready to start upskilling\?/i)).toBeInTheDocument();

    // The 3 limited initial questions are displayed as suggested options
    expect(screen.getByText("I am looking for career growth/transition")).toBeInTheDocument();
    expect(screen.getByText("Learn about AKSNOVA programs")).toBeInTheDocument();
    expect(screen.getByText("I am just exploring")).toBeInTheDocument();
  });

  it("executes the full 'I am just exploring' -> 'Not sure of a specific program' -> AKSNOVA domains flow", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // Click "I am just exploring"
    const exploringOption = screen.getByText("I am just exploring");
    act(() => {
      fireEvent.click(exploringOption);
    });

    // Fast-forward bot typing response
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Bot asks follow-up question
    expect(
      screen.getByText(/Could you please elaborate what you are looking for\?/i),
    ).toBeInTheDocument();

    // Check the 3 follow-up replies options
    expect(screen.getByText("Not sure of a specific program")).toBeInTheDocument();
    expect(screen.getByText("I'm just looking around")).toBeInTheDocument();
    expect(screen.getByText("Wish to talk to counselor")).toBeInTheDocument();

    // Click "Not sure of a specific program"
    const notSureOption = screen.getByText("Not sure of a specific program");
    act(() => {
      fireEvent.click(notSureOption);
    });

    // Fast-forward bot typing response
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Bot asks cross question to choose domain
    expect(screen.getByText(/Please select domain of your interest!/i)).toBeInTheDocument();

    // Domains are replaced with the courses AKSNOVA provides in 2-column rounded rectangle format
    expect(screen.getByText("Data Science & Analytics")).toBeInTheDocument();
    expect(screen.getByText("ML & AI")).toBeInTheDocument();
    expect(screen.getByText("Software & Technology")).toBeInTheDocument();
    expect(screen.getByText("Cloud Computing & DevOps")).toBeInTheDocument();
    expect(screen.getByText("Cyber Security")).toBeInTheDocument();
    expect(screen.getByText("Software Testing")).toBeInTheDocument();
    expect(screen.getByText("Digital Marketing")).toBeInTheDocument();
    expect(screen.getByText("Accounting (Tally & GST)")).toBeInTheDocument();
    expect(screen.getByText("Graphic Design & UI/UX")).toBeInTheDocument();

    // Select a domain
    const dataScienceOption = screen.getByText("Data Science & Analytics");
    act(() => {
      fireEvent.click(dataScienceOption);
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(
      screen.getByText(
        /Our Data Science & Analytics track includes the Diploma in Data Science with AI/i,
      ),
    ).toBeInTheDocument();
  });

  it("is strictly predefined and structured with no text input area", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // Verify input area and send buttons are not in the DOM
    expect(
      screen.queryByPlaceholderText(/Ask us anything about our programs…/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send message/i })).not.toBeInTheDocument();

    // Verify structured guide footer is present
    expect(screen.getByText("Guided Career Assistant")).toBeInTheDocument();
    expect(screen.getByText("Select an option above")).toBeInTheDocument();
  });

  it("shows number input at bottom when 'Wish to talk to counselor' is selected and validates 10 digits without leading 0", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // 1. Click 'I am just exploring'
    const exploringBtn = screen.getByText("I am just exploring");
    act(() => {
      fireEvent.click(exploringBtn);
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // 2. Click 'Wish to talk to counselor'
    const counselorBtn = screen.getByText("Wish to talk to counselor");
    act(() => {
      fireEvent.click(counselorBtn);
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Bot asks for number
    expect(
      screen.getByText(
        /Please provide your 10-digit mobile number so our counselor will connect with you/i,
      ),
    ).toBeInTheDocument();

    // Bottom input area is now visible
    const chatInput = screen.getByPlaceholderText(
      "Enter 10-digit mobile number",
    ) as HTMLInputElement;
    const sendBtn = screen.getByRole("button", { name: /send number/i });
    expect(chatInput).toBeInTheDocument();
    expect(sendBtn).toBeDisabled();

    // Reject letters
    act(() => {
      fireEvent.change(chatInput, { target: { value: "abc98xyz" } });
    });
    expect(chatInput.value).toBe("98");
    expect(sendBtn).toBeDisabled();

    // Reject leading 0
    act(() => {
      fireEvent.change(chatInput, { target: { value: "0" } });
    });
    expect(chatInput.value).toBe("");
    expect(sendBtn).toBeDisabled();

    // Limit to 10 digits
    act(() => {
      fireEvent.change(chatInput, { target: { value: "9876543210999" } });
    });
    expect(chatInput.value).toBe("9876543210");
    expect(sendBtn).not.toBeDisabled();

    // Submit number
    act(() => {
      fireEvent.click(sendBtn);
    });

    // User message posted
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument();

    // Advance bot typing
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByText("Please share your highest qualification.")).toBeInTheDocument();
    expect(screen.getByText("Graduate or above")).toBeInTheDocument();
    expect(screen.getByText("Pursuing Graduation")).toBeInTheDocument();
    expect(screen.getByText("Class 12 or below")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Enter 10-digit mobile number")).not.toBeInTheDocument();

    // Select qualification option
    const qualOption = screen.getByText("Pursuing Graduation");
    act(() => {
      fireEvent.click(qualOption);
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(
      screen.getByText(
        /We have noted your qualification \(Pursuing Graduation\)\. Our senior career counselor will connect with you shortly between 9 AM to 9 PM/i,
      ),
    ).toBeInTheDocument();
  });

  it("minimizes and reopens without duplicating messages or repeating the welcome delay", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // Minimize via close button
    const closeBtn = screen.getByRole("button", { name: /close chat/i });
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Reopen via speed dial
    openChatPanel();

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Verify both messages are already present immediately, and no duplicate messages exist
    const msg1List = screen.getAllByText(/Hey! Welcome to AKSNOVA!/i);
    expect(msg1List).toHaveLength(1);

    const msg2List = screen.getAllByText(/We have a wide range of programs for you/i);
    expect(msg2List).toHaveLength(1);

    // No typing indicator on reopen
    expect(screen.queryByText(/AKSNOVA is typing\.\.\./i)).not.toBeInTheDocument();
  });

  it("supports AKSNOVA brand variant if specified", () => {
    render(<ChatbotWidget brandVariant="aksnova" instituteName="AKSNOVA" />);
    openChatPanel();

    expect(screen.getByText(/Hey! Welcome to AKSNOVA!/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(screen.getByText(/We have a wide range of programs for you/i)).toBeInTheDocument();
  });

  it("handles clicking 'Learn about AKSNOVA programs' option", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    const learnOption = screen.getByText("Learn about AKSNOVA programs");
    act(() => {
      fireEvent.click(learnOption);
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(
      screen.getByText(/We offer comprehensive, career-focused diploma programs/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Data Science & Analytics")).toBeInTheDocument();
  });

  it("handles 'I am looking for career growth/transition' flow with name input followed by validated 10-digit phone input", () => {
    render(<ChatbotWidget />);
    openChatPanel();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    // 1. Click "I am looking for career growth/transition"
    const careerGrowthBtn = screen.getByText("I am looking for career growth/transition");
    act(() => {
      fireEvent.click(careerGrowthBtn);
    });

    // Fast-forward bot response
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Bot asks cross question: "May I know your name please to begin with?"
    expect(screen.getByText("May I know your name please to begin with?")).toBeInTheDocument();

    // Name input area and send button are displayed
    const nameInput = screen.getByPlaceholderText("Enter your name...") as HTMLInputElement;
    const sendNameBtn = screen.getByRole("button", { name: /send name/i });
    expect(nameInput).toBeInTheDocument();

    // Send button disabled when empty or spaces only
    expect(sendNameBtn).toBeDisabled();
    act(() => {
      fireEvent.change(nameInput, { target: { value: "   " } });
    });
    expect(sendNameBtn).toBeDisabled();

    // Enter name
    act(() => {
      fireEvent.change(nameInput, { target: { value: "Rahul Sharma" } });
    });
    expect(sendNameBtn).not.toBeDisabled();

    // Send name
    act(() => {
      fireEvent.click(sendNameBtn);
    });

    // Name is shown in chat as user message
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();

    // Fast-forward bot typing response
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Bot asks for contact number: "Please provide your contact number."
    expect(screen.getByText("Please provide your contact number.")).toBeInTheDocument();

    // Contact number input area is displayed
    const phoneInput = screen.getByPlaceholderText(
      "Enter 10-digit mobile number",
    ) as HTMLInputElement;
    const sendPhoneBtn = screen.getByRole("button", { name: /send number/i });
    expect(phoneInput).toBeInTheDocument();
    expect(sendPhoneBtn).toBeDisabled();

    // Rules verification:
    // Non-digits are stripped
    act(() => {
      fireEvent.change(phoneInput, { target: { value: "hello98#@" } });
    });
    expect(phoneInput.value).toBe("98");
    expect(sendPhoneBtn).toBeDisabled();

    // Leading zero is not accepted
    act(() => {
      fireEvent.change(phoneInput, { target: { value: "0" } });
    });
    expect(phoneInput.value).toBe("");
    expect(sendPhoneBtn).toBeDisabled();

    // Incomplete number keeps button disabled
    act(() => {
      fireEvent.change(phoneInput, { target: { value: "987654321" } }); // 9 digits
    });
    expect(phoneInput.value).toBe("987654321");
    expect(sendPhoneBtn).toBeDisabled();

    // Complete 10-digit number enables button
    act(() => {
      fireEvent.change(phoneInput, { target: { value: "9876543210" } }); // 10 digits
    });
    expect(phoneInput.value).toBe("9876543210");
    expect(sendPhoneBtn).not.toBeDisabled();

    // Submit contact number
    act(() => {
      fireEvent.click(sendPhoneBtn);
    });

    // User message posted
    expect(screen.getByText("+91 9876543210")).toBeInTheDocument();

    // Bot asks for qualification
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByText("Please share your highest qualification.")).toBeInTheDocument();
    expect(screen.getByText("Graduate or above")).toBeInTheDocument();
    expect(screen.getByText("Pursuing Graduation")).toBeInTheDocument();
    expect(screen.getByText("Class 12 or below")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Enter 10-digit mobile number")).not.toBeInTheDocument();

    // User selects "Graduate or above"
    const gradOption = screen.getByText("Graduate or above");
    act(() => {
      fireEvent.click(gradOption);
    });

    // Bot asks for email ID: "Please provide your email id for the live chat agent to assist you further. ✍️"
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(
      screen.getByText(
        "Please provide your email id for the live chat agent to assist you further. ✍️",
      ),
    ).toBeInTheDocument();

    // Email input field and Send button appear
    const emailInput = screen.getByPlaceholderText("Enter your email ID...") as HTMLInputElement;
    const sendEmailBtn = screen.getByRole("button", { name: /send email/i });
    expect(emailInput).toBeInTheDocument();
    expect(sendEmailBtn).toBeDisabled();

    // Rule: empty or whitespace keeps send button disabled
    act(() => {
      fireEvent.change(emailInput, { target: { value: "   " } });
    });
    expect(sendEmailBtn).toBeDisabled();

    // Rule: invalid email format (missing @ or domain) keeps button disabled
    act(() => {
      fireEvent.change(emailInput, { target: { value: "rahul@" } });
    });
    expect(sendEmailBtn).toBeDisabled();

    act(() => {
      fireEvent.change(emailInput, { target: { value: "rahul@test" } });
    });
    expect(sendEmailBtn).toBeDisabled();

    // Rule: spaces are stripped automatically
    act(() => {
      fireEvent.change(emailInput, { target: { value: "rahul sharma@gmail.com" } });
    });
    expect(emailInput.value).toBe("rahulsharma@gmail.com");
    expect(sendEmailBtn).not.toBeDisabled();

    // Submit valid email
    act(() => {
      fireEvent.click(sendEmailBtn);
    });

    // Email message posted by user
    expect(screen.getByText("rahulsharma@gmail.com")).toBeInTheDocument();

    // Bot responds: "Please wait while I connect you with our Admission Counselor!"
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(
      screen.getByText("Please wait while I connect you with our Admission Counselor!"),
    ).toBeInTheDocument();

    // Input text box with send button is available for chatting with counselor
    const messageInput = screen.getByPlaceholderText(
      "Type your message here...",
    ) as HTMLInputElement;
    const sendMessageBtn = screen.getByRole("button", { name: /send message/i });
    expect(messageInput).toBeInTheDocument();
    expect(sendMessageBtn).toBeDisabled();

    // Type query
    act(() => {
      fireEvent.change(messageInput, {
        target: { value: "Can I know the fee structure for Data Science?" },
      });
    });
    expect(sendMessageBtn).not.toBeDisabled();

    // Send query
    act(() => {
      fireEvent.click(sendMessageBtn);
    });
    expect(screen.getByText("Can I know the fee structure for Data Science?")).toBeInTheDocument();

    // Counselor response received
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByText(/Our Admission Counselor has received your note/i)).toBeInTheDocument();
  });

  describe("Request a Call Back Modal & Phone Number Rules", () => {
    const openCallbackPopup = () => {
      openSpeedDial();
      const callBtn = screen.getByRole("button", { name: /call me back/i });
      act(() => {
        fireEvent.click(callBtn);
      });
    };

    it("opens the modal with dimmed background and close button when 'Call me back' is clicked", () => {
      render(<ChatbotWidget />);
      openCallbackPopup();

      expect(screen.getByRole("dialog", { name: /request a call back/i })).toBeInTheDocument();
      expect(
        screen.getByText("Let us help you guide towards your career path."),
      ).toBeInTheDocument();
      expect(screen.getByText("We will give you a call between 9 AM to 9 PM.")).toBeInTheDocument();
      expect(screen.getByText("Non-biased career guidance")).toBeInTheDocument();
      expect(
        screen.getByText("Counselling based on your skills and preference"),
      ).toBeInTheDocument();
      expect(screen.getByText("No repetitive calls, only as per convenience")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /close callback dialog/i })).toBeInTheDocument();
    });

    it("rejects non-digit characters (letters and special characters)", () => {
      render(<ChatbotWidget />);
      openCallbackPopup();

      const phoneInput = screen.getByPlaceholderText("Phone number") as HTMLInputElement;
      act(() => {
        fireEvent.change(phoneInput, { target: { value: "abc98xyz" } });
      });

      expect(phoneInput.value).toBe("98");
    });

    it("does not accept numbers starting with 0", () => {
      render(<ChatbotWidget />);
      openCallbackPopup();

      const phoneInput = screen.getByPlaceholderText("Phone number") as HTMLInputElement;
      act(() => {
        fireEvent.change(phoneInput, { target: { value: "0" } });
      });
      expect(phoneInput.value).toBe("");

      act(() => {
        fireEvent.change(phoneInput, { target: { value: "0987654321" } });
      });
      // Leading zero is rejected/stripped
      expect(phoneInput.value).toBe("987654321");
    });

    it("enforces maximum length limit of 10 digits", () => {
      render(<ChatbotWidget />);
      openCallbackPopup();

      const phoneInput = screen.getByPlaceholderText("Phone number") as HTMLInputElement;
      act(() => {
        fireEvent.change(phoneInput, { target: { value: "9876543210999" } });
      });

      expect(phoneInput.value).toBe("9876543210");
      expect(phoneInput.value.length).toBe(10);
    });

    it("keeps submit button disabled until all rules are satisfied, then enables it", () => {
      render(<ChatbotWidget />);
      openCallbackPopup();

      const submitBtn = screen.getByRole("button", { name: /request a call back/i });
      const phoneInput = screen.getByPlaceholderText("Phone number");

      // Initial state: disabled
      expect(submitBtn).toBeDisabled();

      // Incomplete (less than 10 digits)
      act(() => {
        fireEvent.change(phoneInput, { target: { value: "987654" } });
      });
      expect(submitBtn).toBeDisabled();

      // Exactly 10 valid digits starting with non-zero
      act(() => {
        fireEvent.change(phoneInput, { target: { value: "9876543210" } });
      });
      expect(submitBtn).not.toBeDisabled();

      // Submit and verify confirmation pop card
      act(() => {
        fireEvent.click(submitBtn);
      });
      expect(screen.getByText("Thanks for update")).toBeInTheDocument();
      expect(screen.getByText("Out team will reach out to you shortly")).toBeInTheDocument();
    });

    it("closes modal on Escape key press or close button", () => {
      render(<ChatbotWidget />);
      openCallbackPopup();

      expect(screen.getByRole("dialog", { name: /request a call back/i })).toBeInTheDocument();

      // Press Escape
      act(() => {
        fireEvent.keyDown(window, { key: "Escape" });
      });

      expect(
        screen.queryByRole("dialog", { name: /request a call back/i }),
      ).not.toBeInTheDocument();
    });
  });
});
