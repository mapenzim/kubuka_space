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

export default function ChatMessages({
  thread,
  selfRole,
}: ChatMessagesProps) {
  //--------------------------------------------------
  // Refs
  //--------------------------------------------------

  const scrollRef =
    useRef<HTMLDivElement>(null);

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
  }, [thread.messages]);

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (
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
            (message:any) => {
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
                        : "border"
                    }`}
                  >
                    <Text size="2">
                      {message.content}
                    </Text>
                  </Box>

                  <Text
                    size="1"
                    color="gray"
                  >
                    {formatTime(
                      message.timestamp,
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