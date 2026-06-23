import { cn } from "@/lib/utils";
import { getLevelColor } from "@/lib/utils";
import type { CEFRLevel } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300",
    success: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
    warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
    danger: "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400",
    info: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function LevelBadge({ level, size = "sm" }: { level: CEFRLevel; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full",
        getLevelColor(level),
        sizes[size]
      )}
    >
      {level}
    </span>
  );
}
