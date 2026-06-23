"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LevelBadge } from "@/components/ui/Badge";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { Button } from "@/components/ui/Button";
import {
  BookOpen, Headphones, Mic, PenLine, Flame, Zap,
  Trophy, Target, ArrowRight, TrendingUp, Clock, CheckCircle,
  Crown, Star
} from "lucide-react";
import Link from "next/link";
import { getLevelDescription, getModuleColor } from "@/lib/utils";
import type { ModuleType } from "@/types";

const MODULES: { key: ModuleType; label: string; shortLabel: string; icon: React.ReactNode; href: string }[] = [
  { key: "reading", label: "Comprehension ecrite", shortLabel: "Ecrite", icon: <BookOpen size={22} />, href: "/reading" },
  { key: "listening", label: "Comprehension orale", shortLabel: "Orale", icon: <Headphones size={22} />, href: "/listening" },
  { key: "speaking", label: "Expression orale", shortLabel: "Expression", icon: <Mic size={22} />, href: "/speaking" },
  { key: "writing", label: "Expression ecrite", shortLabel: "Redaction", icon: <PenLine size={22} />, href: "/writing" },
];

const MOCK_SCORES = { reading: 74, listening: 61, speaking: 82, writing: 68 };
const MOCK_HISTORY = [
  { date: "Lun", xp: 80 }, { date: "Mar", xp: 120 }, { date: "Mer", xp: 60 },
  { date: "Jeu", xp: 140 }, { date: "Ven", xp: 90 }, { date: "Sam", xp: 0 }, { date: "Dim", xp: 110 },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && !user) router.push("/login");
  }, [user, router, mounted]);

  if (!user) return null;

  const overallScore = Math.round(Object.values(MOCK_SCORES).reduce((a, b) => a + b, 0) / 4);
  const dailyUsed = user.plan === "free" ? 3 : 0;
  const dailyMax = user.plan === "free" ? 5 : Infinity;

  return (
    <AppLayout title="Tableau de bord">
      <div className="space-y-6 animate-slide-up">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white">
              Bonjour, {user.full_name?.split(" ")[0]} ! 👋
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              {getLevelDescription(user.current_level)}
            </p>
          </div>
          {user.plan === "free" && (
            <Link href="?upgrade=true" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
              <Crown size={15} /> Passer a Premium
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Flame className="text-accent-500" size={20} />, label: "Serie", value: `${user.streak_days}j`, bg: "bg-accent-50 dark:bg-accent-950/30" },
            { icon: <Zap className="text-primary-500" size={20} />, label: "XP total", value: user.total_xp.toLocaleString(), bg: "bg-primary-50 dark:bg-primary-950/30" },
            { icon: <Trophy className="text-warning-500" size={20} />, label: "Niveau actuel", value: user.current_level, bg: "bg-warning-50 dark:bg-warning-950/30" },
            { icon: <Target className="text-success-500" size={20} />, label: "Objectif vise", value: user.target_level, bg: "bg-success-50 dark:bg-success-950/30" },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>{s.icon}</div>
              <div className="font-display font-bold text-2xl text-surface-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 font-medium mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Free plan progress */}
        {user.plan === "free" && (
          <Card className="p-4 border-accent-200 dark:border-accent-800 bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-950/20 dark:to-primary-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Exercices aujourd'hui</span>
              <span className="text-sm font-bold text-surface-900 dark:text-white">{dailyUsed} / {dailyMax}</span>
            </div>
            <ProgressBar value={dailyUsed} max={dailyMax} color="accent" size="sm" />
            <p className="text-xs text-surface-500 mt-2">Passez a Premium pour des exercices illimites et une analyse orale complete.</p>
          </Card>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Score overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-lg text-surface-900 dark:text-white">Vos performances</h3>
                  <LevelBadge level={user.current_level} size="md" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {MODULES.map((mod) => (
                    <Link key={mod.key} href={mod.href} className="group text-center">
                      <ScoreCircle
                        score={MOCK_SCORES[mod.key]}
                        size="md"
                        label={mod.shortLabel}
                        className="mx-auto mb-1"
                      />
                    </Link>
                  ))}
                </div>
                <div className="pt-4 border-t border-surface-100 dark:border-surface-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Score global</span>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">{overallScore}/100</span>
                  </div>
                  <ProgressBar value={overallScore} color="primary" size="md" />
                </div>
              </CardBody>
            </Card>

            {/* Module cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {MODULES.map((mod) => {
                const score = MOCK_SCORES[mod.key];
                const gradient = getModuleColor(mod.key);
                return (
                  <Link key={mod.key} href={mod.href}>
                    <Card hover className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
                          {mod.icon}
                        </div>
                        <span className="font-display font-bold text-2xl text-surface-900 dark:text-white">{score}</span>
                      </div>
                      <h4 className="font-semibold text-surface-900 dark:text-white text-sm mb-2">{mod.label}</h4>
                      <ProgressBar value={score} size="xs" color={score >= 70 ? "success" : score >= 50 ? "warning" : "danger"} />
                      <div className="flex items-center gap-1 mt-3 text-primary-600 dark:text-primary-400">
                        <span className="text-xs font-semibold">Pratiquer</span>
                        <ArrowRight size={12} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* CECR estimate */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={16} className="text-white/70" />
                  <span className="text-sm font-medium opacity-80">Niveau CECR estime</span>
                </div>
                <div className="font-display font-black text-6xl opacity-20 absolute right-4 top-2">{user.current_level}</div>
                <div className="font-display font-black text-5xl">{user.current_level}</div>
                <div className="text-sm opacity-70 mt-1">Intermediaire</div>
              </div>
              <CardBody className="p-4">
                <div className="space-y-2">
                  {(["A1", "A2", "B1", "B2", "C1"] as const).map((l) => (
                    <div key={l} className="flex items-center gap-3">
                      <LevelBadge level={l} size="sm" />
                      <div className="flex-1 h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${l === user.current_level ? "bg-primary-500 w-full" : l < user.current_level ? "bg-success-500 w-full" : "w-0"}`} />
                      </div>
                      {l <= user.current_level && <CheckCircle size={14} className="text-success-500" />}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Weekly XP chart */}
            <Card>
              <CardBody className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-primary-500" />
                  <h3 className="font-semibold text-surface-900 dark:text-white">XP cette semaine</h3>
                </div>
                <div className="flex items-end gap-1.5 h-24">
                  {MOCK_HISTORY.map((d) => {
                    const max = Math.max(...MOCK_HISTORY.map((x) => x.xp));
                    const h = d.xp === 0 ? 4 : (d.xp / max) * 100;
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all"
                          style={{ height: `${h}%`, opacity: d.xp === 0 ? 0.3 : 1 }}
                        />
                        <span className="text-xs text-surface-400">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between">
                  <span className="text-xs text-surface-500">Total semaine</span>
                  <span className="text-sm font-bold text-surface-900 dark:text-white">
                    {MOCK_HISTORY.reduce((a, b) => a + b.xp, 0)} XP
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardBody className="p-5">
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Commencer maintenant</h3>
                <div className="space-y-2">
                  {MODULES.map((mod) => {
                    const gradient = getModuleColor(mod.key);
                    return (
                      <Link key={mod.key} href={mod.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors group">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
                          {mod.icon}
                        </div>
                        <span className="text-sm font-medium text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-white transition-colors">{mod.label}</span>
                        <ArrowRight size={14} className="ml-auto text-surface-300 group-hover:text-primary-500 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Tip */}
            <Card className="bg-gradient-to-br from-success-50 to-primary-50 dark:from-success-950/20 dark:to-primary-950/20 border-success-200 dark:border-success-900/30">
              <CardBody className="p-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-success-500 flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-surface-900 dark:text-white text-sm mb-1">Conseil du jour</div>
                    <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                      Consacrez 20 minutes par jour a l'expression orale. C'est la competence ou vous progresserez le plus rapidement avec une pratique reguliere.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
