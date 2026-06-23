import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, gradient, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-card dark:shadow-card-dark",
        hover &&
          "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        gradient &&
          "bg-gradient-to-br from-white to-surface-50 dark:from-surface-800 dark:to-surface-900",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 border-b border-surface-100 dark:border-surface-700", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 border-t border-surface-100 dark:border-surface-700", className)}>{children}</div>;
}
