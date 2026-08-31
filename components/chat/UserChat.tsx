"use client";

import {
  useState,
  useTransition,
} from "react";

import { Card, Text } from "@radix-ui/themes";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ConversationComposer from "./admin/ConversationComposer";
import StartConversationForm from "./StartConversation";

import { useChat } from "@/lib/chat/hooks/use_chat";
import { UserChatProps } from "@/lib/type_interface";
import { getUserSupportThreads } from "@/app/actions/messageThreadAction";
import { useEffect } from "react";

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
  const [loadingHistory, setLoadingHistory] = useState(Boolean(user));

  //--------------------------------------------------
  // Chat
  //--------------------------------------------------
  const {
    thread,
    connected,
    startConversation,
    sendMessage,
    setExistingThread,
    startTyping,
    stopTyping,
    isTyping,
    getParticipantByRole,
  } = useChat();

  useEffect(() => {
    let active = true;
    if (!user?.email) {
      return () => { active = false; };
    }

    void getUserSupportThreads().then((result) => {
      if (!active) return;
      const existing = result.threads[0];
      if (existing) setExistingThread(existing);
      setLoadingHistory(false);
    }).catch(() => {
      if (active) setLoadingHistory(false);
    });

    return () => { active = false; };
  }, [user?.email, setExistingThread]);

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
  if (loadingHistory) {
    return (
      <Card
        variant="ghost"
        className="contact-chat-surface flex h-160 items-center justify-center border border-zinc-200 shadow-sm dark:border-zinc-800"
      >
        <Text className="text-zinc-600 dark:text-zinc-400">
          Loading your conversation…
        </Text>
      </Card>
    );
  }

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
      className="contact-chat-surface flex h-160 flex-col overflow-hidden border border-zinc-200 shadow-sm dark:border-zinc-800"
    >
      <ChatHeader
        thread={thread}
        connected={connected}
        online={connected}
        typing={isTyping("admin")}
        lastSeen={getParticipantByRole("admin")?.lastSeen}
      />

      <ChatMessages
        thread={thread}
        selfRole="user"
      />

      <ConversationComposer
        placeholder={`Reply as ${thread.sender}...`}
        disabled={isPending}
        onSend={handleSend}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
      />
    </Card>
  );
} 
