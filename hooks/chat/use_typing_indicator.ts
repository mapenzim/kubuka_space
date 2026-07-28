"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

interface UseTypingIndicatorOptions {
  startTyping: () => void;
  stopTyping: () => void;

  /**
   * How often to refresh "typing"
   */
  throttleMs?: number;

  /**
   * How long after the last keypress
   * before becoming idle.
   */
  idleMs?: number;
}

export function useTypingIndicator({
  startTyping,
  stopTyping,
  throttleMs = 1000,
  idleMs = 1500,
}: UseTypingIndicatorOptions) {
  //--------------------------------------------------------
  // Refs
  //--------------------------------------------------------
  const lastTypingRef = useRef(0);
  const typingRef = useRef(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(
      null,
    );

  //--------------------------------------------------------
  // Input Handler
  //--------------------------------------------------------
  const onInput =
    useCallback(() => {
      const now = Date.now();
      //----------------------------------------------------
      // Throttle typing updates
      //----------------------------------------------------
      if (
        now -
          lastTypingRef.current >= throttleMs
      ) {
        lastTypingRef.current = now;
        startTyping();
        typingRef.current = true;
      }

      //----------------------------------------------------
      // Reset idle timer
      //----------------------------------------------------
      if (idleTimerRef.current) {
        clearTimeout(
          idleTimerRef.current,
        );
      }

      idleTimerRef.current =
        setTimeout(() => {
          if (typingRef.current) {
            stopTyping();
            typingRef.current = false;
          }
        }, idleMs);
    }, [
      startTyping,
      stopTyping,
      throttleMs,
      idleMs,
    ]);

  const forceIdle = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (typingRef.current) {
      stopTyping();
      typingRef.current = false;
    }

    lastTypingRef.current = 0;
  }, [stopTyping]);

  //--------------------------------------------------------
  // Cleanup
  //--------------------------------------------------------
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(
          idleTimerRef.current,
        );
      }

      stopTyping();
    };
  }, [stopTyping]);

  useEffect(() => {
    return () => {
      forceIdle();
    };
  }, [forceIdle]);

  //--------------------------------------------------------
  // Public API
  //--------------------------------------------------------
  return {
    onInput,
    forceIdle
  };
}