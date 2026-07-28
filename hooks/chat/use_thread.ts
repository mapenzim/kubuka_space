"use client";

import {
  useCallback,
  useState,
} from "react";

import { chatClient } from "@/lib/api/chat_client";
import { ActivityType } from "@/lib/activity/activity";
import {
  SendMessageRequest,
  SetActivityRequest,
  StartConversationRequest,
} from "@/lib/api/types";
import {
  MessageDto,
} from "@/lib/dto";

import { useChat } from "./use_chat";
import { ThreadSummaryDto } from "@/lib/dto/thread_summary_dto";
import { ThreadDetailsDto } from "@/lib/dto/thread_details_dto";

export interface UseThreadOptions {
  threadId?: string;
  clientId?: string;

  onConnected?(clientId: string): void;
  onMessage?(message: MessageDto): void;
  onPresence?(clientId: string, online: boolean): void;
  onActivity?(clientId: string, activity: ActivityType): void;
}

export function useThread({
  threadId: initialThreadId,
  clientId,
  onConnected,
  onMessage,
  onPresence,
  onActivity,
}: UseThreadOptions = {}) {
  //--------------------------------------------------------
  // Thread State
  //--------------------------------------------------------

  const [thread, setThread] =
    useState<ThreadDetailsDto | null>(
      null,
    );

  //--------------------------------------------------------
  // Current Thread Id
  //--------------------------------------------------------

  const threadId =
    thread?.id ??
    initialThreadId;

  //--------------------------------------------------------
  // Conversation
  //--------------------------------------------------------

  const startConversation =
    useCallback(
      async (
        request: StartConversationRequest,
      ) => {
        const response =
          await chatClient.startConversation(
            request,
          );

        setThread(response.data);

        return response.data;
      },
      [],
    );

  //--------------------------------------------------------
  // Send Message 
  //--------------------------------------------------------

  const sendMessage =
    useCallback(
      async (
        request: Omit<
          SendMessageRequest,
          "threadId"
        >,
      ) => {
        if (!threadId) {
          throw new Error(
            "Thread is required.",
          );
        }

        const response =
          await chatClient.sendMessage({
            threadId,
            ...request,
          });

        setThread(previous => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            messages: [
              ...previous.messages,
              response.data,
            ],
          };
        });

        return response.data;
      },
      [threadId],
    );

  //--------------------------------------------------------
  // Activity
  //--------------------------------------------------------

  const setActivity =
    useCallback(
      async (
        activity: ActivityType,
      ) => {
        if (
          !threadId ||
          !clientId
        ) {
          return;
        }

        const request: SetActivityRequest =
          {
            threadId,
            clientId,
            activity,
          };

        await chatClient.setActivity(
          request,
        );
      },
      [
        threadId,
        clientId,
      ],
    );

  //--------------------------------------------------------
  // Realtime
  //--------------------------------------------------------

  const realtime =
    useChat({
      threadId,
      clientId,
      setActivity,

      onConnected,

      onMessage: message => {
        setThread(previous => {
          if (!previous) {
            return previous;
          }

          const exists =
            previous.messages.some(
              item =>
                item.id ===
                message.id,
            );

          if (exists) {
            return previous;
          }

          return {
            ...previous,
            messages: [
              ...previous.messages,
              message,
            ],
          };
        });

        onMessage?.(message);
      },

      onPresence,

      onActivity,
    });

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------

  return {
    ...realtime,

    thread,
    setThread,

    startConversation,
    sendMessage,
  };
}