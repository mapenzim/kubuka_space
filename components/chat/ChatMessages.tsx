"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  Badge,
  Box,
  ScrollArea,
  Text,
} from "@radix-ui/themes";

import { ChatMessagesProps } from "@/lib/type_interface";
import { formatTime } from "@/lib/utils";
import { useRelativeTimeClock } from "@/lib/chat/hooks/use_relative_time_clock";
import { Bot } from "lucide-react";
import SnippetDeliveryCard from "@/components/snippets/SnippetDeliveryCard";
import { parseSnippetDeliveryMarker } from "@/lib/snippets";

export default function ChatMessages({
  thread,
  selfRole,
}: ChatMessagesProps) {
  //--------------------------------------------------
  // Refs
  //--------------------------------------------------

  const scrollRef =
    useRef<HTMLDivElement>(null);
  const now = useRelativeTimeClock();
  const lastMessageId = thread.messages.at(-1)?.id;

  //--------------------------------------------------
  // Auto Scroll
  //--------------------------------------------------

  useEffect(() => {
    const container =
      scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [lastMessageId]);

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (
    <Box className="flex-1 overflow-hidden bg-zinc-50/70 dark:bg-zinc-950/40">
      <ScrollArea
        ref={scrollRef}
        style={{
          height: 390,
          padding: 16,
        }}
      >
        <div className="grid w-full min-w-0 grid-cols-1 gap-3">
          {thread.messages.map(
            (message) => {
              const snippetRequestId = parseSnippetDeliveryMarker(message.content);
              if (snippetRequestId) {
                return (
                  <div key={message.id} className="flex w-full justify-center py-2">
                    <SnippetDeliveryCard requestId={snippetRequestId} />
                  </div>
                );
              }
              const mine =
                message.senderRole ===
                selfRole;
              const isBot =
                message.senderRole ===
                "bot";

              return (
                <div
                  key={message.id}
                  data-sender-role={message.senderRole}
                  className={`flex w-full min-w-0 ${
                    isBot
                      ? "justify-center"
                      : mine
                        ? "justify-end"
                        : "justify-start"
                  }`}
                >
                  <div
                    className={`flex min-w-0 max-w-[80%] flex-col ${
                      isBot
                        ? "items-center"
                        : mine
                          ? "items-end"
                          : "items-start"
                    }`}
                  >
                    <Box
                      className={`w-fit max-w-full rounded-2xl px-4 py-2 ${
                        isBot
                          ? "border border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-100"
                          : mine
                            ? "bg-indigo-600 text-white"
                            : "border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      }`}
                    >
                      {isBot && (
                        <Badge color="violet" variant="soft" radius="full" mb="1">
                          <Bot aria-hidden="true" size={13} />
                          Kubuka Bot
                        </Badge>
                      )}
                      <Text
                        size="2"
                        className={`whitespace-pre-wrap break-word ${
                          isBot
                            ? "text-violet-950 dark:text-violet-100"
                            : mine
                            ? "text-white"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {message.content}
                      </Text>
                    </Box>

                    <Text
                      size="1"
                      className="text-zinc-500 dark:text-zinc-400"
                    >
                      {message.senderRole === "bot" && "Automated reply · "}
                      {formatTime(
                        message.timestamp,
                        now,
                      )}
                    </Text>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
    </Box>
  );
}
