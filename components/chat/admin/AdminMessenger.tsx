"use client";

import {
  useEffect,
  useCallback,
  useState,
  useTransition,
} from "react";

import {
  Button,
  Box,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
} from "@radix-ui/themes";
import { Inbox } from "lucide-react";

import { useChat } from "@/lib/chat/hooks/use_chat";
import { useChatSession } from "@/lib/chat/session/use_chat_session";

import ConversationComposer from "./ConversationComposer";
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import InboxSidebar from "./InboxSidebar";
import { useInbox } from "@/lib/chat/hooks/use_inbox";

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
    removeThread,
  } = useInbox();

  //--------------------------------------------------
  // Chat Session
  //--------------------------------------------------
  const { setThreadId } = useChatSession();

  //--------------------------------------------------
  // Chat
  //--------------------------------------------------
  const {
    thread,
    loadThread,
    connected,
    isTyping,
    getParticipantByRole,
    sendMessage,
    startTyping,
    stopTyping,
    archiveConversation,
    deleteConversation,
  } = useChat();

  //--------------------------------------------------
  // Pending
  //--------------------------------------------------
  const [isPending, startTransition] = useTransition();
  const [mobileInboxOpen, setMobileInboxOpen] = useState(false);

  //--------------------------------------------------
  // Selected Thread
  //--------------------------------------------------
  useEffect(() => {
    setThreadId(
      selectedThreadId as string ?? '',
    );
  }, [
    selectedThreadId,
    setThreadId,
  ]);

  const selectThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId);
    setMobileInboxOpen(false);
  }, [setSelectedThreadId]);

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

  async function deleteCurrentConversation() {
    if (!selectedThreadId) {
      return;
    }

    await deleteConversation();
    removeThread(selectedThreadId);
  }

  async function archiveCurrentConversation() {
    if (!selectedThreadId) {
      return;
    }

    await archiveConversation();
    removeThread(selectedThreadId);
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
      <Box className="shrink-0">
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
            wrap="wrap"
            gap="3"
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
            wrap="wrap"
          >
            <Button
              type="button"
              variant="soft"
              color="gray"
              className="md:hidden"
              onClick={() => setMobileInboxOpen(true)}
            >
              <Inbox size={16} />
              Conversations
            </Button>

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
        className="min-h-0 flex-1 flex-col overflow-hidden md:flex-row"
      >
        <Box
          className={`min-h-0 w-full shrink-0 md:flex md:w-80 ${
            selectedThreadId && !mobileInboxOpen
              ? "hidden"
              : "flex"
          }`}
        >
          <InboxSidebar
            threads={threads}
            selectedThreadId={
              selectedThreadId
            }
            onSelect={
              selectThread
            }
          />
        </Box>

        <Card
          className={`min-h-0 min-w-0 flex-1 overflow-hidden ${
            selectedThreadId && !mobileInboxOpen
              ? "block"
              : "hidden md:block"
          }`}
        >
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
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
                  online={getParticipantByRole("user")?.online ?? false}
                  typing={isTyping("user")}
                  lastSeen={getParticipantByRole("user")?.lastSeen}
                  onArchive={archiveCurrentConversation}
                  onDelete={deleteCurrentConversation}
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
          </div>
        </Card>
      </Flex>
    </Flex>
  );
}
