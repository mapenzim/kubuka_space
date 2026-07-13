// hooks/useInbox.ts

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getThreads } from "@/app/actions/messageThreadAction";

import { ThreadSummary } from "@/server/chat/models";

interface InboxEvent {
  type:
    | "thread.created"
    | "thread.updated"
    | "thread.read"
    | "thread.unread"
    | "thread.archived"
    | "thread.deleted";

  payload: any;
}

export function useInbox() {
  const es =
    useRef<EventSource | null>(
      null
    );

  const [connected, setConnected] =
    useState(false);

  const [threads, setThreads] =
    useState<ThreadSummary[]>([]);

  const [
    selectedThreadId,
    setSelectedThreadId,
  ] = useState<string>();

  //--------------------------------------------------
  // Initial Load
  //--------------------------------------------------

  const load =
    useCallback(async () => {
      const result =
        await getThreads();

      if (!result.success) {
        return;
      }

      setThreads(
        result.threads
      );

      if (
        !selectedThreadId &&
        result.threads.length
      ) {
        setSelectedThreadId(
          result.threads[0].id
        );
      }
    }, [
      selectedThreadId,
    ]);

  useEffect(() => {
    load();
  }, [load]);

  //--------------------------------------------------
  // Inbox SSE
  //--------------------------------------------------

  useEffect(() => {
    es.current?.close();

    const source =
      new EventSource(
        "/api/chat/inbox"
      );

    es.current = source;

    source.onopen = () =>
      setConnected(true);

    source.onmessage = (
      event
    ) => {
      const data =
        JSON.parse(
          event.data
        ) as InboxEvent;

      switch (
        data.type
      ) {
        //------------------------------------------------
        // Created / Updated / Read / Unread
        //------------------------------------------------

        case "thread.created":
        case "thread.updated":
        case "thread.read":
        case "thread.unread":
          setThreads(
            (previous) => {
              const remaining =
                previous.filter(
                  (t) =>
                    t.id !==
                    data.payload.id
                );

              return [
                data.payload,
                ...remaining,
              ];
            }
          );

          break;

        //------------------------------------------------
        // Archived / Deleted
        //------------------------------------------------

        case "thread.archived":
        case "thread.deleted":
          setThreads(
            (previous) =>
              previous.filter(
                (t) =>
                  t.id !==
                  data.payload.id
              )
          );

          break;
      }
    };

    source.onerror = () => {
      setConnected(false);

      source.close();

      setTimeout(() => {
        load();
      }, 2000);
    };

    return () => {
      source.close();
    };
  }, [load]);

  //--------------------------------------------------
  // Helpers
  //--------------------------------------------------

  const selected =
    useMemo(
      () =>
        threads.find(
          (t) =>
            t.id ===
            selectedThreadId
        ),
      [
        threads,
        selectedThreadId,
      ]
    );

  const unreadCount =
    useMemo(
      () =>
        threads.filter(
          (t) => t.unread
        ).length,
      [threads]
    );

  //--------------------------------------------------
  // API
  //--------------------------------------------------

  return {
    connected,

    threads,

    unreadCount,

    selected,

    selectedThreadId,

    setSelectedThreadId,

    reload: load,
  };
}