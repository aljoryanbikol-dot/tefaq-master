"use client";
import { useState } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CountdownTimer } from "@/components/shared/Timer";
import { sampleReadingExercises } from "@/lib/sample-data";
import { scoreToGrade, calculateXP } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";
import type { ReadingExercise } from "@/types";

type Stage = "list" | "exercise" | "results";

export default function ReadingPage() {
  const { user } = useAuthStore();
  const [stage, setStage] = useState<Stage>("list");
  const [selected, setSelected] = useState<ReadingExercise | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const startExercise = (ex: ReadingExercise) => {
    if (user?.plan === "free" && ex.level === "C1") {
      toast.error("Les exercices C1 sont reserves aux membres Premium.");
      return;
    }
    setSelected(ex);
    setAnswers(new Array(ex.questions.length).fill(null));
    setSubmitted(false);
    setTimeExpired(false);
    setStage("exercise");
  };

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => { const a = [...prev]; a[qIdx] = aIdx; return a; });
  };

  const handleSubmit = () => {
    if (!selected) return;
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0 && !timeExpired) {
      toast(`Il reste ${unanswered} question(s) sans reponse.`, { icon: "⚠️" });
      return;
    }
    setSubmitted(true);
    setStage("results");
  };

  const score = selected
    ? Math.round((answers.filter((a, i) => a === selected.questions[i]?.correct_answer).length / selected.questions.length) * 100)
    : 0;

  if (stage === "list") {
    return (
      <AppLayout title="Comprehension ecrite">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">Comprehension ecrite</h2>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Textes TEFAQ authentiques avec questions a choix multiples</p>
            </div>
          </div>

          <div className="grid gap-4">
            {sampleReadingExercises.map((ex) => (
              <Card key={ex.id} hover onClick={() => startExercise(ex)} className="group">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <LevelBadge level={ex.level} />
                        <span className="text-xs text-surface-400 font-medium px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-full">{ex.topic}</span>
                        {ex.time_limit && (
                          <div className="flex items-center gap-1 text-xs text-surface-400">
                            <Clock size={12} />
                            {Math.floor(ex.time_limit / 60)} min
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {ex.title}
                      </h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {ex.questions.length} questions &middot; {Math.ceil(ex.text.split(" ").length / 150)} min de lecture
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center group-hover:bg-primary-600 transition-all flex-shrink-0">
                      <ArrowRight size={18} className="text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
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

  if (stage === "results" && selected) {
    const correct = answers.filter((a, i) => a === selected.questions[i]?.correct_answer).length;
    const xp = calculateXP(score, "reading");
    return (
      <AppLayout title="Resultats">
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
          <Card className="overflow-hidden">
            <div className={`p-8 text-center ${score >= 70 ? "bg-gradient-to-br from-success-500 to-success-600" : score >= 50 ? "bg-gradient-to-br from-warning-500 to-warning-600" : "bg-gradient-to-br from-danger-500 to-danger-600"}`}>
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Trophy size={36} className="text-white" />
              </div>
              <div className="text-white font-display font-black text-6xl mb-2">{score}%</div>
              <div className="text-white/80 text-lg font-semibold">{scoreToGrade(score)}</div>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-semibold">
                +{xp} XP gagnés
              </div>
            </div>
            <CardBody className="p-6">
              <div className="flex justify-around mb-6 text-center">
                <div>
                  <div className="font-display font-bold text-2xl text-success-600">{correct}</div>
                  <div className="text-xs text-surface-500">Bonnes reponses</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-danger-600">{selected.questions.length - correct}</div>
                  <div className="text-xs text-surface-500">Mauvaises reponses</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-surface-700 dark:text-surface-300">{selected.questions.length}</div>
                  <div className="text-xs text-surface-500">Total questions</div>
                </div>
              </div>

              <div className="space-y-4">
                {selected.questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct_answer;
                  return (
                    <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950/20" : "border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-950/20"}`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle size={18} className="text-success-500 flex-shrink-0 mt-0.5" /> : <XCircle size={18} className="text-danger-500 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white text-sm mb-2">{q.question}</p>
                          {!isCorrect && (
                            <>
                              <p className="text-xs text-danger-600 dark:text-danger-400 mb-1">Votre reponse : {q.options[answers[i] ?? 0]}</p>
                              <p className="text-xs text-success-600 dark:text-success-400 mb-2">Bonne reponse : {q.options[q.correct_answer]}</p>
                            </>
                          )}
                          <p className="text-xs text-surface-500 dark:text-surface-400 italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" icon={<RotateCcw size={16} />} onClick={() => startExercise(selected)}>
                  Recommencer
                </Button>
                <Button className="flex-1" icon={<ArrowRight size={16} />} iconPosition="right" onClick={() => setStage("list")}>
                  Autre exercice
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (stage === "exercise" && selected) {
    const answered = answers.filter((a) => a !== null).length;
    return (
      <AppLayout title={selected.title}>
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LevelBadge level={selected.level} size="md" />
              <span className="text-sm text-surface-500">{answered}/{selected.questions.length} reponses</span>
            </div>
            {selected.time_limit && (
              <CountdownTimer seconds={selected.time_limit} onTimeUp={() => { setTimeExpired(true); handleSubmit(); }} />
            )}
          </div>

          <ProgressBar value={answered} max={selected.questions.length} color="primary" size="sm" />

          {/* Text */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-primary-500" />
                <h3 className="font-semibold text-surface-900 dark:text-white">{selected.title}</h3>
              </div>
              <div className="prose prose-sm max-w-none text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">
                {selected.text}
              </div>
            </CardBody>
          </Card>

          {/* Questions */}
          <div className="space-y-5">
            {selected.questions.map((q, qIdx) => (
              <Card key={q.id}>
                <CardBody>
                  <p className="font-semibold text-surface-900 dark:text-white mb-4">
                    <span className="text-primary-500 mr-2">{qIdx + 1}.</span>{q.question}
                  </p>
                  <div className="space-y-2.5">
                    {q.options.map((opt, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleAnswer(qIdx, aIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          answers[qIdx] === aIdx
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300"
                            : "border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 text-surface-700 dark:text-surface-300"
                        }`}
                      >
                        <span className="font-bold text-surface-400 mr-3">{["A", "B", "C", "D"][aIdx]}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStage("list")}>Annuler</Button>
            <Button className="flex-1" size="lg" onClick={handleSubmit} icon={<ArrowRight size={18} />} iconPosition="right">
              Soumettre mes reponses
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
