"use client";

import { SubmitEvent, useEffect, useRef, useState, useTransition } from "react";
import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Box, 
  Card,
  Avatar,
  Badge,
  TextArea,
  IconButton,
  Separator,
  ScrollArea
} from "@radix-ui/themes";
import { getActiveThreads, getThreadById, sendAdminReply } from "@/app/actions/messageThreadAction";
import { Thread } from "@/lib/interfaces";

// Formatter for message timestamps 
const formatTime = (dateString: Date | string) => {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(dateString));
};

const formatDate = (dateString: Date | string) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateString));
};

export default function AdminMessagesPage() {
  // State to track which conversation is currently active
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isPending, startTransition] = useTransition();
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  // States for the Form
  const [messageContent, setMessageContent] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // ----------------------------------------------------
  // SSE CONNECTION (REAL TIME)
  // ----------------------------------------------------
  useEffect(() => {
    if (!activeThread?.id) return;

    const eventSource = new EventSource(
      `/api/sse?threadId=${activeThread.id}`
    );

    eventSource.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      setActiveThread((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          messages: [...prev.messages, msg],
        };
      });
    };

    return () => eventSource.close();
  }, [activeThread?.id]);

  // In a real implementation, this would fetch from the backend
  const fetchThreads = async () => {
    const response = await getActiveThreads();
    setThreads(response.data || []);
      
    // Automatically select the first thread if none is selected
    if (response.data && response.data.length > 0 && !selectedThreadId) {
      setSelectedThreadId(response.data[0].id);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // ----------------------------------------------------
  // Auto scroll
  // ----------------------------------------------------
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeThread?.messages?.length]);

  // Add the form submission handler
  async function handleReplySubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!activeThread || !replyText.trim()) return;

    startTransition(async () => {
      const result = await sendAdminReply({
        threadId: activeThread.id,
        content: replyText
      });

      if (result.success) {
        setReplyText("");
        await fetchThreads(); 
      } else {
        console.error("Failed to send reply");
      }
    });
  }

  // Poll for updates and sync the threads array
  useEffect(() => {
    if (!selectedThreadId) return;

    const pollInterval = setInterval(async () => {
      const result = await getThreadById(selectedThreadId);
      
      if (result.success && result.thread) {
        const updatedThread = result.thread;
        setThreads(prevThreads => {
          const currentThread = prevThreads.find(t => t.id === selectedThreadId);
          
          // Only update if the message count has changed to prevent UI flicker
          if (currentThread && currentThread.messages.length !== updatedThread.messages.length) {
            return prevThreads.map(t => t.id === selectedThreadId ? updatedThread : t);
          }
          return prevThreads;
        });
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [selectedThreadId]);

  const isChatMode = !!activeThread;

  return (
    <Flex direction="column" className="h-full overflow-hidden" gap="2">
      
      {/* Header */}
      <Box className="shrink-0">
        <Heading as="h1" size="6" mb="1">Messages</Heading>
        <Text color="gray" size="2">Respond to user inquiries and manage support threads.</Text>
      </Box>

      {/* Split Pane Container */}
      <Flex gap="4" className="flex-1 overflow-hidden min-h-0">
        
        {/* LEFT PANE: Thread List */}
        <Card size="1" variant="surface" className="w-full md:w-1/3 flex flex-col h-full overflow-hidden bg-sky-900">
          <Box className="p-3 border-b border-(--gray-a6) bg-(--color-panel) shrink-0">
            <Text weight="bold" size="3">Conversations</Text>
          </Box>
          <Box className="flex-1 overflow-y-auto min-h-0">
            <ScrollArea type="scroll" scrollbars="vertical" style={{ height: "440px" }}>
            {threads?.map((thread) => {
              const latestMessage = thread.messages[thread.messages.length - 1];
              const isActive = thread.id === selectedThreadId;

              return (
                <Box 
                  key={thread.id} 
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 border-b border-(--gray-a4) cursor-pointer transition-colors hover:bg-(--gray-a3) ${isActive ? 'bg-(--gray-a3)' : ''}`}
                >
                  <Flex justify="between" align="start" mb="1">
                    <Flex align="center" gap="2">
                      <Text weight={thread.status === "unread" ? "bold" : "medium"} size="2">
                        {thread.sender}
                      </Text>
                      {thread.status === "unread" && <Box className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </Flex>
                    <Text size="1" color="gray">{latestMessage ? formatDate(latestMessage.timestamp) : ""}</Text>
                  </Flex>
                  <Text size="2" color="gray" className="line-clamp-2">
                    {latestMessage?.direction === "outgoing" ? "You: " : ""}{latestMessage?.content}
                  </Text>
                </Box>
              );
            })}
            </ScrollArea>
          </Box>
        </Card>

        {/* RIGHT PANE: Active Thread View */}
        <Card size="1" variant="surface" className="hidden md:flex flex-1 flex-col h-full overflow-hidden bg-sky-900">
          {activeThread?.id ? (
            <>
              {/* Thread Header */}
              <Flex align="center" justify="between" className="px-4 py-1 border-b border-(--gray-a6) bg-(--color-panel) shrink-0">
                <Flex align="center" gap="3">
                  <Avatar size="3" fallback={activeThread.sender.charAt(0)} color="indigo" radius="full" />
                  <Box>
                    <Text as="div" weight="bold" size="3">{activeThread.sender}</Text>
                    <Text as="div" size="2" color="gray">{activeThread.email}</Text>
                  </Box>
                </Flex>
                <Flex gap="2">
                  <IconButton variant="ghost" color="gray" style={{ cursor: "pointer" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </IconButton>
                </Flex>
              </Flex>

              {/* Chat History (Scrollable) */}
              <Box className="flex-1 flex flex-col gap-4 bg-(--gray-a2)">
                <ScrollArea type="hover" scrollbars="vertical" style={{ height: "380px", padding: "8px" }} ref={scrollContainerRef}>
                {activeThread.messages.map((msg) => {
                  const isOutgoing = msg.direction === "outgoing";
                  return (
                    <Flex key={msg.id} direction="column" align={isOutgoing ? "end" : "start"} className="w-full">
                      <Box 
                        className={`max-w-[75%] px-2 py-1 rounded-2xl ${
                          isOutgoing 
                            ? "bg-indigo-600 text-white rounded-br-sm mr-2" 
                            : "bg-(--color-panel) border border-(--gray-a6) rounded-bl-sm"
                        }`}
                      >
                        <Text size="2" className="leading-relaxed">
                          {msg.content}
                        </Text>
                      </Box>
                      <Text size="1" color="gray" mt="1" className={isOutgoing ? "mr-1" : "ml-1"}>
                        {formatTime(msg.timestamp)}
                      </Text>
                    </Flex>
                  );
                })}
                </ScrollArea>
              </Box>

              <Separator size="4" />

              {/* Reply Box */}
              <Box className="p-4 shrink-0 bg-(--gray-a2)">
                <form onSubmit={handleReplySubmit}>
                  <Flex gap="3" align="end">
                    <Box className="flex-1">
                      <TextArea 
                        size="3" 
                        color="grass"
                        placeholder={`Reply to ${activeThread.sender} (${activeThread.email})...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="resize-none"
                        disabled={isPending}
                        style={{ backgroundColor: "var(--gray-a4)", color: "ededed" }}
                      />
                    </Box>
                    <Button 
                      type="submit"
                      size="3" 
                      color="indigo" 
                      disabled={!replyText.trim() || isPending}
                      loading={isPending}
                      style={{ cursor: replyText.trim() && !isPending ? "pointer" : "not-allowed" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                      </svg>
                      Send
                    </Button>
                  </Flex>
                </form>
              </Box>
            </>
          ) : (
            // Empty State if no thread is selected
            <Flex align="center" justify="center" className="h-full text-center p-6 text-(--gray-a10)">
              <Box>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <Text size="3">Select a conversation to view and reply to messages.</Text>
              </Box>
            </Flex>
          )}
        </Card>

      </Flex>
    </Flex>
  );
}