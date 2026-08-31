"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  Box,
  Flex,
  ScrollArea,
  Text,
} from "@radix-ui/themes";

import { ChatMessagesProps } from "@/lib/type_interface";
import { formatTime } from "@/lib/utils";
import { useRelativeTimeClock } from "@/lib/chat/hooks/use_relative_time_clock";

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
        <Flex
          direction="column"
          gap="3"
        >
          {thread.messages.map(
            (message) => {
              const mine =
                message.senderRole ===
                selfRole;

              return (
                <Flex
                  key={message.id}
                  direction="column"
                  align={
                    mine
                      ? "end"
                      : "start"
                  }
                >
                  <Box
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      mine
                        ? "bg-indigo-600 text-white"
                        : "border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    <Text
                      size="2"
                      className={`whitespace-pre-wrap break-word ${
                        mine
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
                </Flex>
              );
            },
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
}
