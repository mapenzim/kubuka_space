"use client";

import {
  Avatar,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";

import PresenceIndicator from "./PresenceIndicator";
import { ThreadDetailsDto } from "@/lib/dto/thread_details_dto";
import RemoveItemAlert from "@/components/modals/admin-delete-alert";

interface ConversationHeaderProps {
  thread: ThreadDetailsDto;
  connected: boolean;
  online: boolean;
  typing: boolean;
  lastSeen?: string;
  onDelete?: () => void;
}

export default function ConversationHeader({
  thread,
  connected,
  online,
  typing,
  lastSeen,
  onDelete,
}: ConversationHeaderProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
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
            connected={online}
            online={online}
            typing={typing}
            lastSeen={lastSeen}
          />
        </Flex>
        </Flex>

        <IconButton
          variant="ghost"
          aria-label="Delete conversation"
          color="red"
          onClick={() => setDeleteOpen(true)}
        >
          ×
        </IconButton>
      </Flex>

      <RemoveItemAlert
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete conversation?"
        description="This conversation and all of its messages will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          await onDelete?.();
          setDeleteOpen(false);
        }}
      />
    </>
  );
}
