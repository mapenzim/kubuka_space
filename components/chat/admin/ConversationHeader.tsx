"use client";

import {
  Avatar,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";

import PresenceIndicator from "./PresenceIndicator";
import { ThreadDetailsDto } from "@/lib/dto/thread_details_dto";

interface ConversationHeaderProps {
  thread: ThreadDetailsDto;
  connected: boolean;
  online: boolean;
  typing: boolean;
}

export default function ConversationHeader({
  thread,
  connected,
  online,
  typing,
}: ConversationHeaderProps) {
  return (
    <Flex
      justify="between"
      align="center"
      className="border-b p-4"
    >
      <Flex gap="3" align="center">
        <Avatar
          radius="full"
          fallback={thread.sender
            .charAt(0)
            .toUpperCase()}
        />

        <Flex direction="column" gap="1">
          <Text weight="bold">
            {thread.sender}
          </Text>

          <Text
            size="1"
            color="gray"
          >
            {thread.email}
          </Text>

          <PresenceIndicator
            connected={connected}
            online={online}
            typing={typing}
          />
        </Flex>
      </Flex>

      <IconButton
        variant="ghost"
        aria-label="Conversation options"
      >
        ⋮
      </IconButton>
    </Flex>
  );
}