"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { 
  Container, 
  Heading, 
  Text, 
  Section, 
  Grid, 
  Flex, 
  Box, 
  TextField, 
  Button, 
  Card,
  Link,
  Separator,
  Callout,
  Avatar,
  TextArea,
  ScrollArea
} from "@radix-ui/themes";

// Lexical Imports
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"; // <-- Added this
import { getThreadById, receiveIncomingMessage } from "@/app/actions/messageThreadAction";
import { Thread } from "@/lib/interfaces";

// Server Action Import (Adjust path as needed)

// --- LEXICAL CONFIGURATION ---
const theme = {
  paragraph: "mb-2 text-gray-900 dark:text-gray-100",
};

function onError(error: Error) {
  console.error("Lexical Error:", error);
}

// 1. Added an onChange prop so the parent form can receive the typed data
function FormLexicalEditor({ onChange }: { onChange: (text: string) => void }) {
  const initialConfig = {
    namespace: "ContactFormMessage",
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
        <div className="relative flex min-h-36 w-full flex-col rounded-(--radius-2) border border-(--gray-a7) bg-(--color-panel) p-3 text-sm transition-colors focus-within:border-(--accent-a8) focus-within:ring-1 focus-within:ring-(--accent-a8) dark:border-(--gray-a6)">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-full w-full flex-1 outline-none" />
          }
          placeholder={
            <div className="pointer-events-none absolute top-3 left-3 select-none text-(--gray-a10)">
              How can we help you today?
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />

        {/* 2. Added OnChangePlugin to extract the plain text */}
        <OnChangePlugin 
          onChange={(editorState) => {
            editorState.read(() => {
              // Extracting raw text. If you prefer the JSON format for rich text 
              // inside your admin dashboard, you can use JSON.stringify(editorState.toJSON()) instead.
              const root = editorState._nodeMap.get('root');
              onChange(root ? root.getTextContent() : "");

              //const text = editorState
              //  .toJSON()
              //  ?.root?.children
              //  ?.map((n: any) => n.text)
              //  .join(" ") || "";

              //onChange(text);
            });
          }} 
        />
      </div>
    </LexicalComposer>
  );
}

const formatTime = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(date));
};

