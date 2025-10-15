"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string; // e.g., "2025-12-31T23:59:59"
}

function getDaysInAMonth(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    const date = Date.now().toPrecision(6);

    if (difference <= 0) return null;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <motion.div
        className="text-4xl font-bold text-green-400 mt-8"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🎉 Time to load the website!
      </motion.div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8" suppressHydrationWarning={true}>
      <GlowingCircle label="Days" value={timeLeft.days} max={365} color="from-blue-500 to-cyan-400" />
      <GlowingCircle label="Hours" value={timeLeft.hours} max={24} color="from-purple-500 to-pink-400" />
      <GlowingCircle label="Minutes" value={timeLeft.minutes} max={60} color="from-green-500 to-lime-400" />
      <GlowingCircle label="Seconds" value={timeLeft.seconds} max={60} color="from-yellow-500 to-orange-400" />
    </div>
  );
}

function GlowingCircle({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Animated rotating gradient ring */}
      <motion.div
        className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr ${color} blur-lg opacity-60`}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Static circular outline */}
      <div className="relative w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center bg-gray-900 shadow-inner overflow-hidden">
        {/* Animated number */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-white"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>

        {/* Glow progress arc */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${color} opacity-40`}
          style={{
            clipPath: `inset(${100 - percentage}% 0 0 0)`,
          }}
        />
      </div>

      <span className="mt-3 text-gray-400 text-sm uppercase tracking-widest">{label}</span>
    </div>
  );
}
