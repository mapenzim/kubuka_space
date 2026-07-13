"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Separator,
  Text,
  TextArea,
} from "@radix-ui/themes";

import {
  getThread,
  sendAdminReply,
} from "@/app/actions/messageThreadAction";

import { useInbox } from "@/hooks/useInbox";
import { useThread } from "@/hooks/useThread";

import { UIThread } from "@/lib/interfaces";

import {
  toUIThread,
} from "@/lib/mappers";

import {
  formatTime,
} from "@/lib/utils";

const formatDate = (
  date: Date | string
) =>
  new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  ).format(
    new Date(date)
  );

export default function AdminInbox() {

  //--------------------------------------------------
  // Inbox
  //--------------------------------------------------

  const {
    connected: inboxConnected,

    threads,

    unreadCount,

    selected,

    selectedThreadId,

    setSelectedThreadId,
  } = useInbox();

  //--------------------------------------------------
  // Thread
  //--------------------------------------------------

  const [
    initialThread,
    setInitialThread,
  ] = useState<UIThread | null>(null);

  const {
    thread,

    setThread,

    connected,

    online,

    typing,

    sendMessage,

    startTyping,

    stopTyping,
  } = useThread({
    thread: initialThread,

    role: "admin",
  });

  //--------------------------------------------------
  // UI State
  //--------------------------------------------------

  const [
    replyText,
    setReplyText,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const typingClientId =
    useRef(crypto.randomUUID());

    //--------------------------------------------------
  // Load Selected Thread
  //--------------------------------------------------

  useEffect(() => {
    if (!selectedThreadId) {
      setInitialThread(null);
      setThread(null);
      return;
    }

    async function loadThread() {
      const result =
        await getThread(
          selectedThreadId as string
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
    }

    loadThread();
  }, [
    selectedThreadId,
    setThread,
  ]);

  //--------------------------------------------------
  // Auto Scroll
  //--------------------------------------------------

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      top:
        scrollRef.current
          .scrollHeight,
      behavior: "smooth",
    });
  }, [thread?.messages]);

  //--------------------------------------------------
  // Reply
  //--------------------------------------------------

  async function handleReplySubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!thread) {
      return;
    }

    const content =
      replyText.trim();

    if (!content) {
      return;
    }

    startTransition(async () => {
      const result =
        await sendAdminReply(
          thread.id,
          content
        );

      if (!result.success) {
        return;
      }

      setReplyText("");
    });
  }

  //--------------------------------------------------
  // Typing
  //--------------------------------------------------

  function handleTyping(
    value: string
  ) {
    setReplyText(
      value
    );

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

  //--------------------------------------------------
  // Send (Realtime)
  //--------------------------------------------------

  async function handleSendRealtime() {
    if (!thread) {
      return;
    }

    const content =
      replyText.trim();

    if (!content) {
      return;
    }

    const ok =
      await sendMessage({
        threadId: thread.id,

        role: "admin",

        text: content,
      });

    if (ok) {
      setReplyText("");
    }
  }

    return (
    <Flex
      direction="column"
      className="h-full overflow-hidden"
      gap="2"
    >
      {/* ===================================================== */}
      {/* Header */}
      {/* ===================================================== */}

      <Box>
        <Heading
          as="h1"
          size="6"
          mb="1"
        >
          Messages
        </Heading>

        <Flex
          justify="between"
          align="center"
        >
          <Text
            color="gray"
            size="2"
          >
            Respond to user inquiries and
            manage support threads.
          </Text>

          <Flex
            align="center"
            gap="3"
          >
            <Text
              size="2"
              color={
                inboxConnected
                  ? "green"
                  : "orange"
              }
            >
              {inboxConnected
                ? "Inbox Connected"
                : "Inbox Offline"}
            </Text>

            <Text size="2">
              {unreadCount} unread
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* ===================================================== */}
      {/* Layout */}
      {/* ===================================================== */}

      <Flex
        gap="4"
        className="flex-1 overflow-hidden min-h-0"
      >
        {/* ===================================================== */}
        {/* Sidebar */}
        {/* ===================================================== */}

        <Card className="w-full md:w-80 flex flex-col overflow-hidden">
          <Box className="border-b p-3">
            <Text weight="bold">
              Conversations
            </Text>
          </Box>

          <ScrollArea className="flex-1">
            {threads.map(
              (item) => (
                <Box
                  key={item.id}
                  onClick={() =>
                    setSelectedThreadId(
                      item.id
                    )
                  }
                  className={`cursor-pointer border-b p-4 transition-colors hover:bg-(--gray-a3) ${
                    selectedThreadId ===
                    item.id
                      ? "bg-(--gray-a3)"
                      : ""
                  }`}
                >
                  <Flex
                    justify="between"
                    align="start"
                    mb="1"
                  >
                    <Box>
                      <Text
                        weight={
                          item.unread
                            ? "bold"
                            : "medium"
                        }
                      >
                        {item.sender}
                      </Text>

                      <Text
                        size="1"
                        color="gray"
                      >
                        {item.email}
                      </Text>
                    </Box>

                    {item.lastMessageAt && (
                      <Text
                        size="1"
                        color="gray"
                      >
                        {formatDate(
                          item.lastMessageAt
                        )}
                      </Text>
                    )}
                  </Flex>

                  <Text
                    size="2"
                    color="gray"
                    className="line-clamp-2"
                  >
                    {item.lastMessage ??
                      "No messages"}
                  </Text>
                </Box>
              )
            )}

            {!threads.length && (
              <Flex
                align="center"
                justify="center"
                className="h-full p-8"
              >
                <Text color="gray">
                  No conversations
                </Text>
              </Flex>
            )}
          </ScrollArea>
        </Card>

        {/* ===================================================== */}
        {/* Conversation */}
        {/* ===================================================== */}

        <Card className="flex-1 flex flex-col overflow-hidden">
          {thread ? (
            <>
              {/* Header */}

              <Flex
                justify="between"
                align="center"
                className="border-b p-4"
              >
                <Flex
                  gap="3"
                  align="center"
                >
                  <Avatar
                    radius="full"
                    fallback={thread.sender.charAt(
                      0
                    )}
                  />

                  <Box>
                    <Text weight="bold">
                      {thread.sender}
                    </Text>

                    <Text
                      size="1"
                      color="gray"
                    >
                      {thread.email}
                    </Text>

                    <Flex
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
                          : "Disconnected"}
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
                  </Box>
                </Flex>

                <IconButton variant="ghost">
                  ⋮
                </IconButton>
              </Flex>

              {/* Messages */}

              <Box className="flex-1 overflow-hidden">
                <ScrollArea
                  ref={scrollRef}
                  style={{
                    height: 420,
                    padding: 16,
                  }}
                >
                  <Flex
                    direction="column"
                    gap="3"
                  >
                    {thread.messages.map(
                      (
                        message
                      ) => {
                        const admin =
                          message.role ===
                          "admin";

                        return (
                          <Flex
                            key={
                              message.id
                            }
                            direction="column"
                            align={
                              admin
                                ? "end"
                                : "start"
                            }
                          >
                            <Box
                              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                admin
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

              <Box className="p-4">
                <form
                  onSubmit={(
                    e
                  ) => {
                    e.preventDefault();
                    handleSendRealtime();
                  }}
                >
                  <Flex
                    gap="3"
                    align="end"
                  >
                    <Box className="flex-1">
                      <TextArea
                        value={
                          replyText
                        }
                        onChange={(
                          e
                        ) =>
                          handleTyping(
                            e.target
                              .value
                          )
                        }
                        placeholder={`Reply to ${thread.sender}...`}
                        disabled={
                          isPending
                        }
                      />
                    </Box>

                    <Button
                      type="submit"
                      loading={
                        isPending
                      }
                      disabled={
                        !replyText.trim()
                      }
                    >
                      Send
                    </Button>
                  </Flex>
                </form>
              </Box>
            </>
          ) : (
            <Flex
              align="center"
              justify="center"
              className="h-full"
            >
              <Text color="gray">
                Select a conversation
              </Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </Flex>
  );
}
