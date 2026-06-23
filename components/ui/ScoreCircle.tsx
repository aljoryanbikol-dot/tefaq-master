"use client";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  color?: string;
  className?: string;
}

export function ScoreCircle({ score, size = "md", label, color, className }: ScoreCircleProps) {
  const sizes = {
    sm: { outer: 60, stroke: 5, fontSize: "text-lg", labelSize: "text-xs" },
    md: { outer: 90, stroke: 7, fontSize: "text-2xl", labelSize: "text-xs" },
    lg: { outer: 120, stroke: 9, fontSize: "text-3xl", labelSize: "text-sm" },
    xl: { outer: 160, stroke: 10, fontSize: "text-5xl", labelSize: "text-base" },
  };

  const cfg = sizes[size];
  const radius = (cfg.outer - cfg.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (color) return color;
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
        <svg width={cfg.outer} height={cfg.outer} className="-rotate-90">
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={cfg.stroke}
            className="text-surface-200 dark:text-surface-700"
          />
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={cfg.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold text-surface-900 dark:text-white", cfg.fontSize)}>
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className={cn("font-medium text-surface-600 dark:text-surface-400", cfg.labelSize)}>
          {label}
        </span>
      )}
    </div>
  );
}
