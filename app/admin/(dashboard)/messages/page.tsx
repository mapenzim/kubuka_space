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
import { UIThread } from "@/lib/interfaces";
import { toUIThread, useChat } from "@/hooks/sse";
import { formatTime } from "@/lib/utils";

const formatDate = (dateString: Date | string) => {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateString));
};

export default function AdminMessagesPage() {  
  const [threads, setThreads] = useState<UIThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [thread, setThread] = useState<UIThread | null>(null); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hook: subscribe to the selected thread
  const { sendMessage } = useChat(selectedThreadId ?? "", "admin");
  console.log("Selected Thread:", threads);

  // Initial load of threads
  useEffect(() => {
    async function init() {
      const res = await getActiveThreads();
      if (res.success && res.data) {
        const uiThreads = res.data.map(toUIThread);
        setThreads(uiThreads);
        if (!selectedThreadId && uiThreads.length > 0) {
          setSelectedThreadId(uiThreads[0].id);
        }
      }
    }
    init();
  }, []);

  // Keep threads updated when active thread changes
  useEffect(() => {
    if (!thread) return;
    setThreads(prev => {
      const existing = prev.find(t => t.id === thread.id);
      if (!existing) return [thread, ...prev];
      const remaining = prev.filter(t => t.id !== thread.id);
      return [thread, ...remaining]; // bubble to top
    });
  }, [thread]);

  // Auto scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thread?.messages.length]);

  useEffect(() => {
    async function loadThread() {
      if (!selectedThreadId) return;
      const res = await getThreadById(selectedThreadId);
      if (res.success && res.thread) {
        setThread(toUIThread(res.thread));
      }
    }
    loadThread();
  }, [selectedThreadId]);


  // Send reply
  async function handleReplySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!thread?.id) return;

    const content = replyText.trim();
    if (!content) return;

    startTransition(async () => {
      const res = await sendAdminReply({ threadId: thread.id, content });
      if (res.success && res.thread) {
        setReplyText("");
        setThreads(prev =>
          prev.map(t => (t.id === res.thread.id ? toUIThread(res.thread) : t))
        );
      }
    });
  }

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
                  className={`p-4 border-b cursor-pointer hover:bg-(--gray-a3) ${isActive ? 'bg-(--gray-a3)' : ''}`}
                >
                  <Flex justify="between" align="start" mb="1">
                    <Flex align="center" gap="2">
                      <Text weight={thread.id === "unread" ? "bold" : "medium"} size="2">
                        {thread.sender}
                      </Text>
                      {thread.id === "unread" && <Box className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </Flex>
                    <Text size="1" color="gray">
                      {latestMessage ? formatDate(latestMessage.timestamp) : ""}
                    </Text>
                  </Flex>
                  <Text size="2" color="gray" className="line-clamp-2">
                    {latestMessage?.role === "admin" ? "You: " : ""}{latestMessage?.content}
                  </Text>
                </Box>
              );
            })}
            </ScrollArea>
          </Box>
        </Card>

        {/* RIGHT PANE: Active Thread View */}
        <Card size="1" variant="surface" className="hidden md:flex flex-1 flex-col h-full overflow-hidden bg-sky-900">
          {thread?.id ? (
            <>
              {/* Thread Header */}
              <Flex align="center" justify="between" className="px-4 py-1 border-b border-(--gray-a6) bg-(--color-panel) shrink-0">
                <Flex align="center" gap="3">
                  <Avatar size="3" fallback={thread.sender.charAt(0)} color="indigo" radius="full" />
                  <Box>
                    <Text as="div" weight="bold" size="3">{thread.sender}</Text>
                    <Text as="div" size="2" color="gray">{thread.email}</Text>
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
                <ScrollArea type="hover" scrollbars="vertical" style={{ height: "380px", padding: "8px" }} ref={scrollRef}>
                {thread.messages.map((msg) => {
                  const isOutgoing = msg.role === "admin";
                  return (
                    <Flex key={msg.id} direction="column" mb={'2'} align={isOutgoing ? "end" : "start"} className="w-full">
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
                      <Text size="1" color="gray" className={`${isOutgoing ? "mr-3!" : "ml-1!"} text-[9px]! mt-0.5!`}>
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
                        placeholder={`Reply to ${thread.sender} (${thread.email})...`}
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