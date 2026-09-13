"use client";

import { Badge, Box, Text } from "@radix-ui/themes";
import { Bot } from "lucide-react";

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
  const isBot = message.senderRole === "bot";

  return (
    <div
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
        className={`flex min-w-0 max-w-[75%] flex-col ${
          isBot
            ? "items-center"
            : mine
              ? "items-end"
              : "items-start"
        }`}
      >
        <Box
          aria-label={isBot ? "Automated message from Kubuka Bot" : undefined}
          className={`w-fit max-w-full rounded-2xl px-4 py-2 ${
            isBot
              ? "border border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-100"
              : mine
              ? "bg-indigo-600 text-white"
              : "border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
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
            className="whitespace-pre-wrap break-word"
          >
            {message.content}
          </Text>
        </Box>

        <Text size="1" color="gray">
          {isBot
            ? "Automatic acknowledgement"
            : mine
              ? "Sent"
              : "Received"}{" "}
          {formatTime(message.timestamp, now)}
        </Text>
      </div>
    </div>
  );
}
