"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
  className?: string;
}

export default function VoiceSearch({ onResult, className }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);

      if (event.results[current].isFinal) {
        onResult(result);
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={cn("relative", className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startListening}
        disabled={isListening}
        style={
          !isListening
            ? {
                backgroundColor: isDark ? "#27272a" : "#f3f4f6",
                color: isDark ? "#d4d4d8" : "#4b5563",
              }
            : undefined
        }
        className={cn(
          "p-2.5 rounded-full transition-all",
          isListening && "bg-red-500 text-white animate-pulse",
        )}
      >
        <Mic className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isListening && mounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              backgroundColor: resolvedTheme === "dark" ? "#18181b" : "#ffffff",
              borderColor: resolvedTheme === "dark" ? "#3f3f46" : "#d1d5db",
              color: resolvedTheme === "dark" ? "#ffffff" : "#111827",
            }}
            className="absolute top-full mt-2 right-0 border-2 rounded-xl p-4 shadow-2xl min-w-[220px] z-[100]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-red-500 rounded-full relative" />
              </div>
              <span className="text-sm font-medium">Listening...</span>
            </div>
            {transcript && (
              <p className="text-sm opacity-70 italic">"{transcript}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
