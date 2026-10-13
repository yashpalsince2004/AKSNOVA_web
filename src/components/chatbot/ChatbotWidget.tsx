import React from "react";
import type { ChatMessage, ChatbotWidgetProps } from "./chatbot-types";
import { useChatbot } from "./hooks/useChatbot";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ChatLauncher } from "./components/ChatLauncher";
import { CallbackModal } from "./components/CallbackModal";

export type { ChatMessage, ChatbotWidgetProps };

export default function ChatbotWidget({
  brandVariant = "aksnova",
  welcomeMessage,
  programsIntroMessage,
  instituteName = "AKSNOVA",
  initialQuestions,
}: ChatbotWidgetProps) {
  const {
    isOpen,
    isSpeedDialOpen,
    isCallbackModalOpen,
    phoneNumber,
    phoneTouched,
    callbackSubmitted,
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
    setIsSpeedDialOpen,
    setIsCallbackModalOpen,
    setCallbackSubmitted,
    setChatNameInput,
    setChatTextInput,
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
    handleChatEmailSkip,
    handleChatTextSubmit,
    handleSelectOption,
  } = useChatbot({
    brandVariant,
    welcomeMessage,
    programsIntroMessage,
    instituteName,
    initialQuestions,
  });

  return (
    <aside aria-label="Website Chatbot Assistant" className="relative">
      {/* Floating Speed Dial & Chat Launcher (Bottom-Right Corner) */}
      <ChatLauncher
        isOpen={isOpen}
        isSpeedDialOpen={isSpeedDialOpen}
        hasUnread={hasUnread}
        onOpenChat={handleOpenChat}
        onOpenSpeedDial={() => setIsSpeedDialOpen(true)}
        onCloseSpeedDial={() => setIsSpeedDialOpen(false)}
        onOpenCallbackModal={() => {
          setIsSpeedDialOpen(false);
          setIsCallbackModalOpen(true);
          setCallbackSubmitted(false);
        }}
      />

      {/* Floating Chatbot Panel (Bottom-Right Corner) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
          className="fixed bottom-20 right-4 z-50 flex h-[550px] max-h-[calc(100vh-5rem)] w-[calc(100vw-2rem)] sm:w-[410px] max-w-[440px] flex-col rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-300 md:bottom-6 md:right-6 animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <ChatHeader
            instituteName={instituteName}
            onClose={handleClose}
            onMinimize={handleClose}
          />

          {/* Conversation Area */}
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            instituteName={instituteName}
            quickOptions={quickOptions}
            onSelectOption={handleSelectOption}
            messagesEndRef={messagesEndRef}
          />

          {/* Interactive Chat Input Bar or Default Guidance Footer */}
          <ChatInput
            mode={chatInputMode}
            nameInput={chatNameInput}
            onNameChange={setChatNameInput}
            onNameSubmit={handleChatNameSubmit}
            isNameValid={isChatNameValid}
            phoneNumber={chatPhoneNumber}
            onPhoneChange={handleChatPhoneChange}
            onPhoneSubmit={handleChatPhoneSubmit}
            isPhoneValid={isCurrentChatPhoneValid}
            emailInput={chatEmailInput}
            onEmailChange={handleChatEmailChange}
            onEmailSubmit={handleChatEmailSubmit}
            onEmailSkip={handleChatEmailSkip}
            isEmailValid={isCurrentChatEmailValid}
            textInput={chatTextInput}
            onTextChange={setChatTextInput}
            onTextSubmit={handleChatTextSubmit}
            isTextValid={isChatTextValid}
          />
        </div>
      )}

      {/* Request a Call Back Modal Popup (Centered with Dull / Dimmed Background) */}
      <CallbackModal
        isOpen={isCallbackModalOpen}
        phoneNumber={phoneNumber}
        phoneTouched={phoneTouched}
        callbackSubmitted={callbackSubmitted}
        onPhoneChange={handlePhoneChange}
        onSubmit={handleCallbackSubmit}
        onClose={handleCloseCallbackModal}
      />
    </aside>
  );
}
