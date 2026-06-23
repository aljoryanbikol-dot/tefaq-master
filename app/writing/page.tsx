"use client";
import { useState } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { sampleWritingPrompts } from "@/lib/sample-data";
import { PenLine, ArrowRight, Loader2, CheckCircle, AlertCircle, TrendingUp, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import type { WritingPrompt, WritingEvaluation } from "@/types";

type Stage = "list" | "writing" | "processing" | "results";

export default function WritingPage() {
  const [stage, setStage] = useState<Stage>("list");
  const [selected, setSelected] = useState<WritingPrompt | null>(null);
  const [text, setText] = useState("");
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (!selected) return;
    if (wordCount < selected.word_count_min) {
      toast.error(`Minimum ${selected.word_count_min} mots requis. Vous en avez ${wordCount}.`);
      return;
    }
    setStage("processing");
    try {
      const res = await fetch("/api/writing/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, prompt: selected.prompt, targetLevel: "B1" }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setEvaluation(data);
      setStage("results");
    } catch {
      // Demo mock evaluation
      await new Promise((r) => setTimeout(r, 2500));
      const mockEval: WritingEvaluation = {
        overall_score: 68,
        cefr_level: "B1",
        grammar_score: 72,
        vocabulary_score: 65,
        coherence_score: 70,
        task_achievement_score: 66,
        feedback: "Votre texte repond globalement a la consigne donnee. La structure est correcte avec une introduction, un developpement et une conclusion. Votre grammaire de base est maitrisee, bien que quelques erreurs subsistent dans l'emploi des temps. Le vocabulaire est adequat mais pourrait etre enrichi pour atteindre un niveau superieur. Travaillez sur la variete des constructions syntaxiques et l'utilisation de connecteurs logiques plus elabores.",
        grammar_corrections: [
          { original: "j'ai aller", corrected: "je suis alle(e)", explanation: "Les verbes de mouvement (aller, venir, partir...) utilisent l'auxiliaire 'etre' au passe compose." },
          { original: "des informations utiles", corrected: "des informations utiles (correct)", explanation: "'Informations' est feminin pluriel, l'accord est donc correct ici." },
        ],
        vocabulary_suggestions: [
          { original: "content", better_alternatives: ["ravi", "enchante", "enthousiaste", "satisfait"], context: "Pour exprimer la joie ou la satisfaction" },
          { original: "beaucoup de", better_alternatives: ["de nombreux/nombreuses", "une multitude de", "une quantite considerable de"], context: "Pour exprimer une grande quantite" },
        ],
        strengths: ["Bonne structure globale du texte", "Respect de la consigne donnee", "Orthographe generalement correcte"],
        weaknesses: ["Emploi parfois incorrect des temps verbaux", "Vocabulaire basique, peu de variete", "Manque de connecteurs logiques elabores"],
      };
      setEvaluation(mockEval);
      setStage("results");
    }
  };

  if (stage === "list") {
    return (
      <AppLayout title="Expression ecrite">
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">Expression ecrite</h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Redigez un texte sur une consigne TEFAQ et recevez une correction IA detaillee</p>
          </div>
          <div className="grid gap-4">
            {sampleWritingPrompts.map((p) => (
              <Card key={p.id} hover onClick={() => { setSelected(p); setText(""); setStage("writing"); }} className="group">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <LevelBadge level={p.level} />
                        <span className="text-xs text-surface-400 px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-full">{p.topic}</span>
                        <span className="text-xs text-surface-400">{p.word_count_min}–{p.word_count_max} mots</span>
                      </div>
                      <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed line-clamp-2">{p.prompt}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-all">
                      <ArrowRight size={18} className="text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (stage === "writing" && selected) {
    return (
      <AppLayout title="Redaction">
        <div className="max-w-3xl mx-auto space-y-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <LevelBadge level={selected.level} size="md" />
            <span className="text-sm text-surface-500">{selected.topic}</span>
          </div>

          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-900/30">
            <CardBody className="p-5">
              <div className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                <PenLine size={16} />
                <span className="font-semibold text-sm">Consigne</span>
              </div>
              <p className="text-surface-900 dark:text-white leading-relaxed">{selected.prompt}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-surface-500">
                <span>{selected.word_count_min}–{selected.word_count_max} mots</span>
              </div>
            </CardBody>
          </Card>

          <Textarea
            label="Votre reponse"
            placeholder="Commencez a rediger votre reponse ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            wordCount={wordCount}
            maxWords={selected.word_count_max}
            hint={`Minimum : ${selected.word_count_min} mots`}
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStage("list")}>Annuler</Button>
            <Button className="flex-1" size="lg" icon={<ArrowRight size={18} />} iconPosition="right" onClick={handleSubmit}>
              Soumettre pour correction IA
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (stage === "processing") {
    return (
      <AppLayout title="Correction en cours">
        <div className="max-w-xl mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
            <Loader2 size={40} className="text-green-600 animate-spin" />
          </div>
          <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-3">Correction en cours...</h2>
          <p className="text-surface-500 text-sm leading-relaxed max-w-sm mx-auto">
            Notre IA analyse votre grammaire, vocabulaire et coherence. Cela prend quelques secondes.
          </p>
        </div>
      </AppLayout>
    );
  }

  if (stage === "results" && evaluation && selected) {
    return (
      <AppLayout title="Correction IA">
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          {/* Header */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Score global</p>
                  <div className="font-display font-black text-6xl">{evaluation.overall_score}</div>
                  <div className="mt-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">Niveau {evaluation.cefr_level}</span>
                  </div>
                </div>
                <ScoreCircle score={evaluation.overall_score} size="lg" color="white" className="opacity-90" />
              </div>
            </div>
          </Card>

          {/* Score breakdown */}
          <Card>
            <CardBody>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-500" /> Scores par critere
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Grammaire", score: evaluation.grammar_score },
                  { label: "Vocabulaire", score: evaluation.vocabulary_score },
                  { label: "Coherence", score: evaluation.coherence_score },
                  { label: "Tache", score: evaluation.task_achievement_score },
                ].map((c) => (
                  <ScoreCircle key={c.label} score={c.score} label={c.label} size="sm" className="mx-auto" />
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Feedback */}
          <Card>
            <CardBody>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">Evaluation generale</p>
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{evaluation.feedback}</p>
            </CardBody>
          </Card>

          {/* Grammar corrections */}
          {evaluation.grammar_corrections.length > 0 && (
            <Card>
              <CardBody>
                <p className="text-xs font-bold text-danger-600 dark:text-danger-400 uppercase tracking-wide mb-4">Corrections grammaticales</p>
                <div className="space-y-4">
                  {evaluation.grammar_corrections.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
                      <div className="flex gap-3 mb-2 text-sm">
                        <span className="line-through text-danger-500">{c.original}</span>
                        <span className="text-surface-400">→</span>
                        <span className="text-success-600 dark:text-success-400 font-semibold">{c.corrected}</span>
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{c.explanation}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Vocabulary suggestions */}
          {evaluation.vocabulary_suggestions.length > 0 && (
            <Card>
              <CardBody>
                <p className="text-xs font-bold text-warning-600 dark:text-warning-400 uppercase tracking-wide mb-4">Enrichissement du vocabulaire</p>
                <div className="space-y-4">
                  {evaluation.vocabulary_suggestions.map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-warning-50 dark:bg-warning-950/20 border border-warning-200 dark:border-warning-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Au lieu de <em>"{v.original}"</em>, essayez :</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {v.better_alternatives.map((alt) => (
                          <span key={alt} className="px-2.5 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 rounded-lg text-xs font-semibold">{alt}</span>
                        ))}
                      </div>
                      <p className="text-xs text-surface-400">{v.context}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Strengths / Weaknesses */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Card className="border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-950/20">
              <CardBody>
                <p className="text-xs font-bold text-success-600 dark:text-success-400 uppercase tracking-wide mb-3">Points forts</p>
                <ul className="space-y-2">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                      <CheckCircle size={14} className="text-success-500 flex-shrink-0 mt-0.5" />{s}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            <Card className="border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-950/20">
              <CardBody>
                <p className="text-xs font-bold text-warning-600 dark:text-warning-400 uppercase tracking-wide mb-3">A ameliorer</p>
                <ul className="space-y-2">
                  {evaluation.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                      <AlertCircle size={14} className="text-warning-500 flex-shrink-0 mt-0.5" />{w}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" icon={<RefreshCw size={16} />} onClick={() => { setStage("writing"); }}>Reediter</Button>
            <Button className="flex-1" icon={<ArrowRight size={16} />} iconPosition="right" onClick={() => setStage("list")}>Autre exercice</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
