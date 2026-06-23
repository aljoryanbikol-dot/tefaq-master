import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, hint, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 px-4 py-2.5 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
            icon && "pl-10",
            error && "border-danger-500 focus:ring-danger-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-danger-600 dark:text-danger-400">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">{hint}</p>
      )}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wordCount?: number;
  maxWords?: number;
}

export function Textarea({ label, error, hint, wordCount, maxWords, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 px-4 py-3 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none",
          error && "border-danger-500 focus:ring-danger-500",
          className
        )}
        {...props}
      />
      <div className="flex justify-between mt-1.5">
        {error ? (
          <p className="text-xs font-medium text-danger-600 dark:text-danger-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-surface-500 dark:text-surface-400">{hint}</p>
        ) : (
          <span />
        )}
        {wordCount !== undefined && (
          <span
            className={cn(
              "text-xs font-medium",
              maxWords && wordCount > maxWords
                ? "text-danger-500"
                : "text-surface-400"
            )}
          >
            {wordCount} {maxWords ? `/ ${maxWords}` : ""} mots
          </span>
        )}
      </div>
    </div>
  );
}
