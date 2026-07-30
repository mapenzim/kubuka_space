"use client";

import {
  Avatar,
  Box,
  Flex,
  Text,
} from "@radix-ui/themes";

import { ChatHeaderProps } from "@/lib/type_interface";

export default function ChatHeader({
  thread,
  connected,
  online,
  typing,
}: ChatHeaderProps) {
  return (
    <Flex
      align="center"
      gap="3"
      className="border-b px-4 pb-1"
    >
      <Avatar
        radius="full"
        fallback={thread.sender
          .charAt(0)
          .toUpperCase()}
      />

      <Box className="flex-1">
        <Text weight="bold">
          {thread.sender}
        </Text>
        <Flex align='start'>
          <Text
            size="1"
            color="gray"
          >
            {thread.email}
          </Text>
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
            >
              • An admin is typing …
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}