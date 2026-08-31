"use client";

import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

import {
  presenceClient,
} from "@/lib/chat/client";

import {
  useChatSession,
} from "@/lib/chat/session";

import { chatStores } from "../stores";

const HEARTBEAT_INTERVAL =
  30_000;

export function usePresence() {
  //--------------------------------------------------------
  // 
  //--------------------------------------------------------

  const {
    threadId,
    clientId,
    role,
    conversationKey,
  } = useChatSession();
  const { presence } = chatStores;
  const snapshot = useSyncExternalStore(
    presence.subscribe,
    presence.snapshot,
    presence.snapshot,
  );
  //--------------------------------------------------------
  // Connect
  //--------------------------------------------------------
  const connect =
    useCallback(async () => {
      if (!threadId) {
        return;
      }

      await presenceClient.connect({
        threadId:
          threadId,

        clientId:
          clientId,

        role:
          role,
        conversationKey,
      });
    }, [threadId, clientId, role, conversationKey]);

  //--------------------------------------------------------
  // Disconnect
  //--------------------------------------------------------

  const disconnect =
    useCallback(async () => {
      if (!threadId) {
        return;
      }

      await presenceClient.disconnect({
        threadId:
          threadId,

        clientId:
          clientId,
        conversationKey,
      });

      presence.disconnect(
        clientId,
      );
    }, [threadId, clientId, conversationKey, presence]);

  //--------------------------------------------------------
  // Heartbeat
  //--------------------------------------------------------

  useEffect(() => {
    if (!threadId) {
      return;
    }

    const id =
      setInterval(() => {
        presenceClient
          .heartbeat({
            threadId:
                threadId,
            clientId:
                clientId,
            conversationKey,
          })
          .catch(
            console.error,
          );
      }, HEARTBEAT_INTERVAL);

    return () =>
      clearInterval(id);
  }, [threadId, clientId, conversationKey]);

  //--------------------------------------------------------
  // Lifecycle
  //--------------------------------------------------------

  useEffect(() => {
    if (!threadId) {
      return;
    }

    connect();

    return () => {
      disconnect().catch(
        console.error,
      );
    };
  }, [
    threadId,
    connect,
    disconnect,
  ]);

  //--------------------------------------------------------
  // API
  //--------------------------------------------------------

  return {
    connect,
    disconnect,

    isOnline(
      clientId: string,
    ) {
      return presence.isOnline(
        clientId,
      );
    },

    getParticipantByRole(role: "admin" | "user") {
      return snapshot.participants.find(
        (participant) =>
          participant.threadId === threadId &&
          participant.role === role,
      );
    },
  };
}
