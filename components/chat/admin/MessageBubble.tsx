"use client";

import { Box, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

import { formatTime } from "@/lib/utils";
import { MessageDto } from "@/lib/dto";

interface MessageBubbleProps {
  message: MessageDto;
  selfRole: "admin" | "user";
}

export default function MessageBubble({
  message,
  selfRole,
}: MessageBubbleProps) {
  const mine = message.senderRole === selfRole;
  const [, refresh] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      refresh((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Flex
      direction="column"
      align={mine ? "end" : "start"}
    >
      <Box
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          mine
            ? "bg-indigo-600 text-white"
            : "border"
        }`}
      >
        <Text
          size="2"
          className="whitespace-pre-wrap break-words leading-tight"
        >
          {message.content}
        </Text>
      </Box>

      <Text size="1" color="gray">
        {mine ? "Sent" : "Received"} {formatTime(message.timestamp)}
      </Text>
    </Flex>
  );
}
