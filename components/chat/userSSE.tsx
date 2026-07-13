"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  ScrollArea,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";

import {
  receiveIncomingMessage,
  findThread,
} from "@/app/actions/messageThreadAction";

import { useThread } from "@/hooks/useThread";

import { formatTime } from "@/lib/utils";

import FormLexicalEditor from "./FormLexicalEditor";
import { toUIThread } from "@/lib/mappers";

type AuthUser = {
  id: string;
  name: string | null;
  email: string | null;
};

type Props = {
  user: AuthUser | null;
};

export default function UserChat({
  user,
}: Props) {

  //---------------------------------------------------------
  // State
  //---------------------------------------------------------

  const [initialThread, setInitialThread] =
    useState<typeof undefined | any>(null);

  const [guestName, setGuestName] =
    useState("");

  const [guestEmail, setGuestEmail] =
    useState("");

  const [messageContent, setMessageContent] =
    useState("");

  const [replyText, setReplyText] =
    useState("");

  const [errorText, setErrorText] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const typingClientId =
    useRef(crypto.randomUUID());

  //---------------------------------------------------------
  // User
  //---------------------------------------------------------

  const sender =
    user?.name ??
    guestName;

  const email =
    user?.email ??
    guestEmail;

  //---------------------------------------------------------
  // Chat
  //---------------------------------------------------------

  const {
    thread,
    setThread,
    connected,
    typing,
    online,
    sendMessage,
    startTyping,
    stopTyping,
  } = useThread({
    thread: initialThread,
    role: "user",
  });

  //---------------------------------------------------------
  // Load Existing Thread
  //---------------------------------------------------------

  useEffect(() => {
    if (!email) {
      return;
    }

    async function load() {
      const result =
        await findThread(
          email
        );

      if (
        !result.success ||
        !result.thread
      ) {
        return;
      }

      const uiThread =
        toUIThread(
          result.thread
        );

      setInitialThread(
        uiThread
      );

      setThread(
        uiThread
      );

      if (!user) {
        setGuestName(
          uiThread.sender
        );

        setGuestEmail(
          uiThread.email
        );
      }
    }

    load();
  }, [
    email,
    user,
    setThread,
  ]);

    //---------------------------------------------------------
  // Auto Scroll
  //---------------------------------------------------------

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thread?.messages]);

  //---------------------------------------------------------
  // Start Conversation
  //---------------------------------------------------------

  async function handleInitialSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!messageContent.trim()) {
      setErrorText(
        "Please enter a message."
      );

      return;
    }

    startTransition(async () => {
      const result =
        await receiveIncomingMessage(
          sender,
          email,
          messageContent
        );

      if (
        !result.success ||
        !result.thread
      ) {
        setErrorText(
          "Unable to start conversation."
        );

        return;
      }

      const uiThread =
        toUIThread(
          result.thread
        );

      setThread(
        uiThread
      );

      setMessageContent("");

      setErrorText("");
    });
  }

  //---------------------------------------------------------
  // Send Reply
  //---------------------------------------------------------

  async function handleReplySubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!thread) {
      return;
    }

    if (!replyText.trim()) {
      return;
    }

    const text =
      replyText.trim();

    setReplyText("");

    await sendMessage({
      sender,

      email,

      role: "user",

      text,
    });
  }

  //---------------------------------------------------------
  // Typing
  //---------------------------------------------------------

  function handleTyping(
    value: string
  ) {
    setReplyText(value);

    if (!thread) {
      return;
    }

    if (value.trim()) {
      startTyping(
        typingClientId.current
      );
    } else {
      stopTyping(
        typingClientId.current
      );
    }
  }

    //---------------------------------------------------------
  // UI
  //---------------------------------------------------------

  if (!thread) {
    return (
      <Card>
        <Heading mb="4">
          Start Conversation
        </Heading>

        <form onSubmit={handleInitialSubmit}>
          <Flex direction="column" gap="4">

            {!user && (
              <>
                <Box>
                  <Text>Full Name</Text>

                  <TextField.Root
                    value={guestName}
                    onChange={(e) =>
                      setGuestName(
                        e.target.value
                      )
                    }
                    required
                  />
                </Box>

                <Box>
                  <Text>Email</Text>

                  <TextField.Root
                    type="email"
                    value={guestEmail}
                    onChange={(e) =>
                      setGuestEmail(
                        e.target.value
                      )
                    }
                    required
                  />
                </Box>
              </>
            )}

            {user && (
              <Box>
                <Text size="2">
                  Signed in as
                </Text>

                <Text weight="bold">
                  {user.name}
                </Text>

                <Text color="gray">
                  {user.email}
                </Text>
              </Box>
            )}

            <FormLexicalEditor
              placeholder="How can we help?"
              onChange={setMessageContent}
            />

            <Button
              type="submit"
              loading={isPending}
            >
              Start Conversation
            </Button>

            {errorText && (
              <Text color="red">
                {errorText}
              </Text>
            )}
          </Flex>
        </form>
      </Card>
    );
  }

  return (
    <Card
      variant="ghost"
      className="flex flex-col h-160"
    >
      {/* Header */}

      <Flex
        align="center"
        gap="3"
        className="p-4 border-b"
      >
        <Avatar
          radius="full"
          fallback="K"
        />

        <Box>
          <Text weight="bold">
            Kubuka Support
          </Text>

          <Flex
            align="center"
            gap="2"
          >
            <Text
              size="1"
              color={
                connected
                  ? "green"
                  : "orange"
              }
            >
              {connected
                ? "Connected"
                : "Connecting..."}
            </Text>

            {online && (
              <Text
                size="1"
                color="green"
              >
                • Online
              </Text>
            )}

            {typing && (
              <Text
                size="1"
                color="gray"
              >
                • Typing...
              </Text>
            )}
          </Flex>

          <Text
            size="1"
            color="gray"
          >
            {thread.email}
          </Text>
        </Box>
      </Flex>

      {/* Messages */}

      <Box className="flex-1 overflow-hidden">
        <ScrollArea
          ref={scrollRef}
          style={{
            height: 390,
            padding: 16,
          }}
        >
          <Flex
            direction="column"
            gap="3"
          >
            {thread.messages.map(
              (message) => {
                const isUser =
                  message.role ===
                  "user";

                return (
                  <Flex
                    key={
                      message.id
                    }
                    direction="column"
                    align={
                      isUser
                        ? "end"
                        : "start"
                    }
                  >
                    <Box
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isUser
                          ? "bg-indigo-600 text-white"
                          : "border"
                      }`}
                    >
                      <Text size="2">
                        {
                          message.content
                        }
                      </Text>
                    </Box>

                    <Text
                      size="1"
                      color="gray"
                    >
                      {formatTime(
                        message.timestamp
                      )}
                    </Text>
                  </Flex>
                );
              }
            )}
          </Flex>
        </ScrollArea>
      </Box>

      <Separator />

      {/* Composer */}

      <Box className="p-3">
        <form
          onSubmit={
            handleReplySubmit
          }
        >
          <Flex gap="2">
            <Box className="flex-1">
              <FormLexicalEditor
                value={replyText}
                onChange={
                  handleTyping
                }
                placeholder="Type your message..."
              />
            </Box>

            <Button
              type="submit"
              loading={isPending}
              disabled={
                !replyText.trim()
              }
            >
              Send
            </Button>
          </Flex>
        </form>
      </Box>
    </Card>
  );
}
