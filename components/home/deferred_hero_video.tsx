"use client";

import { useEffect, useState } from "react";

export default function DeferredHeroVideo() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || connection?.saveData) return;

    let timer: number | undefined;
    const loadAfterCriticalContent = () => {
      timer = window.setTimeout(() => setShouldLoad(true), 1500);
    };

    if (document.readyState === "complete") {
      loadAfterCriticalContent();
    } else {
      window.addEventListener("load", loadAfterCriticalContent, { once: true });
    }

    return () => {
      window.removeEventListener("load", loadAfterCriticalContent);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src="/vids/bg-vid.webm" type="video/webm" />
      <source src="/vids/bg-vid.mp4" type="video/mp4" />
    </video>
  );
}
