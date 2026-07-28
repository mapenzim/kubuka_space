"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseEventStreamOptions<TEvent> {
  threadId?: string;
  channel?: string;
  clientId?: string;
  reconnectDelay?: number;

  onEvent?(event: TEvent): void;
}

export function useEventStream<TEvent>({
  threadId,
  channel,
  clientId,
  reconnectDelay = 3000,
  onEvent,
}: UseEventStreamOptions<TEvent>) {
  //--------------------------------------------------------
  // Refs
  //--------------------------------------------------------

  const sourceRef =
    useRef<EventSource | null>(null);

  const reconnectRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const mountedRef =
    useRef(false);

  const onEventRef =
    useRef(onEvent);

  //--------------------------------------------------------
  // State
  //--------------------------------------------------------

  const [connected, setConnected] =
    useState(false);

  //--------------------------------------------------------
  // Keep callback fresh
  //--------------------------------------------------------

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  //--------------------------------------------------------
  // Disconnect
  //--------------------------------------------------------

  const disconnect =
    useCallback(() => {
      sourceRef.current?.close();
      sourceRef.current = null;

      setConnected(false);

      if (reconnectRef.current) {
        clearTimeout(
          reconnectRef.current,
        );

        reconnectRef.current =
          null;
      }
    }, []);

  //--------------------------------------------------------
  // Connect
  //--------------------------------------------------------

  const connect =
    useCallback(() => {
      if (
        !threadId &&
        !channel
      ) {
        return;
      }

      if (
        sourceRef.current &&
        sourceRef.current
          .readyState !==
          EventSource.CLOSED
      ) {
        return;
      }

      const params =
        new URLSearchParams();

      if (threadId) {
        params.set(
          "threadId",
          threadId,
        );
      }

      if (channel) {
        params.set(
          "channel",
          channel,
        );
      }

      if (clientId) {
        params.set(
          "clientId",
          clientId,
        );
      }

      console.log({
        threadId,
        channel,
        clientId,
      });

      const source =
        new EventSource(
          `/api/chat/events?${params.toString()}`
        );

      sourceRef.current =
        source;

      source.onopen = () => {
        setConnected(true);
      };

      source.onmessage = (
        message,
      ) => {
        try {
          const event =
            JSON.parse(
              message.data,
            ) as TEvent;

          onEventRef.current?.(
            event,
          );
        } catch (error) {
          console.error(
            "[SSE]",
            error,
          );
        }
      };

      source.onerror = () => {
        disconnect();

        if (
          !mountedRef.current
        ) {
          return;
        }

        reconnectRef.current =
          setTimeout(
            connect,
            reconnectDelay,
          );
      };
    }, [
      threadId,
      channel,
      clientId,
      reconnectDelay,
      disconnect,
    ]);

  //--------------------------------------------------------
  // Lifecycle
  //--------------------------------------------------------

  useEffect(() => {
    mountedRef.current = true;

    connect();

    return () => {
      mountedRef.current =
        false;

      disconnect();
    };
  }, [
    connect,
    disconnect,
  ]);

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------

  return {
    connected,
    reconnect: connect,
    disconnect,
  };
}