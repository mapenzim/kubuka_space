"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface UseEventStreamOptions<TEvent> {
  threadId?: string;
  clientId?: string;
  conversationKey?: string;

  reconnectDelay?: number;

  onOpen?(): void;
  onClose?(): void;
  onError?(error: Event): void;
  onEvent?(event: TEvent): void;
}

export function useEventStream<TEvent>({
  threadId,
  clientId,
  conversationKey,
  reconnectDelay = 3000,
  onOpen,
  onClose,
  onError,
  onEvent,
}: UseEventStreamOptions<TEvent>) {
  //--------------------------------------------------------
  // State
  //--------------------------------------------------------
  const [connected, setConnected] =
    useState(false);

  //--------------------------------------------------------
  // Stable callback refs
  //--------------------------------------------------------

  const onOpenRef =
    useRef(onOpen);

  const onCloseRef =
    useRef(onClose);

  const onErrorRef =
    useRef(onError);

  const onEventRef =
    useRef(onEvent);

  useEffect(() => {
    onOpenRef.current =
      onOpen;
  }, [onOpen]);

  useEffect(() => {
    onCloseRef.current =
      onClose;
  }, [onClose]);

  useEffect(() => {
    onErrorRef.current =
      onError;
  }, [onError]);

  useEffect(() => {
    onEventRef.current =
      onEvent;
  }, [onEvent]);

  //--------------------------------------------------------
  // EventSource lifecycle
  //--------------------------------------------------------

  useEffect(() => {
    const isThread =
      !!threadId;


    if (
      !isThread
    ) {
      return;
    }

    if (
      isThread &&
      !clientId
    ) {
      return;
    }

    let disposed =
      false;

    let reconnectTimer:
      | ReturnType<
          typeof setTimeout
        >
      | undefined;

    let source:
      | EventSource
      | undefined;

    function open() {
      if (disposed) {
        return;
      }

      //----------------------------------------------------
      // Build URL
      //----------------------------------------------------

      const params =
        new URLSearchParams();

      if (threadId) {
        params.set(
          "threadId",
          threadId,
        );
      }

      if (clientId) {
        params.set(
          "clientId",
          clientId,
        );
      }

      if (conversationKey) {
        params.set("conversationKey", conversationKey);
      }
      
      source =
        new EventSource(
          `/api/chat/events?${params.toString()}`,
        );

      //----------------------------------------------------
      // Open
      //----------------------------------------------------

      source.onopen = () => {
        if (disposed) {
          return;
        }

        setConnected(
          true,
        );

        onOpenRef.current?.();
      };

      //----------------------------------------------------
      // Messages
      //----------------------------------------------------

      source.onmessage = (
        message,
      ) => {
        if (disposed) {
          return;
        }

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

      //----------------------------------------------------
      // Error
      //----------------------------------------------------

      source.onerror = (
        error,
      ) => {
        if (disposed) {
          return;
        }

        setConnected(
          false,
        );

        onErrorRef.current?.(
          error,
        );

        source?.close();

        reconnectTimer =
          setTimeout(
            open,
            reconnectDelay,
          );
      };
    }

    //------------------------------------------------------
    // Initial connect
    //------------------------------------------------------

    open();

    //------------------------------------------------------
    // Cleanup
    //------------------------------------------------------

    return () => {
      disposed = true;

      if (
        reconnectTimer
      ) {
        clearTimeout(
          reconnectTimer,
        );
      }

      source?.close();

      setConnected(
        false,
      );

      onCloseRef.current?.();
    };
  }, [
    threadId,
    clientId,
    conversationKey,
    reconnectDelay,
  ]);

  //--------------------------------------------------------
  // API
  //--------------------------------------------------------

  return {
    connected,
  };
}
