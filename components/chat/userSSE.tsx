"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { getThreadById, receiveIncomingMessage } from "@/app/actions/messageThreadAction";
import { toUIThread, useChat } from "@/hooks/sse";
import { UIThread } from "@/lib/interfaces";
import { Avatar, Box, Button, Card, Flex, ScrollArea, Separator, Text, TextField } from "@radix-ui/themes";
import { useState, useEffect, useRef, useTransition } from "react";
import { formatTime } from "@/lib/utils";


// ======================================================
// TYPES
// ======================================================

interface SSEMessage {
  id: string;
  content: string;
  direction: "incoming" | "outgoing";
  timestamp: Date | string;
}

// ======================================================
// LEXICAL CONFIG
// ======================================================

const theme = {
  paragraph: "mb-2 text-gray-900 dark:text-zinc-300",
};

function onError(error: Error) {
  console.error("Lexical Error:", error);
}

function FormLexicalEditor({
  onChange,
  placeholder = "Write a message...",
}: {
  onChange: (text: string) => void;
  placeholder?: string;
}) {
  const initialConfig = {
    namespace: crypto.randomUUID(),
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex min-h-28 w-full flex-col rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-indigo-500">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-full w-full flex-1 outline-none text-zinc-800 dark:text-zinc-300" />
          }
          placeholder={
            <div className="pointer-events-none absolute top-3 left-3 text-zinc-400">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const root = editorState._nodeMap.get("root");

              onChange(root ? root.getTextContent() : "");
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}

export default function UserChat({ userId, sender, email }: { userId: string; sender: string; email: string }) {
  const [thread, setThread] = useState<UIThread | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [replyText, setReplyText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to SSE for this thread
  const { sendMessage } = useChat(userId, "user");

  // Initial load
  useEffect(() => {
    async function init() {
      const res = await getThreadById(userId);
      if (res.success && res.thread) {
        setThread(toUIThread(res.thread));
      }
    }
    init();
  }, [userId]);

  // Auto scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thread?.messages.length]);

  // Start conversation
  async function handleInitialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorText("");

    if (!messageContent.trim()) {
      setErrorText("Please enter a message.");
      return;
    }

    startTransition(async () => {
      const res = await receiveIncomingMessage({ sender, email, content: messageContent });
      if (!res.success || !res.thread) {
        setErrorText("Failed to start conversation.");
        return;
      }
      setThread(toUIThread(res.thread));
      setMessageContent("");
    });
  }

  // Send reply
  async function handleChatReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!thread || !replyText.trim()) return;

    const outgoing = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: replyText,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setThread(prev => prev ? { ...prev, messages: [...prev.messages, outgoing] } : prev);
    setReplyText("");

    startTransition(async () => {
      await receiveIncomingMessage({ sender, email, content: outgoing.content });
    });
  }

  return (
    <div className="flex flex-col h-full">
    <Card size="4" className="bg-(--gray-a11)" variant="ghost">
      {errorText && (
        <Text color="ruby" size="2">
          {errorText}
        </Text>
      )}

      <form onSubmit={handleInitialSubmit}>
        </form>
      </Card>
      {!thread ? (
        <form onSubmit={handleInitialSubmit} className="p-4">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Full Name
                    </Text>

                    <TextField.Root
                      name="sender"
                      placeholder="Jane Doe"
                      size="3"
                      required
                      disabled={isPending}
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Email Address
                    </Text>

                    <TextField.Root
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      size="3"
                      required
                      disabled={isPending}
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Your Message
                    </Text>

                    <FormLexicalEditor
                      onChange={setMessageContent}
                      placeholder="How can we help you today?"
                    />
                  </Box>

                  <Button
                    type="submit"
                    size="3"
                    loading={isPending}
                  >
                    Start Conversation
                  </Button>
                </Flex>
          {errorText && <p className="text-red-500">{errorText}</p>}
        </form>
      ) : (
            <Card className="flex flex-col h-160 overflow-hidden" variant="ghost">
              {/* HEADER */}

              <Flex
                align="center"
                gap="3"
                className="p-4 border-b border-zinc-200 dark:border-zinc-800"
              >
                <Avatar
                  size="3"
                  fallback="K"
                  color="indigo"
                  radius="full"
                />

                <Box>
                  <Text as="div" weight="bold">
                    Kubuka Support
                  </Text>

                  <Text size="2" color="gray">
                    Connected
                  </Text>
                </Box>
              </Flex>

              {/* MESSAGES */}

              <Box className="flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                <ScrollArea
                  type="hover"
                  scrollbars="vertical"
                  style={{
                    height: 392,
                    padding: "16px",
                  }}
                  ref={scrollRef}
                >
                  <Flex direction="column" gap="3">
                    {thread.messages.map((msg) => {
                      const isUser =
                        msg.role === "user";

                      return (
                        <Flex
                          key={msg.id}
                          direction="column"
                          align={isUser ? "end" : "start"}
                        >
                          <Box
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              isUser
                                ? "bg-indigo-600 text-white rounded-br-sm"
                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-bl-sm text-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            <Text size="2">
                              {msg.content}
                            </Text>
                          </Box>

                          <Text
                            size="1"
                            color="gray"
                            mt="1"
                          >
                            {formatTime(
                              msg.timestamp ?? new Date()
                            )}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Flex>
                </ScrollArea>
              </Box>

              <Separator size="4" />

              {/* INPUT */}

              <Box className="p-3 bg-white dark:bg-zinc-950">
                <form onSubmit={handleChatReply}>
                <Flex gap="2" align="end">
                  <Box className="flex-1">
                    <FormLexicalEditor
                      onChange={setReplyText}
                      placeholder="Type your message..."
                    />
                  </Box>

                  <Button
                    size="3"
                    disabled={!replyText.trim() || isPending}
                    loading={isPending}
                  >
                    Send
                  </Button>
                </Flex>
                </form>
              </Box>
            </Card>
      )}
    </div>
  );
}
