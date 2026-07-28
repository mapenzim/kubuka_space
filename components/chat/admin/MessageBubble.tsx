"use client";

import { Box, Flex, Text } from "@radix-ui/themes";

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
        <Text size="2">
          {message.content}
        </Text>
      </Box>

      <Text size="1" color="gray">
        {formatTime(message.timestamp)}
      </Text>
    </Flex>
  );
}