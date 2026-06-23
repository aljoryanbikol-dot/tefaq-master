"use client";
import { useState } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { LevelBadge } from "@/components/ui/Badge";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAuthStore } from "@/lib/store";
import { TrendingUp, Calendar, BookOpen, Headphones, Mic, PenLine, Flame, Trophy, Zap } from "lucide-react";
import type { ModuleType } from "@/types";

const MODULE_ICONS: Record<ModuleType, React.ReactNode> = {
  reading: <BookOpen size={16} />,
  listening: <Headphones size={16} />,
  speaking: <Mic size={16} />,
  writing: <PenLine size={16} />,
};

const MODULE_COLORS: Record<ModuleType, string> = {
  reading: "from-blue-500 to-cyan-400",
  listening: "from-purple-500 to-pink-400",
  speaking: "from-orange-500 to-red-400",
  writing: "from-green-500 to-teal-400",
};

const MODULE_LABELS: Record<ModuleType, string> = {
  reading: "Compréhension écrite",
  listening: "Compréhension orale",
  speaking: "Expression orale",
  writing: "Expression écrite",
};

// Mock data
const WEEKLY_DATA = [
  { day: "Lun", reading: 75, listening: 60, speaking: 80, writing: 65 },
  { day: "Mar", reading: 78, listening: 65, speaking: 82, writing: 70 },
  { day: "Mer", reading: 72, listening: 58, speaking: 79, writing: 68 },
  { day: "Jeu", reading: 80, listening: 68, speaking: 85, writing: 72 },
  { day: "Ven", reading: 76, listening: 62, speaking: 81, writing: 69 },
  { day: "Sam", reading: 0, listening: 0, speaking: 0, writing: 0 },
  { day: "Dim", reading: 82, listening: 70, speaking: 84, writing: 73 },
];

const HISTORY = [
  { date: "15 juin 2024", module: "reading" as ModuleType, exercise: "La vie quotidienne à Montréal", score: 75, level: "A2" as const, xp: 38 },
  { date: "14 juin 2024", module: "writing" as ModuleType, exercise: "Invitation à une fête d'anniversaire", score: 68, level: "A2" as const, xp: 34 },
  { date: "14 juin 2024", module: "listening" as ModuleType, exercise: "Se présenter et parler de sa famille", score: 100, level: "A1" as const, xp: 50 },
  { date: "13 juin 2024", module: "speaking" as ModuleType, exercise: "Ma routine quotidienne", score: 72, level: "A2" as const, xp: 36 },
  { date: "12 juin 2024", module: "reading" as ModuleType, exercise: "L'immigration au Québec", score: 50, level: "B1" as const, xp: 25 },
  { date: "11 juin 2024", module: "writing" as ModuleType, exercise: "Compte-rendu d'événement culturel", score: 62, level: "B1" as const, xp: 31 },
];

const MODULE_SCORES = { reading: 74, listening: 61, speaking: 82, writing: 68 };

