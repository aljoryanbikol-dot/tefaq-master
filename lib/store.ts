import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, PerformanceAnalytics } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

interface AppState {
  analytics: PerformanceAnalytics | null;
  setAnalytics: (analytics: PerformanceAnalytics) => void;
  dailyExercisesCompleted: number;
  incrementDailyExercises: () => void;
  resetDailyExercises: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme-storage" }
  )
);

export const useAppStore = create<AppState>()((set) => ({
  analytics: null,
  setAnalytics: (analytics) => set({ analytics }),
  dailyExercisesCompleted: 0,
  incrementDailyExercises: () =>
    set((state) => ({
      dailyExercisesCompleted: state.dailyExercisesCompleted + 1,
    })),
  resetDailyExercises: () => set({ dailyExercisesCompleted: 0 }),
}));
