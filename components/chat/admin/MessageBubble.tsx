"use client";

import { Box, Flex, Text } from "@radix-ui/themes";

import { formatTime } from "@/lib/utils";
import { MessageDto } from "@/lib/dto";

interface MessageBubbleProps {
  message: MessageDto;
  selfRole: "admin" | "user";
  now: number;
}

export default function MessageBubble({
  message,
  selfRole,
  now,
}: MessageBubbleProps) {
  const mine = message.senderRole === selfRole;

  return (
    <Flex
      direction="column"
      align={mine ? "end" : "start"}
    >
      <Box
        className={`max-w-[75%] rounded-2xl px-4 py-1 ${
          mine
            ? "bg-indigo-600 text-white"
            : "border"
        }`}
      >
        <Text
          size="2"
          className="whitespace-pre-wrap break-word"
        >
          {message.content}
        </Text>
      </Box>

      <Text size="1" color="gray">
        {message.senderRole === "bot"
          ? "Automated reply"
          : mine
            ? "Sent"
            : "Received"}{" "}
        {formatTime(message.timestamp, now)}
      </Text>
    </Flex>
  );
}
