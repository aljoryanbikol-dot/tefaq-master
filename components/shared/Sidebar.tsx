"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Headphones,
  Mic,
  PenLine,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  Crown,
  Shield,
  Flame,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { LevelBadge } from "@/components/ui/Badge";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/reading", label: "Compréhension écrite", icon: BookOpen },
  { href: "/listening", label: "Compréhension orale", icon: Headphones },
  { href: "/speaking", label: "Expression orale", icon: Mic },
  { href: "/writing", label: "Expression écrite", icon: PenLine },
  { href: "/dashboard/progress", label: "Ma progression", icon: TrendingUp },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 z-40 transition-transform duration-300 flex flex-col",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-100 dark:border-surface-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg text-surface-900 dark:text-white block leading-none">
                TEFAQ
              </span>
              <span className="text-xs text-surface-500 dark:text-surface-400 font-medium">
                Master
              </span>
            </div>
          </Link>
        </div>

        {/* User profile mini */}
        {user && (
          <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/40 dark:to-accent-950/40 border border-primary-100 dark:border-primary-900/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 dark:text-white text-sm truncate">
                  {user.full_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <LevelBadge level={user.current_level} size="sm" />
                  {user.plan === "premium" && (
                    <Crown size={12} className="text-accent-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-primary-100 dark:border-primary-900/30">
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-accent-500" />
                <span className="text-xs font-bold text-surface-700 dark:text-surface-300">
                  {user.streak_days}j
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-primary-500">⚡</span>
                <span className="text-xs font-bold text-surface-700 dark:text-surface-300">
                  {user.total_xp} XP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-primary-600 text-white shadow-glow"
                      : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white"
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-white" : "text-surface-400 group-hover:text-primary-500"
                    )}
                  />
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={16} className="text-white/70" />}
                </Link>
              );
            })}
          </div>

          {/* Admin link */}
          {user?.plan === "premium" && (
            <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
              <Link
                href="/admin"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  pathname.startsWith("/admin")
                    ? "bg-primary-600 text-white shadow-glow"
                    : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                )}
              >
                <Shield size={20} className="flex-shrink-0 text-surface-400 group-hover:text-primary-500" />
                <span className="font-medium text-sm">Administration</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-surface-100 dark:border-surface-800 space-y-1">
          {/* Premium upgrade */}
          {user?.plan === "free" && (
            <Link
              href="/dashboard?upgrade=true"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 text-white hover:opacity-90 transition-opacity"
            >
              <Crown size={18} />
              <span className="font-semibold text-sm">Passer à Premium</span>
            </Link>
          )}

          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Paramètres</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/30 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
