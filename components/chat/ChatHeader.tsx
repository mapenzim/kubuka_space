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
      className="border-b p-4"
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

        <Text
          size="1"
          color="gray"
        >
          {thread.email}
        </Text>

        <Flex
          align="center"
          gap="2"
          mt="1"
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
              • Typing…
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}