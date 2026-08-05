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
import { toast } from "sonner";

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

      if (!response.data) {
        conversation.clear();
        if (session.threadId === threadId) {
          session.setThreadId(undefined);
        }
        return null;
      }

      if (session.threadId !== threadId) {
        return null;
      }

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

  const setExistingThread = useCallback((existingThread: NonNullable<typeof thread>) => {
    conversation.setThread(existingThread);
    session.setThreadId(existingThread.id);
  }, [conversation, session]);

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

        session.setThreadId(
          response.data.id,
        );

        toast.success("Message sent.");

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

        try {
          const response = await conversationClient.sendMessage(
            {
              threadId:
                session.threadId,
              senderRole: session.role,
              content,
              conversationKey:
                session.conversationKey,
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
      [conversation, session],
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

  const deleteConversation = useCallback(async () => {
    if (!session.threadId) {
      return;
    }

    try {
      await conversationClient.delete({
        threadId: session.threadId,
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
    session.reset();
  }, [conversation, session]);

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
