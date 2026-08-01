"use client";

import { Flex, Text } from "@radix-ui/themes";
import { formatLastSeen } from "@/lib/utils";

interface PresenceIndicatorProps {
  connected: boolean;
  online: boolean;
  typing: boolean;
  lastSeen?: string;
}

export default function PresenceIndicator({
  connected,
  online,
  typing,
  lastSeen,
}: PresenceIndicatorProps) {
  const lastSeenLabel = lastSeen
    ? formatLastSeen(lastSeen)
    : undefined;
  return (
    <Flex gap="1" wrap="wrap">
      <Text
        size="1"
        color={connected ? "green" : "orange"}
      >
        {connected
          ? "Connected"
          : "Disconnected"}
      </Text>

      {online && (
        <Text size="1" color="green">
          • Online
        </Text>
      )}

      {lastSeenLabel && (
        <Text size="1" color="gray">
          • {online ? "Active" : "Last seen"} {lastSeenLabel}
        </Text>
      )}

      {typing && (
        <Text size="1" color="gray">
          • Typing...
        </Text>
      )}
    </Flex>
  );
}
