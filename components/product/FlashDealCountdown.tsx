"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashDealCountdownProps {
  endTime: Date;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

export default function FlashDealCountdown({
  endTime,
  className,
  variant = "default",
}: FlashDealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.isExpired) {
    return (
      <div className={cn("text-red-500 font-bold text-sm", className)}>
        Deal Expired
      </div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-red-500 to-red-600 text-white font-black text-lg md:text-xl px-2 py-1 rounded-lg min-w-[40px] text-center shadow-lg"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 text-red-500 font-bold text-sm",
          className,
        )}
      >
        <Clock className="w-4 h-4" />
        <span>
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full font-bold text-xs",
          className,
        )}
      >
        <Zap className="w-3 h-3 fill-current" />
        Ends in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </motion.div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-1 text-red-500 font-bold text-xs mb-2">
        <Zap className="w-4 h-4 fill-current animate-pulse" />
        FLASH DEAL ENDS IN
      </div>
      <div className="flex items-center gap-2">
        <TimeBlock value={timeLeft.hours} label="hrs" />
        <span className="text-2xl font-black text-red-500 -mt-4">:</span>
        <TimeBlock value={timeLeft.minutes} label="min" />
        <span className="text-2xl font-black text-red-500 -mt-4">:</span>
        <TimeBlock value={timeLeft.seconds} label="sec" />
      </div>
    </div>
  );
}
