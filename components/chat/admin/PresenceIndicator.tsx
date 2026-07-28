"use client";

import { Flex, Text } from "@radix-ui/themes";

interface PresenceIndicatorProps {
  connected: boolean;
  online: boolean;
  typing: boolean;
}

export default function PresenceIndicator({
  connected,
  online,
  typing,
}: PresenceIndicatorProps) {
  return (
    <Flex gap="2" wrap="wrap">
      <Text
        size="1"
        color={connected ? "green" : "orange"}
      >
        {connected
          ? "Realtime Connected"
          : "Realtime Disconnected"}
      </Text>

      {online && (
        <Text size="1" color="green">
          • Online
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