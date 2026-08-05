"use client";

import { useEffect, useState } from "react";
import Fading from "../fade";

const HeroSection = () => {
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || connection?.saveData) return;

    // Let the poster and the first paint win before downloading the decorative video.
    const timer = window.setTimeout(() => setLoadVideo(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);
  
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full min-h-screen"
    >
      {/** Background */}
      <div className="absolute inset-0 overflow-hidden bg-indigo-500 dark:bg-gray-900">
        <video
          className="h-full w-full object-cover"
          autoPlay={loadVideo}
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero.jpg"
          aria-hidden="true"
        >
          {loadVideo && (
            <>
            <source src="/vids/bg-vid.webm" type="video/webm" />
            <source src="/vids/bg-vid.mp4" type="video/mp4" />
            </>
          )}
        </video>
      </div>

      {/* Content */}
      <div className="absolute flex flex-col max-w-2xl h-full mx-auto mt-64">
        <Fading delay={0.7} direction="down" fullWidth={null} padding={null}>
          <div className="inline-block items-center space-y-3 sm:px-4 justify-center text-slate-400">
            <h1 className="text-3xl md:text-[62px] text-center">
              Kubuka Space PBC
            </h1>
            <p className="md:text-xs text-[10px] text-center">
              Unlocking Hidden Potential to Accelerate Business Growth.
            </p>
          </div>
        </Fading>
      </div>
    </div>
  );
}

export { HeroSection };
