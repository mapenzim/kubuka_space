"use client";

import { useEffect, useState } from "react";

const RELATIVE_TIME_REFRESH_MS = 60_000;

export function useRelativeTimeClock() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(
      () => setNow(Date.now()),
      RELATIVE_TIME_REFRESH_MS,
    );

    return () => window.clearInterval(timer);
  }, []);

  return now;
}
