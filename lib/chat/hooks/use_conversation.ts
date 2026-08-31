"use client";

import {
  useCallback,
  useRef,
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
import { toast } from "sonner";

import { chatStores } from "../stores";
import { useVisibilityPoll } from "./use_visibility_poll";

export function useConversation() {
  const {
    threadId,
    conversationKey,
    role,
    setThreadId,
    setConversationKey,
    reset,
  } = useChatSession();
  const loadRequestRef = useRef(0);

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

  const syncThread = useCallback(async () => {
    if (!threadId || conversation.getThread()?.id !== threadId) {
      return;
    }

    const response = await conversationClient.getThread(
      threadId,
      conversationKey,
    );

    if (
      response.data &&
      conversation.getThread()?.id === threadId
    ) {
      conversation.mergeThread(response.data);
    }
  }, [conversation, conversationKey, threadId]);

  useVisibilityPoll(syncThread, {
    enabled: Boolean(threadId),
    intervalMs: 5000,
  });

  //--------------------------------------------------------
  // Load Thread
  //--------------------------------------------------------
  const loadThread = useCallback(
    async (threadId: string) => {
      if (!threadId) {
        conversation.clear();
        setThreadId("");
        return null;
      }

      const requestId = ++loadRequestRef.current;

      const response =
        await conversationClient.getThread(
          threadId,
          conversationKey,
        );

      if (requestId !== loadRequestRef.current) return null;

      if (!response.data) {
        conversation.clear();
        setThreadId(undefined);
        return null;
      }

      conversation.setThread(
        response.data,
      );

      setThreadId(
        response.data.id,
      );

      return response.data;
    },
    [conversation, conversationKey, setThreadId],
  );

  const setExistingThread = useCallback((existingThread: NonNullable<typeof thread>) => {
    conversation.setThread(existingThread);
    setThreadId(existingThread.id);
  }, [conversation, setThreadId]);

  //--------------------------------------------------------
  // Start Conversation
  //--------------------------------------------------------

  const startConversation =
    useCallback(
      async (
        request: StartConversationRequest,
      ) => {
        const storageKey =
          `kubuka:conversation-key:${request.email.trim().toLowerCase()}`;
        let conversationKey =
          window.localStorage.getItem(storageKey);

        if (!conversationKey) {
          conversationKey = crypto.randomUUID();
          window.localStorage.setItem(
            storageKey,
            conversationKey,
          );
        }

        let response;
        try {
          response =
            await conversationClient.startConversation(
              {
                ...request,
                conversationKey,
              },
            );
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to start the conversation.",
          );
          throw error;
        }

        conversation.setThread(
          response.data,
        );

        setConversationKey(conversationKey);
        setThreadId(
          response.data.id,
        );

        toast.success("Message sent.");

        return response.data;
      },
      [conversation, setConversationKey, setThreadId],
    );

  //--------------------------------------------------------
  // Send Message
  //--------------------------------------------------------

  const sendMessage =
    useCallback(
      async (
        content: string,
      ) => {
        if (!threadId) {
          throw new Error(
            "No active conversation.",
          );
        }

        try {
          const response = await conversationClient.sendMessage(
            {
              threadId:
                threadId,
              senderRole: role,
              content,
              conversationKey,
            },
          );

          // Render from the acknowledged server response immediately. The
          // SSE event is still useful for the other participant, but must not
          // be the only way this client sees its own message.
          if (response.data) {
            conversation.appendMessage(response.data);
          }

          toast.success("Message sent.");
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to send the message.",
          );
          throw error;
        }
      },
      [conversation, conversationKey, role, threadId],
    );

  //--------------------------------------------------------
  // Clear
  //--------------------------------------------------------

  const clear =
    useCallback(() => {
      conversation.clear();
      reset();
    }, [
      conversation,
      reset,
    ]);

  const deleteConversation = useCallback(async () => {
    if (!threadId) {
      return;
    }

    try {
      await conversationClient.delete({
        threadId,
      });
      toast.success("Conversation deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the conversation.",
      );
      throw error;
    }

    conversation.clear();
    reset();
  }, [conversation, reset, threadId]);

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------

  return {
    thread,
    messages,

    loadThread,
    setExistingThread,
    startConversation,
    sendMessage,
    clear,
    deleteConversation,
  };
}
