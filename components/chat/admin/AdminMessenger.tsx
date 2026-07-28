"use client";

import {
  useEffect,
  useTransition,
} from "react";

import {
  Box,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
} from "@radix-ui/themes";

import { useInbox } from "@/hooks/use_inbox";

import { useChat } from "@/lib/chat/hooks/use_chat";
import { useChatSession } from "@/lib/chat/session/use_chat_session";

import ConversationComposer from "./ConversationComposer";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import InboxSidebar from "./InboxSidebar";

export default function AdminMessenger() {
  //--------------------------------------------------
  // Inbox
  //--------------------------------------------------

  const {
    connected: inboxConnected,
    threads,
    unreadCount,
    selectedThreadId,
    setSelectedThreadId,
  } = useInbox();

  //--------------------------------------------------
  // Chat Session
  //--------------------------------------------------

  const session =
    useChatSession();

  //--------------------------------------------------
  // Chat
  //--------------------------------------------------

  const {
    thread,
    loadThread,

    connected,
    isTyping,
    isOnline,

    sendMessage,

    startTyping,
    stopTyping,
  } = useChat();

  //--------------------------------------------------
  // Pending
  //--------------------------------------------------

  const [isPending, startTransition] =
    useTransition();

  //--------------------------------------------------
  // Selected Thread
  //--------------------------------------------------

  useEffect(() => {
    session.setThreadId(
      selectedThreadId as string ?? '',
    );
  }, [
    selectedThreadId,
    session,
  ]);

  //--------------------------------------------------
  // Load Conversation
  //--------------------------------------------------
  useEffect(() => {
    void loadThread(
      selectedThreadId ?? "",
    );
  }, [
    selectedThreadId,
    loadThread,
  ]);

  //--------------------------------------------------
  // Send
  //--------------------------------------------------

  function sendReply(
    content: string,
  ) {
    startTransition(async () => {
      await sendMessage(content);
    });
  }

  //--------------------------------------------------
  // Render
  //--------------------------------------------------

  return (
    <Flex
      direction="column"
      gap="2"
      className="h-full overflow-hidden"
    >
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
            size="2"
            color="gray"
          >
            Respond to user inquiries and
            manage support threads.
          </Text>

          <Flex
            gap="3"
            align="center"
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

            <Separator orientation="vertical" />

            <Text size="2">
              {unreadCount} unread
            </Text>
          </Flex>
        </Flex>
      </Box>

      <Flex
        gap="4"
        className="flex-1 min-h-0 overflow-hidden"
      >
        <InboxSidebar
          threads={threads}
          selectedThreadId={
            selectedThreadId
          }
          onSelect={
            setSelectedThreadId
          }
        />

        <Card className="flex flex-1 flex-col overflow-hidden">
          {!thread ? (
            <Flex
              align="center"
              justify="center"
              className="h-full"
            >
              <Text color="gray">
                Select a conversation
              </Text>
            </Flex>
          ) : (
            <>
              <ConversationHeader
                thread={thread}
                connected={connected}
                online={isOnline('')}
                typing={isTyping(
                  "user",
                )}
              />

              <ConversationMessages
                messages={
                  thread.messages
                }
                selfRole="admin"
              />

              <Separator />

              <ConversationComposer
                placeholder={`Reply to ${thread.sender}...`}
                disabled={isPending}
                onSend={sendReply}
                onTypingStart={
                  startTyping
                }
                onTypingStop={
                  stopTyping
                }
              />
            </>
          )}
        </Card>
      </Flex>
    </Flex>
  );
}