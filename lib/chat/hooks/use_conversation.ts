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
import {
  clearGuestChatSession,
  getGuestChatSession,
  saveGuestChatSession,
} from "@/lib/chat/client/guest_session";

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
      conversation.getThread()?.id === threadId
    ) {
      if (!response.data) {
        conversation.clear();
        reset();

        if (role === "user") {
          clearGuestChatSession();
          toast.info("This support conversation is no longer active.");
        }
        return;
      }

      conversation.mergeThread(response.data);
    }
  }, [conversation, conversationKey, reset, role, threadId]);

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
        if (role === "user") clearGuestChatSession();
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
    [conversation, conversationKey, role, setThreadId],
  );

  const setExistingThread = useCallback((existingThread: NonNullable<typeof thread>) => {
    conversation.setThread(existingThread);
    setThreadId(existingThread.id);
  }, [conversation, setThreadId]);

  const restoreConversation = useCallback(async (
    restoredThreadId: string,
    restoredConversationKey: string,
  ) => {
    try {
      const response = await conversationClient.getThread(
        restoredThreadId,
        restoredConversationKey,
      );
      if (!response.data) {
        clearGuestChatSession();
        conversation.clear();
        reset();
        return null;
      }
      conversation.setThread(response.data);
      setConversationKey(restoredConversationKey);
      setThreadId(response.data.id);
      return response.data;
    } catch (error) {
      clearGuestChatSession();
      throw error;
    }
  }, [conversation, reset, setConversationKey, setThreadId]);

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

        if (role === "user") {
          saveGuestChatSession({
            threadId: response.data.id,
            conversationKey,
          });
        }

        toast.success("Message sent.");

        return response.data;
      },
      [conversation, role, setConversationKey, setThreadId],
    );

  //--------------------------------------------------------
  // Send Message
  //--------------------------------------------------------

  const sendMessage =
    useCallback(
      async (
        content: string,
      ) => {
      const visibleThread = conversation.getThread();
      const storedGuestSession = role === "user" ? getGuestChatSession() : null;
      const legacyConversationKey = role === "user" && visibleThread?.email
        ? window.localStorage.getItem(`kubuka:conversation-key:${visibleThread.email.trim().toLowerCase()}`) ?? undefined
        : undefined;
      const activeThreadId = threadId ?? visibleThread?.id ?? storedGuestSession?.threadId;
      const activeConversationKey = conversationKey ?? (
        storedGuestSession && storedGuestSession.threadId === activeThreadId
          ? storedGuestSession.conversationKey
          : legacyConversationKey
      );

      if (!activeThreadId) {
        throw new Error(
          "No active conversation.",
        );
      }

      if (activeThreadId !== threadId) setThreadId(activeThreadId);
      if (activeConversationKey && activeConversationKey !== conversationKey) {
        setConversationKey(activeConversationKey);
      }
      if (role === "user" && activeConversationKey) {
        saveGuestChatSession({ threadId: activeThreadId, conversationKey: activeConversationKey });
      }

      try {
        const response = await conversationClient.sendMessage(
          {
              threadId: activeThreadId,
              senderRole: role,
              content,
              conversationKey: activeConversationKey,
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
      [conversation, conversationKey, role, setConversationKey, setThreadId, threadId],
    );

  //--------------------------------------------------------
  // Clear
  //--------------------------------------------------------

  const clear =
    useCallback(() => {
      conversation.clear();
      reset();
      if (role === "user") clearGuestChatSession();
    }, [
      conversation,
      reset,
      role,
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
    if (role === "user") clearGuestChatSession();
  }, [conversation, reset, role, threadId]);

  const archiveConversation = useCallback(async () => {
    if (!threadId) {
      return;
    }

    try {
      await conversationClient.archive({ threadId });
      toast.success("Conversation archived.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to archive the conversation.",
      );
      throw error;
    }

    conversation.clear();
    reset();
    if (role === "user") clearGuestChatSession();
  }, [conversation, reset, role, threadId]);

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------

  return {
    thread,
    messages,

    loadThread,
    setExistingThread,
    restoreConversation,
    startConversation,
    sendMessage,
    clear,
    archiveConversation,
    deleteConversation,
  };
}