export default function ProgressPage() {
  const { user } = useAuthStore();
  const [view, setView] = useState<"week" | "month">("week");

  const overallScore = Math.round(Object.values(MODULE_SCORES).reduce((a, b) => a + b, 0) / 4);
  const maxBar = Math.max(...WEEKLY_DATA.map((d) => Math.max(d.reading, d.listening, d.speaking, d.writing)));

  return (
    <AppLayout title="Ma progression">
      <div className="space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">Ma progression</h2>
          <p className="text-surface-500 dark:text-surface-400 text-sm">Suivez votre évolution dans chaque compétence</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Trophy size={20} className="text-warning-500" />, label: "Score global", value: `${overallScore}/100`, bg: "bg-warning-50 dark:bg-warning-950/30" },
            { icon: <Flame size={20} className="text-accent-500" />, label: "Série actuelle", value: `${user?.streak_days || 0} jours`, bg: "bg-accent-50 dark:bg-accent-950/30" },
            { icon: <Zap size={20} className="text-primary-500" />, label: "XP total", value: (user?.total_xp || 1240).toLocaleString(), bg: "bg-primary-50 dark:bg-primary-950/30" },
            { icon: <Calendar size={20} className="text-success-500" />, label: "Exercices complétés", value: "47", bg: "bg-success-50 dark:bg-success-950/30" },
          ].map((s) => (
            <Card key={s.label}>
              <CardBody className="p-4">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>{s.icon}</div>
                <div className="font-display font-bold text-xl text-surface-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-surface-500 mt-0.5">{s.label}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Module scores */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-500" /> Scores par compétence
              </h3>
              <LevelBadge level={user?.current_level || "B1"} size="md" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {(Object.entries(MODULE_SCORES) as [ModuleType, number][]).map(([mod, score]) => (
                <div key={mod} className="text-center">
                  <ScoreCircle score={score} size="md" label={mod === "reading" ? "Écrite" : mod === "listening" ? "Orale" : mod === "speaking" ? "Expression" : "Rédaction"} className="mx-auto mb-2" />
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gradient-to-r ${MODULE_COLORS[mod]} text-white font-semibold`}>
                    {MODULE_ICONS[mod]}
                    {score >= 70 ? "✓ Fort" : score >= 50 ? "~ Moyen" : "✗ Faible"}
                  </div>
                </div>
              ))}
            </div>

            {/* Score bars */}
            <div className="mt-6 space-y-3">
              {(Object.entries(MODULE_SCORES) as [ModuleType, number][]).map(([mod, score]) => (
                <div key={mod} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${MODULE_COLORS[mod]} flex items-center justify-center text-white flex-shrink-0`}>
                    {MODULE_ICONS[mod]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-700 dark:text-surface-300 font-medium">{MODULE_LABELS[mod]}</span>
                      <span className="font-bold text-surface-900 dark:text-white">{score}/100</span>
                    </div>
                    <ProgressBar value={score} color={score >= 70 ? "success" : score >= 50 ? "warning" : "danger"} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Weekly performance chart */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-surface-900 dark:text-white">Performance par semaine</h3>
              <div className="flex gap-2">
                {(["week", "month"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v ? "bg-primary-600 text-white" : "bg-surface-100 dark:bg-surface-800 text-surface-500"}`}>
                    {v === "week" ? "Semaine" : "Mois"}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-32">
              {WEEKLY_DATA.map((d) => {
                const avg = d.reading === 0 ? 0 : Math.round((d.reading + d.listening + d.speaking + d.writing) / 4);
                const h = avg === 0 ? 4 : (avg / 100) * 100;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="text-xs text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">{avg}%</div>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all relative"
                      style={{ height: `${h}%`, opacity: avg === 0 ? 0.2 : 1 }}
                    />
                    <span className="text-xs text-surface-400 font-medium">{d.day}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-surface-100 dark:border-surface-700">
              {(Object.entries(MODULE_COLORS) as [ModuleType, string][]).map(([mod, color]) => (
                <div key={mod} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
                  <span className="text-xs text-surface-500">{MODULE_LABELS[mod].split(" ")[1]}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* CEFR journey */}
        <Card>
          <CardBody className="p-6">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-5">Progression vers {user?.target_level}</h3>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                {(["A1", "A2", "B1", "B2", "C1"] as const).map((l, i) => {
                  const levels = ["A1", "A2", "B1", "B2", "C1"];
                  const currentIdx = levels.indexOf(user?.current_level || "B1");
                  const targetIdx = levels.indexOf(user?.target_level || "B2");
                  const isReached = i <= currentIdx;
                  const isTarget = i === targetIdx;
                  return (
                    <div key={l} className="flex flex-col items-center gap-2 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isTarget ? "bg-accent-500 text-white ring-4 ring-accent-200 dark:ring-accent-900" : isReached ? "bg-primary-600 text-white" : "bg-surface-200 dark:bg-surface-700 text-surface-400"}`}>
                        {l}
                      </div>
                      {isReached && i < levels.indexOf("C1") && (
                        <div className="h-0.5 w-full bg-primary-500" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all" style={{ width: `${(["A1", "A2", "B1", "B2", "C1"].indexOf(user?.current_level || "B1") / 4) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-surface-400 mt-1">
                <span>Débutant</span>
                <span>Avancé</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Exercise history */}
        <Card>
          <CardBody className="p-6">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Historique des exercices</h3>
            <div className="space-y-3">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${MODULE_COLORS[h.module]} flex items-center justify-center text-white flex-shrink-0`}>
                    {MODULE_ICONS[h.module]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 dark:text-white text-sm truncate">{h.exercise}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-surface-400">{h.date}</span>
                      <LevelBadge level={h.level} size="sm" />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-bold ${h.score >= 70 ? "text-success-600" : h.score >= 50 ? "text-warning-600" : "text-danger-600"}`}>
                      {h.score}%
                    </div>
                    <div className="text-xs text-primary-500 font-semibold">+{h.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
