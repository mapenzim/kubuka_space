"use client";

import { useEffect, useRef } from "react";

import {
  Box,
  Flex,
  ScrollArea,
} from "@radix-ui/themes";

import MessageBubble from "./MessageBubble";
import { MessageDto } from "@/lib/dto";
import { useRelativeTimeClock } from "@/lib/chat/hooks/use_relative_time_clock";

interface ConversationMessagesProps {
  messages: MessageDto[];
  selfRole: "admin" | "user";
  height?: number;
}

export default function ConversationMessages({
  messages,
  selfRole,
  height = 320,
}: ConversationMessagesProps) {
  const viewportRef =
    useRef<HTMLDivElement>(null);
  const now = useRelativeTimeClock();
  const lastMessageId = messages.at(-1)?.id;

  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lastMessageId]);

  return ( 
    <Box className="flex-1 overflow-hidden">
      <ScrollArea
        ref={viewportRef}
        style={{
          height,
          padding: 16,
        }}
      >
        <Flex
          direction="column"
          gap="3"
        >
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              selfRole={selfRole}
              now={now}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Box>
  );
}
