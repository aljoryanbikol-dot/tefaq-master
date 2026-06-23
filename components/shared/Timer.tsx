"use client";
import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";

interface TimerProps {
  seconds: number;
  onTimeUp?: () => void;
  onTick?: (remaining: number) => void;
  className?: string;
  paused?: boolean;
}

export function CountdownTimer({ seconds, onTimeUp, onTick, className, paused }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          onTimeUp?.();
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, onTimeUp, onTick, remaining]);

  const percentage = (remaining / seconds) * 100;
  const isWarning = remaining <= seconds * 0.2;
  const isDanger = remaining <= 60;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm",
        isDanger
          ? "bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400"
          : isWarning
          ? "bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400"
          : "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
        className
      )}
    >
      <Clock size={15} className={isDanger ? "animate-pulse" : ""} />
      {formatDuration(remaining)}
    </div>
  );
}

export function StopwatchTimer({ onTick, paused, className }: {
  onTick?: (elapsed: number) => void;
  paused?: boolean;
  className?: string;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, onTick]);

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 font-mono font-bold text-sm text-surface-700 dark:text-surface-300", className)}>
      <Clock size={15} />
      {formatDuration(elapsed)}
    </div>
  );
}