// --- MAIN PAGE COMPONENT ---
export default function ContactUsPage() {
  const [isPending, startTransition] = useTransition();
  const [errorText, setErrorText] = useState("");
  
  // States for the Form
  const [messageContent, setMessageContent] = useState("");
  
  // States for the Chat View
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [replyText, setReplyText] = useState("");
  
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

  // ----------------------------------------------------
  // Auto scroll
  // ----------------------------------------------------
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeThread?.messages?.length]);

  // ----------------------------------------------------
  // Start conversation
  // ----------------------------------------------------
  async function handleInitialSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setErrorText("");

    const formData = new FormData(e.currentTarget);

    const sender = String(formData.get("sender"));
    const email = String(formData.get("email"));

    if (!messageContent.trim()) {
      setErrorText("Please enter a message.");
      return;
    }

    startTransition(async () => {
      const res = await receiveIncomingMessage({
        sender,
        email,
        content: messageContent,
      });

      if (!res.success) {
        setErrorText("Failed to send message.");
        return;
      }

      setActiveThread(res.thread ?? null);
    });
  }

  // ----------------------------------------------------
  // Send reply (chat mode)
  // ----------------------------------------------------
  async function handleChatReply() {
    if (!activeThread || !replyText.trim()) return;

    startTransition(async () => {
      const res = await receiveIncomingMessage({
        sender: activeThread.sender,
        email: activeThread.email,
        content: replyText,
      });

      if (res.success) {
        setReplyText("");
      }
    });
  }

  const isChatMode = !!activeThread;

  return (
    <Container size="4" px="4" mt={{ initial: "4", md: "8" }} pb="8" className="bg-gray-100 dark:bg-zinc-800! dark:text-gray-300">
      <Section size="3">
        
        {/* Page Header is hidden if chatting to make it feel like a focused app */}
        {!isChatMode && (
          <Box mb="6" className="text-center md:text-left">
            <Heading as="h1" size="8" mb="2">Get in Touch</Heading>
            <Text as="p" size="4" color="gray" className="dark:text-zinc-400!">
              We'd love to hear from you. Fill out the form or reach out directly.
            </Text>
          </Box>
        )}

        <Grid columns={{ initial: "1", md: "2" }} gap="6" align="start">
          
          {/* THE DYNAMIC LEFT SIDE: Shows Form OR Chat */}
          {!isChatMode ? (
            <Card size="4" variant="surface" className="dark:bg-zinc-800!">
              {errorText && (
                <Text color="ruby" size="2" mb="4" as="div">{errorText}</Text>
              )}
              <form onSubmit={handleInitialSubmit}>
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="label" size="2" weight="medium" mb="1">Full Name</Text>
                    <TextField.Root name="sender" placeholder="Jane Doe" size="3" required disabled={isPending} />
                  </Box>
                  <Box>
                    <Text as="label" size="2" weight="medium" mb="1">Email Address</Text>
                    <TextField.Root name="email" placeholder="jane@example.com" type="email" size="3" required disabled={isPending} />
                  </Box>
                  <Box>
                    <Text as="label" size="2" weight="medium" mb="1">Your Message</Text>
                    <FormLexicalEditor onChange={setMessageContent} />
                  </Box>
                  <Button type="submit" size="3" color="indigo" mt="2" loading={isPending}>
                    Start Conversation
                  </Button>
                </Flex>
              </form>
            </Card>
          ) : (
            // ==========================================
            // THE CHAT APP VIEW
            // ==========================================
            <Card size="1" variant="surface" className="flex flex-col h-150 overflow-hidden shadow-lg mx-auto w-full max-w-3xl dark:bg-zinc-900!">
              
              {/* Chat Header */}
              <Flex align="center" justify="between" className="p-4 border-b border-(--gray-a6) bg-(--color-panel) shrink-0">
                <Flex align="center" gap="3">
                  <Avatar size="3" fallback="K" color="indigo" radius="full" />
                  <Box>
                    <Text as="div" weight="bold" size="3">Kubuka Support Team</Text>
                    <Text as="div" size="2" color="gray">We typically reply within a few hours</Text>
                  </Box>
                </Flex>
              </Flex>

              {/* Chat History */}
              <Box className="flex-1 flex flex-col gap-4 bg-(--gray-a2)">
                <ScrollArea type="hover" scrollbars="vertical" style={{ height: 392, padding: "16px" }} ref={scrollContainerRef}>

                  {activeThread?.messages?.map((msg) => {
                    // For the USER, an "incoming" message in the DB means THEY sent it. 
                    // "outgoing" means the ADMIN sent it to them.
                    const isUserMessage = msg?.direction === "incoming";
                    
                    return (
                      <Flex key={msg?.id} direction="column" align={isUserMessage ? "end" : "start"} className="w-full">
                        <Box 
                          className={`max-w-[85%] md:max-w-[75%] px-3 py-3 rounded-2xl ${
                            isUserMessage 
                              ? "bg-indigo-600 text-white rounded-br-sm" 
                              : "bg-(--color-panel) border border-(--gray-a6) rounded-bl-sm"
                          }`}
                        >
                          <Text size="2" className="leading-relaxed">
                            {msg?.content}
                          </Text>
                        </Box>
                        <Text size="1" color="gray" mt="1" className={isUserMessage ? "mr-1" : "ml-1"}>
                          {/*formatTime(msg.timestamp)*/}
                        </Text>
                      </Flex>
                    );
                  })}
                </ScrollArea>
              </Box>

              <Separator size="4" />

              {/* Chat Reply Box */}
              <Box className="p-2 shrink-0 bg-(--color-panel)">
                <Flex gap="3" align="end">
                  <Box className="flex-1">
                    <TextArea 
                      size="3" 
                      placeholder="Type a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="resize-none"
                      disabled={isPending}
                    />
                  </Box>
                  <Button 
                    size="3" 
                    color="indigo" 
                    disabled={!replyText.trim() || isPending}
                    onClick={handleChatReply}
                    loading={isPending}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                    Send
                  </Button>
                </Flex>
              </Box>
            </Card>
          )}

          {/* RIGHT SIDE: Contact Information */}
          <Flex direction="column" gap="6" pl={{ initial: "0", md: "6" }}>
            <Box>
              <Heading as="h3" size="5" mb="3">Contact Information</Heading>
              <Flex direction="column" gap="3">
                <Flex align="center" gap="3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <Text size="3">+263 (0) 77 715 1673</Text>
                </Flex>

                <Flex align="center" gap="3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <Link href="mailto:mudimbam@outlook.com" size="3">mudimbam@outlook.com</Link>
                </Flex>
              </Flex>
            </Box>

            <Separator size="4" />

            <Box>
              <Heading as="h3" size="5" mb="3">Our Office</Heading>
              <Flex align="start" gap="3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 mt-1 shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <Text size="3" className="leading-relaxed">
                  Kubuka Headquarters<br />
                  123 Innovation Drive<br />
                  Kasambabezi <br /> 
                  Binga, Zimbabwe
                </Text>
              </Flex>
            </Box>
          </Flex>
          
        </Grid>
      </Section>
    </Container>
  );
}
