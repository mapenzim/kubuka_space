"use client";

import { memo, useEffect, useState } from "react";

import {
  Card,
  Flex,
  ScrollArea,
  Text,
} from "@radix-ui/themes";

import { ThreadSummaryDto } from "@/lib/dto/thread_summary_dto";
import { formatTime } from "@/lib/utils";

interface InboxSidebarProps {
  threads: ThreadSummaryDto[];
  selectedThreadId: string | null;
  onSelect: (threadId: string) => void;
}

interface InboxSidebarItemProps {
  thread: ThreadSummaryDto;
  selected: boolean;
  onSelect: (threadId: string) => void;
  now: number;
}

const InboxSidebarItem = memo(function InboxSidebarItem({
  thread,
  selected,
  onSelect,
  now,
}: InboxSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(thread.id)}
      className={`w-full text-left border-b p-3 transition-colors hover:bg-amber-300 ${
        selected
          ? "bg-amber-200"
          : "bg-(--gray-a3)"
      }`}
    >
      <Flex justify="between" align="start">
        <Flex direction="column" gap="1">
          <Text
            weight={thread.unread ? "bold" : "medium"}
          >
            {thread.sender}
          </Text>

          <Text size="1" color="gray">
            {thread.email}
          </Text>

          <Text
            size="1"
            color={thread.online ? "green" : "gray"}
          >
            {thread.online ? "Online" : "Offline"}
          </Text>
        </Flex>

        {thread.lastMessageAt && (
          <Text size="1" color="gray">
            {formatTime(thread.lastMessageAt)}
          </Text>
        )}
      </Flex>

      <Text
        mt="2"
        size="2"
        color="gray"
        className="line-clamp-2 italic"
      >
        {thread.lastMessage ?? "No messages"}
      </Text>
    </button>
  );
});

export default function InboxSidebar({
  threads,
  selectedThreadId,
  onSelect,
}: InboxSidebarProps) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <Card className="w-full md:w-80 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        {threads.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            className="h-full p-8"
          >
            <Text color="gray">
              No conversations
            </Text>
          </Flex>
        ) : (
          threads.map(thread => (
            <InboxSidebarItem
              key={thread.id}
              thread={thread}
              selected={selectedThreadId === thread.id}
              onSelect={onSelect}
              now={now}
            />
          ))
        )}
      </ScrollArea>
    </Card>
  );
}
