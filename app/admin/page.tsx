"use client";
import { useState } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/ui/Badge";
import { sampleReadingExercises, sampleListeningExercises, sampleSpeakingPrompts, sampleWritingPrompts } from "@/lib/sample-data";
import { Users, BookOpen, Headphones, Mic, PenLine, BarChart3, Plus, Settings, TrendingUp, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { key: "reading", label: "Comprehension ecrite", icon: BookOpen },
  { key: "listening", label: "Comprehension orale", icon: Headphones },
  { key: "speaking", label: "Expression orale", icon: Mic },
  { key: "writing", label: "Expression ecrite", icon: PenLine },
  { key: "users", label: "Utilisateurs", icon: Users },
];

const MOCK_STATS = {
  total_users: 10482,
  premium_users: 2341,
  exercises_today: 8920,
  avg_score: 67,
};

const MOCK_USERS = [
  { name: "Amira Benali", email: "amira@mail.com", level: "B2" as const, plan: "premium", joined: "2024-01-15", exercises: 142 },
  { name: "Carlos Mendez", email: "carlos@mail.com", level: "B1" as const, plan: "free", joined: "2024-02-03", exercises: 38 },
  { name: "Yuki Tanaka", email: "yuki@mail.com", level: "A2" as const, plan: "premium", joined: "2024-02-18", exercises: 89 },
  { name: "Fatou Diallo", email: "fatou@mail.com", level: "B1" as const, plan: "free", joined: "2024-03-01", exercises: 21 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AppLayout title="Administration">
      <div className="space-y-6">
        {/* Tab Nav */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.key
                    ? "bg-primary-600 text-white shadow-glow"
                    : "bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Users size={20} className="text-primary-500" />, label: "Utilisateurs totaux", value: MOCK_STATS.total_users.toLocaleString(), change: "+12%", bg: "bg-primary-50 dark:bg-primary-950/30" },
                { icon: <Crown size={20} className="text-accent-500" />, label: "Membres Premium", value: MOCK_STATS.premium_users.toLocaleString(), change: "+18%", bg: "bg-accent-50 dark:bg-accent-950/30" },
                { icon: <BarChart3 size={20} className="text-success-500" />, label: "Exercices aujourd'hui", value: MOCK_STATS.exercises_today.toLocaleString(), change: "+5%", bg: "bg-success-50 dark:bg-success-950/30" },
                { icon: <TrendingUp size={20} className="text-warning-500" />, label: "Score moyen", value: `${MOCK_STATS.avg_score}%`, change: "+2%", bg: "bg-warning-50 dark:bg-warning-950/30" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardBody className="p-5">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>{s.icon}</div>
                    <div className="font-display font-bold text-2xl text-surface-900 dark:text-white">{s.value}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-surface-500">{s.label}</div>
                      <div className="text-xs text-success-600 font-semibold">{s.change}</div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Modules les plus utilises</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Comprehension ecrite", count: 3240, color: "bg-blue-500" },
                      { label: "Comprehension orale", count: 2890, color: "bg-purple-500" },
                      { label: "Expression ecrite", count: 2120, color: "bg-green-500" },
                      { label: "Expression orale", count: 670, color: "bg-orange-500" },
                    ].map((m) => {
                      const max = 3240;
                      return (
                        <div key={m.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-surface-600 dark:text-surface-300">{m.label}</span>
                            <span className="font-semibold text-surface-900 dark:text-white">{m.count.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full">
                            <div className={`h-full ${m.color} rounded-full`} style={{ width: `${(m.count / max) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Distribution des niveaux</h3>
                  <div className="space-y-3">
                    {[
                      { level: "A1" as const, count: 1240, pct: 12 },
                      { level: "A2" as const, count: 2890, pct: 28 },
                      { level: "B1" as const, count: 3510, pct: 34 },
                      { level: "B2" as const, count: 2100, pct: 20 },
                      { level: "C1" as const, count: 742, pct: 7 },
                    ].map((l) => (
                      <div key={l.level} className="flex items-center gap-3">
                        <LevelBadge level={l.level} size="sm" />
                        <div className="flex-1 h-2 bg-surface-100 dark:bg-surface-700 rounded-full">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${l.pct}%` }} />
                        </div>
                        <span className="text-xs text-surface-500 w-12 text-right">{l.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Reading exercises */}
        {activeTab === "reading" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Exercices de comprehension ecrite</h3>
              <Button size="sm" icon={<Plus size={16} />}>Ajouter un exercice</Button>
            </div>
            <div className="grid gap-3">
              {sampleReadingExercises.map((ex) => (
                <Card key={ex.id}>
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LevelBadge level={ex.level} />
                        <div>
                          <p className="font-semibold text-surface-900 dark:text-white text-sm">{ex.title}</p>
                          <p className="text-xs text-surface-400">{ex.topic} · {ex.questions.length} questions</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="xs">Modifier</Button>
                        <Button variant="outline" size="xs" icon={<Settings size={12} />}>Gerer</Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Listening exercises */}
        {activeTab === "listening" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Exercices de comprehension orale</h3>
              <Button size="sm" icon={<Plus size={16} />}>Ajouter un audio</Button>
            </div>
            <div className="grid gap-3">
              {sampleListeningExercises.map((ex) => (
                <Card key={ex.id}>
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LevelBadge level={ex.level} />
                        <div>
                          <p className="font-semibold text-surface-900 dark:text-white text-sm">{ex.title}</p>
                          <p className="text-xs text-surface-400">{ex.topic} · {ex.duration}s · {ex.questions.length} questions</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="xs">Modifier</Button>
                        <Button variant="outline" size="xs">Audio</Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Speaking prompts */}
        {activeTab === "speaking" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Sujets d'expression orale</h3>
              <Button size="sm" icon={<Plus size={16} />}>Ajouter un sujet</Button>
            </div>
            <div className="grid gap-3">
              {sampleSpeakingPrompts.map((p) => (
                <Card key={p.id}>
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LevelBadge level={p.level} />
                        <div>
                          <p className="text-sm text-surface-700 dark:text-surface-300 line-clamp-1">{p.prompt}</p>
                          <p className="text-xs text-surface-400">{p.topic} · {p.duration}s</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="xs">Modifier</Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Writing prompts */}
        {activeTab === "writing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Consignes d'expression ecrite</h3>
              <Button size="sm" icon={<Plus size={16} />}>Ajouter une consigne</Button>
            </div>
            <div className="grid gap-3">
              {sampleWritingPrompts.map((p) => (
                <Card key={p.id}>
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LevelBadge level={p.level} />
                        <div>
                          <p className="text-sm text-surface-700 dark:text-surface-300 line-clamp-1">{p.prompt}</p>
                          <p className="text-xs text-surface-400">{p.topic} · {p.word_count_min}–{p.word_count_max} mots</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="xs">Modifier</Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Gestion des utilisateurs</h3>
              <div className="text-sm text-surface-500">{MOCK_STATS.total_users.toLocaleString()} utilisateurs au total</div>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-50 dark:bg-surface-800/50">
                    <tr>
                      {["Utilisateur", "Niveau", "Plan", "Exercices", "Inscription", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                    {MOCK_USERS.map((u) => (
                      <tr key={u.email} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-surface-900 dark:text-white">{u.name}</div>
                              <div className="text-xs text-surface-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><LevelBadge level={u.level} /></td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", u.plan === "premium" ? "bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400" : "bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300")}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-300">{u.exercises}</td>
                        <td className="px-4 py-3 text-sm text-surface-500">{new Date(u.joined).toLocaleDateString("fr-CA")}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="xs">Voir</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
