"use client";

import { useEffect, useRef, useState } from "react";
import Fading from "../fade";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full min-h-screen"
    >
      {/** Background */}
      <div className="absolute w-full overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-screen object-cover"
          autoPlay={loadVideo}
          muted
          loop
          playsInline
          preload="none"
          poster="/images/hero.jpg" // 🔥 add this image
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
      <div className="absolute flex flex-col w-full max-w-2xl h-full mx-auto mt-64">
        <Fading delay={0.7} direction="down" fullWidth={null} padding={null}>
          <div className="inline-block items-center space-y-5 sm:px-4 justify-center text-slate-400">
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