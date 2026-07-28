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

  const session = useChatSession();
  const { presence } = chatStores;

  //--------------------------------------------------------
  // Connect
  //--------------------------------------------------------
  const connect =
    useCallback(async () => {
      if (!session.threadId) {
        return;
      }

      await presenceClient.connect({
        threadId:
          session.threadId,

        clientId:
          session.clientId,

        role:
          session.role,
      });
    }, [session]);

  //--------------------------------------------------------
  // Disconnect
  //--------------------------------------------------------

  const disconnect =
    useCallback(async () => {
      if (!session.threadId) {
        return;
      }

      await presenceClient.disconnect({
        threadId:
          session.threadId,

        clientId:
          session.clientId,
      });

      presence.disconnect(
        session.clientId,
      );
    }, [session]);

  //--------------------------------------------------------
  // Heartbeat
  //--------------------------------------------------------

  useEffect(() => {
    if (!session.threadId) {
      return;
    }

    const id =
      setInterval(() => {
        presenceClient
          .heartbeat({
            threadId:
              session.threadId!,
            clientId:
              session.clientId,
          })
          .catch(
            console.error,
          );
      }, HEARTBEAT_INTERVAL);

    return () =>
      clearInterval(id);
  }, [session]);

  //--------------------------------------------------------
  // Lifecycle
  //--------------------------------------------------------

  useEffect(() => {
    if (!session.threadId) {
      return;
    }

    connect();

    return () => {
      disconnect().catch(
        console.error,
      );
    };
  }, [
    session.threadId,
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
  };
}