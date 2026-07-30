"use client";

import {
  useState,
  useTransition,
} from "react";

import { Card } from "@radix-ui/themes";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ConversationComposer from "./admin/ConversationComposer";
import StartConversationForm from "./StartConversation";

import { useChat } from "@/lib/chat/hooks/use_chat";
import { UserChatProps } from "@/lib/type_interface";

export default function UserChat({
  user,
}: UserChatProps) {
  //--------------------------------------------------
  // UI
  //--------------------------------------------------
  const [isPending, startTransition] = useTransition();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  //--------------------------------------------------
  // Chat
  //--------------------------------------------------
  const {
    thread,
    connected,
    startConversation,
    sendMessage,
    startTyping,
    stopTyping,
    isTyping,
  } = useChat();

  //--------------------------------------------------
  // Start Conversation
  //--------------------------------------------------
  async function createConversation(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const sender =
      user?.name ??
      guestName.trim();

    const email =
      user?.email ??
      guestEmail.trim();

    if (!sender) {
      setError(
        "Please enter your name.",
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter your email.",
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "Please enter a message.",
      );
      return;
    }

    startTransition(async () => {
      try {
        setError("");

        await startConversation({
          sender,
          email,
          content: message.trim(),
        });

        setMessage("");
      } catch {
        setError(
          "Unable to start conversation.",
        );
      }
    });
  }

  //--------------------------------------------------
  // Send Message
  //--------------------------------------------------
  function handleSend(
    content: string,
  ) {
    startTransition(async () => {
      await sendMessage(content);
    });
  }

  //--------------------------------------------------
  // No Conversation
  //--------------------------------------------------
  if (!thread) {
    return (
      <StartConversationForm
        user={user}
        guestName={guestName}
        guestEmail={guestEmail}
        message={message}
        error={error}
        loading={isPending}
        onGuestNameChange={
          setGuestName
        }
        onGuestEmailChange={
          setGuestEmail
        }
        onMessageChange={
          setMessage
        }
        onSubmit={
          createConversation
        }
      />
    );
  }

  //--------------------------------------------------
  // Conversation
  //--------------------------------------------------
  return (
    <Card
      variant="ghost"
      className="flex h-160 flex-col"
    >
      <ChatHeader
        thread={thread}
        connected={connected}
        online={connected}
        typing={isTyping("admin")}
      />

      <ChatMessages
        thread={thread}
        selfRole="user"
      />

      <ConversationComposer
        placeholder={`Reply to ${thread.sender}...`}
        disabled={isPending}
        onSend={handleSend}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
      />
    </Card>
  );
} 