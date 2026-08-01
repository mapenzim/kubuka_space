"use client";

import { useEffect, useRef } from "react";

import {
  Box,
  Flex,
  ScrollArea,
} from "@radix-ui/themes";

import MessageBubble from "./MessageBubble";
import { MessageDto } from "@/lib/dto";

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

  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

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
            />
          ))}
        </Flex>
      </ScrollArea>
    </Box>
  );
}