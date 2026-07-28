"use client";

import {
  useCallback,
  useState,
} from "react";

import { MessageDto } from "@/lib/dto";
import { ChatEvent } from "@/lib/events/chat_event";
import { ChatEventType } from "@/lib/events/chat_event_type";

import { useEventStream } from "../use_event_stream";
import { useTypingIndicator } from "./use_typing_indicator";

export const ActivityType = {
  IDLE: "idle",
  TYPING: "typing",
  UPLOADING: 'uploading',
  RECORDING: 'recording'
} as const;

export type ActivityType =
  (typeof ActivityType)[keyof typeof ActivityType];

interface UseChatOptions {
  threadId?: string;
  clientId?: string;

  setActivity(
    activity: ActivityType,
  ): Promise<void>;

  onConnected?(
    clientId: string,
  ): void;

  onMessage?(
    message: MessageDto,
  ): void;

  onPresence?(
    clientId: string,
    online: boolean,
  ): void;

  onActivity?(
    clientId: string,
    activity: ActivityType,
  ): void;
}

export function useChat({
  threadId,
  clientId,
  setActivity,
  onConnected,
  onMessage,
  onPresence,
  onActivity,
}: UseChatOptions) {
  //--------------------------------------------------------
  // Remote Participant State
  //--------------------------------------------------------

  const [online, setOnline] =
    useState(false);

  const [typing, setTyping] =
    useState(false);

  //--------------------------------------------------------
  // Event Handler
  //--------------------------------------------------------

  const handleEvent = useCallback(
    (event: ChatEvent) => {
      switch (event.type) {
        case ChatEventType.CONNECTED:
          onConnected?.(
            event.payload.clientId,
          );
          break;

        case ChatEventType.MESSAGE_CREATED:
          onMessage?.(
            event.payload.message,
          );
          break;

        case ChatEventType.PRESENCE_CHANGED:
          setOnline(
            event.payload.online,
          );

          onPresence?.(
            event.payload.clientId,
            event.payload.online,
          );

          break;

        case ChatEventType.ACTIVITY_CHANGED:
          setTyping(
            event.payload.activity ===
              "typing",
          );

          onActivity?.(
            event.payload.clientId,
            event.payload.activity,
          );

          break;
      }
    },
    [
      onConnected,
      onMessage,
      onPresence,
      onActivity,
    ],
  );

  //--------------------------------------------------------

  const {
    connected,
    reconnect,
    disconnect,
  } = useEventStream<ChatEvent>({
    threadId,
    clientId,
    onEvent: handleEvent,
  });

  //--------------------------------------------------------
  // Local Typing
  //--------------------------------------------------------

  const startTyping =
    useCallback(
      () =>
        setActivity(
          ActivityType.TYPING,
        ),
      [setActivity],
    );

  const stopTyping =
    useCallback(
      () =>
        setActivity(
          ActivityType.IDLE,
        ),
      [setActivity],
    );

  const {
    onInput,
    forceIdle,
  } =
    useTypingIndicator({
      startTyping,
      stopTyping,
    });

  //--------------------------------------------------------

  return {
    connected,
    online,
    typing,

    reconnect,
    disconnect,

    onInput,
    forceIdle,
  };
}