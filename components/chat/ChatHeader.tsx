"use client";

import {
  Avatar,
  Box,
  Flex,
  Text,
} from "@radix-ui/themes";

import { ChatHeaderProps } from "@/lib/type_interface";
import { formatLastSeen } from "@/lib/utils";

export default function ChatHeader({
  thread,
  connected,
  online,
  typing,
  lastSeen,
}: ChatHeaderProps) {
  return (
    <Flex
      align="center"
      gap="3"
      className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"
    >
      <Avatar
        radius="full"
        fallback={thread.sender
          .charAt(0)
          .toUpperCase()}
      />

      <Box className="flex-1">
        <Text weight="bold" className="text-zinc-900 dark:text-zinc-100">
          {thread.sender}
        </Text>
        <Flex align='start'>
          <Text
            size="1"
            className="text-zinc-500 dark:text-zinc-400"
          >
            {thread.email}
          </Text>

          {lastSeen && (
            <Text size="1" className="text-zinc-500 dark:text-zinc-400">
              • Last seen {formatLastSeen(lastSeen)}
            </Text>
          )}
        </Flex>

        <Flex
          align="center"
          gap="1"
        >
          <Text
            size="1"
            color={
              connected
                ? "green"
                : "orange"
            }
            className="dark:text-zinc-300"
          >
            {connected
              ? "Connected"
              : "Disconnected"}
          </Text>

          <Text
            size="1"
            color={
              online
                ? "green"
                : "gray"
            }
            className="dark:text-zinc-400"
          >
            •{" "}
            {online
              ? "Online"
              : "Offline"}
          </Text>

          {typing && (
            <Text
              size="1"
              color="blue"
              className="dark:text-sky-300"
            >
              • An admin is typing …
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
