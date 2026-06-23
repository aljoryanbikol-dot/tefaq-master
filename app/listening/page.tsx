"use client";
import { useState, useRef } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { sampleListeningExercises } from "@/lib/sample-data";
import { scoreToGrade, calculateXP } from "@/lib/utils";
import { Headphones, Play, Pause, RotateCcw, ArrowRight, CheckCircle, XCircle, Trophy, FileText, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import type { ListeningExercise } from "@/types";
import { cn } from "@/lib/utils";

type Stage = "list" | "exercise" | "results";

export default function ListeningPage() {
  const [stage, setStage] = useState<Stage>("list");
  const [selected, setSelected] = useState<ListeningExercise | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startExercise = (ex: ListeningExercise) => {
    setSelected(ex);
    setAnswers(new Array(ex.questions.length).fill(null));
    setPlaying(false);
    setShowTranscript(false);
    setPlayCount(0);
    setStage("exercise");
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      // Simulate audio since we don't have real files
      toast("Audio simulé - En production, les fichiers audio seraient disponibles.", { icon: "🎧" });
      setPlayCount((p) => p + 1);
      return;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
      setPlayCount((p) => p + 1);
    }
  };

  const handleAnswer = (qIdx: number, aIdx: number) => {
    setAnswers((prev) => { const a = [...prev]; a[qIdx] = aIdx; return a; });
  };

  const handleSubmit = () => {
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      toast(`Il reste ${unanswered} question(s) sans reponse.`, { icon: "⚠️" });
      return;
    }
    setStage("results");
  };

  const score = selected
    ? Math.round((answers.filter((a, i) => a === selected.questions[i]?.correct_answer).length / selected.questions.length) * 100)
    : 0;

  if (stage === "list") {
    return (
      <AppLayout title="Comprehension orale">
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">Comprehension orale</h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Enregistrements audio en francais quebecois avec questions de comprehension</p>
          </div>
          <div className="grid gap-4">
            {sampleListeningExercises.map((ex) => (
              <Card key={ex.id} hover onClick={() => startExercise(ex)} className="group">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <LevelBadge level={ex.level} />
                        <span className="text-xs text-surface-400 font-medium px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-full">{ex.topic}</span>
                        <span className="text-xs text-surface-400">{ex.duration}s</span>
                      </div>
                      <h3 className="font-semibold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{ex.title}</h3>
                      <p className="text-sm text-surface-500">{ex.questions.length} questions</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-all">
                      <Headphones size={20} className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
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
    const xp = calculateXP(score, "listening");
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
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-semibold">+{xp} XP gagnes</div>
            </div>
            <CardBody className="p-6">
              <div className="flex justify-around mb-6 text-center">
                <div><div className="font-display font-bold text-2xl text-success-600">{correct}</div><div className="text-xs text-surface-500">Bonnes reponses</div></div>
                <div><div className="font-display font-bold text-2xl text-danger-600">{selected.questions.length - correct}</div><div className="text-xs text-surface-500">Erreurs</div></div>
              </div>
              <div className="space-y-4">
                {selected.questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct_answer;
                  return (
                    <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950/20" : "border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-950/20"}`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? <CheckCircle size={18} className="text-success-500 flex-shrink-0 mt-0.5" /> : <XCircle size={18} className="text-danger-500 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white text-sm mb-1">{q.question}</p>
                          {!isCorrect && <p className="text-xs text-success-600 dark:text-success-400 mb-1">Reponse correcte : {q.options[q.correct_answer]}</p>}
                          <p className="text-xs text-surface-500 italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" icon={<RotateCcw size={16} />} onClick={() => startExercise(selected)}>Recommencer</Button>
                <Button className="flex-1" icon={<ArrowRight size={16} />} iconPosition="right" onClick={() => setStage("list")}>Autre exercice</Button>
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
          <div className="flex items-center justify-between">
            <LevelBadge level={selected.level} size="md" />
            <span className="text-sm text-surface-500">{answered}/{selected.questions.length} reponses</span>
          </div>
          <ProgressBar value={answered} max={selected.questions.length} color="primary" size="sm" />

          {/* Audio player */}
          <Card className="bg-gradient-to-br from-purple-600 to-primary-600 text-white overflow-hidden">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Headphones size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selected.title}</h3>
                  <p className="text-white/70 text-sm">{selected.duration}s · {selected.topic}</p>
                </div>
              </div>

              {/* Waveform visualization */}
              <div className="flex items-center gap-0.5 h-10 mb-4">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className={cn("flex-1 rounded-full transition-all", playing ? "animate-pulse bg-white/60" : "bg-white/30")}
                    style={{ height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 20}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                  {playing ? <Pause size={20} className="text-purple-600" /> : <Play size={20} className="text-purple-600 ml-1" />}
                </button>
                <div className="flex-1">
                  <div className="h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full w-0" /></div>
                  <div className="flex justify-between text-xs text-white/60 mt-1"><span>0:00</span><span>0:{selected.duration}</span></div>
                </div>
                <button onClick={() => { setPlaying(false); setPlayCount(0); }} className="text-white/60 hover:text-white transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>

              <p className="text-white/60 text-xs mt-3">{playCount > 0 ? `Ecouté ${playCount} fois` : "Appuyez sur Lecture pour ecouter"}</p>
            </CardBody>
          </Card>

          {/* Transcript toggle */}
          {selected.transcript && (
            <button onClick={() => setShowTranscript(!showTranscript)} className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-surface-300 dark:border-surface-600 text-surface-500 hover:border-primary-400 hover:text-primary-600 transition-all text-sm font-medium">
              <FileText size={16} />
              {showTranscript ? "Masquer la transcription" : "Afficher la transcription"}
              <ChevronDown size={16} className={`ml-auto transition-transform ${showTranscript ? "rotate-180" : ""}`} />
            </button>
          )}

          {showTranscript && selected.transcript && (
            <Card className="bg-surface-50 dark:bg-surface-800/50 border-dashed border-surface-300 dark:border-surface-600">
              <CardBody>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Transcription</p>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed italic">{selected.transcript}</p>
              </CardBody>
            </Card>
          )}

          {/* Questions */}
          <div className="space-y-5">
            {selected.questions.map((q, qIdx) => (
              <Card key={q.id}>
                <CardBody>
                  <p className="font-semibold text-surface-900 dark:text-white mb-4"><span className="text-primary-500 mr-2">{qIdx + 1}.</span>{q.question}</p>
                  <div className="space-y-2.5">
                    {q.options.map((opt, aIdx) => (
                      <button key={aIdx} onClick={() => handleAnswer(qIdx, aIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${answers[qIdx] === aIdx ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300" : "border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 text-surface-700 dark:text-surface-300"}`}>
                        <span className="font-bold text-surface-400 mr-3">{["A", "B", "C", "D"][aIdx]}.</span>{opt}
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
