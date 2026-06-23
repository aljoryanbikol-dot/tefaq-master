import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CEFRLevel, ModuleType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelColor(level: CEFRLevel): string {
  const colors: Record<CEFRLevel, string> = {
    A1: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    A2: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    B1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    B2: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    C1: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
  };
  return colors[level];
}

export function getLevelBadgeColor(level: CEFRLevel): string {
  const colors: Record<CEFRLevel, string> = {
    A1: "#ef4444",
    A2: "#f97316",
    B1: "#eab308",
    B2: "#22c55e",
    C1: "#6366f1",
  };
  return colors[level];
}

export function getModuleIcon(module: ModuleType): string {
  const icons: Record<ModuleType, string> = {
    reading: "📖",
    listening: "🎧",
    speaking: "🎤",
    writing: "✍️",
  };
  return icons[module];
}

export function getModuleColor(module: ModuleType): string {
  const colors: Record<ModuleType, string> = {
    reading: "from-blue-500 to-cyan-500",
    listening: "from-purple-500 to-pink-500",
    speaking: "from-orange-500 to-red-500",
    writing: "from-green-500 to-teal-500",
  };
  return colors[module];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Très bien";
  if (score >= 60) return "Bien";
  if (score >= 45) return "Passable";
  return "À améliorer";
}

export function scoreToLevel(score: number): CEFRLevel {
  if (score >= 85) return "C1";
  if (score >= 70) return "B2";
  if (score >= 55) return "B1";
  if (score >= 40) return "A2";
  return "A1";
}

export function calculateXP(score: number, module: ModuleType): number {
  const baseXP: Record<ModuleType, number> = {
    reading: 50,
    listening: 60,
    speaking: 100,
    writing: 80,
  };
  return Math.round(baseXP[module] * (score / 100));
}

export function getLevelDescription(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    A1: "Débutant - Expressions très simples du quotidien",
    A2: "Élémentaire - Phrases simples sur sujets familiers",
    B1: "Intermédiaire - Situations courantes en voyage et travail",
    B2: "Intermédiaire avancé - Textes complexes et discussions",
    C1: "Avancé - Langue fluide, spontanée et efficace",
  };
  return descriptions[level];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
