export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ModuleType = "reading" | "listening" | "speaking" | "writing";

export type PlanType = "free" | "premium";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  plan: PlanType;
  current_level: CEFRLevel;
  target_level: CEFRLevel;
  daily_goal: number;
  created_at: string;
  streak_days: number;
  total_xp: number;
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface ReadingExercise {
  id: string;
  title: string;
  level: CEFRLevel;
  text: string;
  questions: ExerciseQuestion[];
  time_limit?: number;
  topic: string;
  created_at: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  level: CEFRLevel;
  audio_url: string;
  transcript?: string;
  questions: ExerciseQuestion[];
  duration: number;
  topic: string;
  created_at: string;
}

export interface SpeakingPrompt {
  id: string;
  level: CEFRLevel;
  prompt: string;
  duration: number;
  topic: string;
  example_response?: string;
  created_at: string;
}

export interface WritingPrompt {
  id: string;
  level: CEFRLevel;
  prompt: string;
  word_count_min: number;
  word_count_max: number;
  topic: string;
  example_response?: string;
  created_at: string;
}

export interface SpeakingEvaluation {
  overall_score: number;
  cefr_level: CEFRLevel;
  pronunciation_score: number;
  fluency_score: number;
  grammar_score: number;
  vocabulary_score: number;
  coherence_score: number;
  transcript: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface WritingEvaluation {
  overall_score: number;
  cefr_level: CEFRLevel;
  grammar_score: number;
  vocabulary_score: number;
  coherence_score: number;
  task_achievement_score: number;
  feedback: string;
  grammar_corrections: GrammarCorrection[];
  vocabulary_suggestions: VocabularySuggestion[];
  strengths: string[];
  weaknesses: string[];
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularySuggestion {
  original: string;
  better_alternatives: string[];
  context: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module: ModuleType;
  exercise_id: string;
  score: number;
  cefr_level: CEFRLevel;
  completed_at: string;
  time_spent: number;
  details: Record<string, unknown>;
}

export interface PerformanceAnalytics {
  overall_level: CEFRLevel;
  overall_score: number;
  reading_score: number;
  listening_score: number;
  speaking_score: number;
  writing_score: number;
  exercises_completed: number;
  streak_days: number;
  total_xp: number;
  weekly_progress: WeeklyProgress[];
  level_history: LevelHistory[];
}

export interface WeeklyProgress {
  date: string;
  score: number;
  exercises: number;
  xp: number;
}

export interface LevelHistory {
  date: string;
  level: CEFRLevel;
  module: ModuleType;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  premium_users: number;
  exercises_completed: number;
  avg_session_duration: number;
  revenue: number;
  top_modules: { module: string; count: number }[];
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export interface StudyRecommendation {
  module: ModuleType;
  reason: string;
  exercise_id?: string;
  priority: "high" | "medium" | "low";
}
