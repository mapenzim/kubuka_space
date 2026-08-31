"use client";

import { useEffect, useRef } from "react";

interface VisibilityPollOptions {
  enabled?: boolean;
  intervalMs?: number;
  runImmediately?: boolean;
}

export function useVisibilityPoll(
  poll: () => Promise<void>,
  {
    enabled = true,
    intervalMs = 5000,
    runImmediately = false,
  }: VisibilityPollOptions = {},
) {
  const pollRef = useRef(poll);

  useEffect(() => {
    pollRef.current = poll;
  }, [poll]);

  useEffect(() => {
    if (!enabled) return;

    let disposed = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delay = intervalMs) => {
      if (disposed) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, delay);
    };

    const run = async () => {
      if (disposed || inFlight) return;

      if (document.visibilityState === "hidden") {
        schedule();
        return;
      }

      inFlight = true;
      try {
        await pollRef.current();
      } catch (error) {
        console.error("[chat sync]", error);
      } finally {
        inFlight = false;
        schedule();
      }
    };

    const refresh = () => {
      if (document.visibilityState === "visible") {
        void run();
      }
    };

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    schedule(runImmediately ? 0 : intervalMs);

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [enabled, intervalMs, runImmediately]);
}
