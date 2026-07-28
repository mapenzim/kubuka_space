"use client";

import {
  useCallback,
  useSyncExternalStore,
} from "react";

import {
  conversationClient,
} from "@/lib/chat/client";

import {
  useChatSession,
} from "@/lib/chat/session";

import {
  StartConversationRequest,
} from "@/lib/api/types";

import { chatStores } from "../stores";

export function useConversation() {
  const session = useChatSession();

  const { conversation } =
    chatStores;

  const {
    thread,
    messages,
  } = useSyncExternalStore(
    conversation.subscribe,
    conversation.snapshot,
    conversation.snapshot
  );

  //--------------------------------------------------------
  // Load Thread
  //--------------------------------------------------------
  const loadThread = useCallback(
    async (threadId: string) => {
      if (!threadId) {
        conversation.clear();
        session.setThreadId("");
        return null;
      }

      const response =
        await conversationClient.getThread(
          threadId,
        );

      conversation.setThread(
        response.data,
      );

      session.setThreadId(
        response.data.id,
      );

      return response.data;
    },
    [conversation, session],
  );

  //--------------------------------------------------------
  // Start Conversation
  //--------------------------------------------------------

  const startConversation =
    useCallback(
      async (
        request: StartConversationRequest,
      ) => {
        const response =
          await conversationClient.startConversation(
            request,
          );

        conversation.setThread(
          response.data,
        );

        session.setThreadId(
          response.data.id,
        );

        return response.data;
      },
      [session, conversation],
    );

  //--------------------------------------------------------
  // Send Message
  //--------------------------------------------------------

  const sendMessage =
    useCallback(
      async (
        content: string,
      ) => {
        if (!session.threadId) {
          throw new Error(
            "No active conversation.",
          );
        }

        await conversationClient.sendMessage(
          {
            threadId:
              session.threadId,
            senderRole: session.role,
            content,
            conversationKey:
              session.conversationKey,
          },
        );
      },
      [session],
    );

  //--------------------------------------------------------
  // Clear
  //--------------------------------------------------------

  const clear =
    useCallback(() => {
      conversation.clear();
      session.reset();
    }, [
      conversation,
      session,
    ]);

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------

  return {
    thread,
    messages,

    loadThread,
    startConversation,
    sendMessage,
    clear,
  };
}