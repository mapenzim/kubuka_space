"use client";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string; // e.g., "2025-12-31T23:59:59"
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="text-2xl font-semibold text-green-600">🎉 Time to load the website</div>;
  }

  return (
    <div className="flex gap-4 text-center text-2xl font-mono">
      <TimeBox label="Days" value={timeLeft.days} />
      <TimeBox label="Hours" value={timeLeft.hours} />
      <TimeBox label="Minutes" value={timeLeft.minutes} />
      <TimeBox label="Seconds" value={timeLeft.seconds} />
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-gray-800 text-white p-4 rounded-2xl w-24 shadow-md">
      <span className="text-3xl font-bold">{String(value).padStart(2, "0")}</span>
      <span className="text-sm opacity-75">{label}</span>
    </div>
  );
}
