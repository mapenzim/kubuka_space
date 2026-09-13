"use client";

import { memo } from "react";

import {
  Card,
  Flex,
  ScrollArea,
  Text,
} from "@radix-ui/themes";

import { ThreadSummaryDto } from "@/lib/dto/thread_summary_dto";
import { useRelativeTimeClock } from "@/lib/chat/hooks/use_relative_time_clock";
import { formatTime } from "@/lib/utils";

interface InboxSidebarProps {
  threads: ThreadSummaryDto[];
  selectedThreadId: string | null;
  onSelect: (threadId: string) => void;
}

interface InboxSidebarItemProps {
  thread: ThreadSummaryDto;
  selected: boolean;
  now: number;
  onSelect: (threadId: string) => void;
}

const InboxSidebarItem = memo(function InboxSidebarItem({
  thread,
  selected,
  now,
  onSelect,
}: InboxSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(thread.id)}
      className={`w-full text-left border-b p-3 transition-colors dark:hover:bg-indigo-600 hover:bg-indigo-300 ${
        selected
          ? "dark:bg-indigo-500 bg-indigo-200"
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
        </Flex>

        {thread.lastMessageAt && (
          <Text size="1" color="gray">
            {formatTime(thread.lastMessageAt, now)}
          </Text>
        )}
      </Flex>

    </button>
  );
});

export default function InboxSidebar({
  threads,
  selectedThreadId,
  onSelect,
}: InboxSidebarProps) {
  const now = useRelativeTimeClock();

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden">
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
              now={now}
              onSelect={onSelect}
            />
          ))
        )}
      </ScrollArea>
    </Card>
  );
}
