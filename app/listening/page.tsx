"use client";
import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { sampleListeningExercises } from "@/lib/sample-data";
import { scoreToGrade, calculateXP } from "@/lib/utils";
import {
  Headphones, Play, Pause, Square, RotateCcw,
  ArrowRight, CheckCircle, XCircle, Trophy,
  FileText, ChevronDown, Volume2, SkipBack,
} from "lucide-react";
import toast from "react-hot-toast";
import type { ListeningExercise } from "@/types";

type Stage = "list" | "exercise" | "results";
type TtsState = "idle" | "playing" | "paused";

const SPEEDS = [0.75, 1, 1.25] as const;
type Speed = typeof SPEEDS[number];

export default function ListeningPage() {
  const [stage, setStage] = useState<Stage>("list");
  const [selected, setSelected] = useState<ListeningExercise | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [ttsState, setTtsState] = useState<TtsState>("idle");
  const [showTranscript, setShowTranscript] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);

  // Refs — never cause re-renders, safe to read inside browser callbacks
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);
  // Tracks whether the current utterance was intentionally cancelled (stop/replay/unmount)
  const cancelledRef = useRef<boolean>(false);

  // Pure cancel: clears interval + calls speechSynthesis.cancel, NO state updates.
  // State updates are handled by the caller after cancel() returns.
  const cancelSpeech = () => {
    cancelledRef.current = true;
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Cleanup on unmount only
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      cancelSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFrenchVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined") return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "fr-CA") ??
      voices.find((v) => v.lang === "fr-FR") ??
      voices.find((v) => v.lang.startsWith("fr")) ??
      voices[0] ??
      null
    );
  };

  const startProgressTimer = (durationMs: number) => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (!isMounted.current) return;
      const elapsed = Date.now() - startTimeRef.current + pausedAtRef.current;
      const pct = Math.min((elapsed / durationMs) * 100, 99);
      setProgress(pct);
    }, 300);
  };

  const handlePlay = () => {
    if (!selected?.transcript) return;

    // Cancel any ongoing speech without touching React state yet
    cancelSpeech();

    // Reset progress state synchronously before creating utterance
    setProgress(0);
    setTtsState("idle");
    pausedAtRef.current = 0;

    const transcript = selected.transcript;
    const durationSec = selected.duration;
    const currentSpeed = speed;

    // Defer utterance creation to next tick so React finishes
    // reconciling the state updates above before the browser
    // speech engine fires onstart (which also updates state).
    setTimeout(() => {
      if (!isMounted.current) return;

      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = "fr-CA";
      utterance.rate = currentSpeed;
      utterance.pitch = 1;

      const voice = getFrenchVoice();
      if (voice) utterance.voice = voice;

      const durationMs = (durationSec / currentSpeed) * 1000;

      utterance.onstart = () => {
        if (!isMounted.current) return;
        cancelledRef.current = false;
        startTimeRef.current = Date.now();
        setTtsState("playing");
        setPlayCount((prev) => prev + 1);
        startProgressTimer(durationMs);
      };

      utterance.onend = () => {
        if (!isMounted.current) return;
        // onend fires for both natural end AND cancel(); skip if we cancelled
        if (cancelledRef.current) return;
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
        setProgress(100);
        setTtsState("idle");
        pausedAtRef.current = 0;
      };

      utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        if (!isMounted.current) return;
        // "interrupted" and "canceled" are normal — fired when cancel() is called
        if (e.error === "interrupted" || e.error === "canceled") return;
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
        setTtsState("idle");
        toast.error("Erreur audio. Essayez Chrome ou Edge.");
      };

      cancelledRef.current = false;
      window.speechSynthesis.speak(utterance);
    }, 0);
  };

  const handlePause = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.pause();
    pausedAtRef.current += Date.now() - startTimeRef.current;
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setTtsState("paused");
  };

  const handleResume = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.resume();
    startTimeRef.current = Date.now();
    if (selected) {
      const durationMs = (selected.duration / speed) * 1000;
      startProgressTimer(durationMs);
    }
    setTtsState("playing");
  };

  const handleStop = () => {
    cancelSpeech();
    setTtsState("idle");
    setProgress(0);
    pausedAtRef.current = 0;
  };

  const handleReplay = () => {
    handlePlay();
  };

  const handleSpeedChange = (s: Speed) => {
    const wasActive = ttsState !== "idle";
    if (wasActive) {
      cancelSpeech();
      setTtsState("idle");
      setProgress(0);
      pausedAtRef.current = 0;
    }
    setSpeed(s);
  };

  const startExercise = (ex: ListeningExercise) => {
    cancelSpeech();
    setTtsState("idle");
    setProgress(0);
    pausedAtRef.current = 0;
    setSelected(ex);
    setAnswers(new Array(ex.questions.length).fill(null));
    setShowTranscript(false);
    setPlayCount(0);
    setStage("exercise");
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
    cancelSpeech();
    setTtsState("idle");
    setStage("results");
  };

  const score = selected
    ? Math.round(
        (answers.filter((a, i) => a === selected.questions[i]?.correct_answer).length /
          selected.questions.length) * 100
      )
    : 0;

  // ── LIST ──────────────────────────────────────────────────────────────────
  if (stage === "list") {
    return (
      <AppLayout title="Comprehension orale">
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">
              Comprehension orale
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {sampleListeningExercises.length} exercices audio en francais quebecois — niveaux A1 a C1
            </p>
          </div>
          <div className="grid gap-4">
            {sampleListeningExercises.map((ex) => (
              <Card key={ex.id} hover onClick={() => startExercise(ex)} className="group">
                <CardBody className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <LevelBadge level={ex.level} />
                        <span className="text-xs text-surface-400 font-medium px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-full">
                          {ex.topic}
                        </span>
                        <span className="text-xs text-surface-400">{ex.duration}s</span>
                      </div>
                      <h3 className="font-semibold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {ex.title}
                      </h3>
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

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (stage === "results" && selected) {
    const correct = answers.filter((a, i) => a === selected.questions[i]?.correct_answer).length;
    const xp = calculateXP(score, "listening");
    return (
      <AppLayout title="Resultats">
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
          <Card className="overflow-hidden">
            <div
              className={`p-8 text-center ${
                score >= 70
                  ? "bg-gradient-to-br from-success-500 to-success-600"
                  : score >= 50
                  ? "bg-gradient-to-br from-warning-500 to-warning-600"
                  : "bg-gradient-to-br from-danger-500 to-danger-600"
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Trophy size={36} className="text-white" />
              </div>
              <div className="text-white font-display font-black text-6xl mb-2">{score}%</div>
              <div className="text-white/80 text-lg font-semibold">{scoreToGrade(score)}</div>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-white text-sm font-semibold">
                +{xp} XP gagnes
              </div>
            </div>
            <CardBody className="p-6">
              <div className="flex justify-around mb-6 text-center">
                <div>
                  <div className="font-display font-bold text-2xl text-success-600">{correct}</div>
                  <div className="text-xs text-surface-500">Bonnes reponses</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-danger-600">
                    {selected.questions.length - correct}
                  </div>
                  <div className="text-xs text-surface-500">Erreurs</div>
                </div>
              </div>
              <div className="space-y-4">
                {selected.questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct_answer;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? "border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950/20"
                          : "border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-950/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle size={18} className="text-success-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle size={18} className="text-danger-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white text-sm mb-1">
                            {q.question}
                          </p>
                          {!isCorrect && (
                            <p className="text-xs text-success-600 dark:text-success-400 mb-1">
                              Reponse correcte : {q.options[q.correct_answer]}
                            </p>
                          )}
                          <p className="text-xs text-surface-500 italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  icon={<RotateCcw size={16} />}
                  onClick={() => startExercise(selected)}
                >
                  Recommencer
                </Button>
                <Button
                  className="flex-1"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                  onClick={() => setStage("list")}
                >
                  Autre exercice
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // ── EXERCISE ──────────────────────────────────────────────────────────────
  if (stage === "exercise" && selected) {
    const answered = answers.filter((a) => a !== null).length;
    const isPlaying = ttsState === "playing";
    const isPaused = ttsState === "paused";
    const isIdle = ttsState === "idle";

    return (
      <AppLayout title={selected.title}>
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <LevelBadge level={selected.level} size="md" />
            <span className="text-sm text-surface-500">
              {answered}/{selected.questions.length} reponses
            </span>
          </div>
          <ProgressBar value={answered} max={selected.questions.length} color="primary" size="sm" />

          {/* ── TTS Audio Player ── */}
          <Card className="bg-gradient-to-br from-purple-600 to-primary-600 text-white overflow-hidden">
            <CardBody className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Headphones size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{selected.title}</h3>
                  <p className="text-white/70 text-sm">{selected.duration}s · {selected.topic}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Volume2 size={11} className="text-white/50" />
                    <span className="text-xs text-white/50">Synthese vocale · francais</span>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-0.5 h-10 mb-4">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlaying ? "animate-pulse bg-white/70" : "bg-white/25"
                    }`}
                    style={{ height: `${22 + Math.sin(i * 0.6) * 14 + (i % 4) * 7}%` }}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>0:00</span>
                  <span>
                    0:{String(Math.floor(selected.duration / speed)).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-3">
                {/* Stable wrapper — keeps one DOM node at this position so React
                    never hits a removeChild mismatch when ttsState changes mid-render */}
                <div className="w-12 h-12 flex-shrink-0">
                  {isIdle && (
                    <button
                      onClick={handlePlay}
                      title="Lecture"
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
                    >
                      <Play size={20} className="text-purple-600 ml-0.5" />
                    </button>
                  )}
                  {isPlaying && (
                    <button
                      onClick={handlePause}
                      title="Pause"
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
                    >
                      <Pause size={20} className="text-purple-600" />
                    </button>
                  )}
                  {isPaused && (
                    <button
                      onClick={handleResume}
                      title="Reprendre"
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
                    >
                      <Play size={20} className="text-purple-600 ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Stop */}
                <button
                  onClick={handleStop}
                  title="Arreter"
                  disabled={isIdle}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Square size={14} className="text-white fill-white" />
                </button>

                {/* Replay */}
                <button
                  onClick={handleReplay}
                  title="Recommencer depuis le debut"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all flex-shrink-0"
                >
                  <SkipBack size={16} className="text-white" />
                </button>

                {/* Speed selector */}
                <div className="ml-auto flex items-center gap-1 bg-white/15 rounded-full p-1">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        speed === s
                          ? "bg-white text-purple-700"
                          : "text-white/70 hover:text-white hover:bg-white/20"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Status line */}
              <p className="text-white/50 text-xs mt-3">
                {isIdle && playCount === 0 && "Appuyez sur ▶ pour ecouter en francais"}
                {isIdle && playCount > 0 && `Ecoute ${playCount} fois — Relancer avec ▶`}
                {isPlaying && "Lecture en cours..."}
                {isPaused && "En pause — Appuyez sur ▶ pour reprendre"}
              </p>
            </CardBody>
          </Card>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-surface-300 dark:border-surface-600 text-surface-500 hover:border-primary-400 hover:text-primary-600 transition-all text-sm font-medium"
          >
            <FileText size={16} />
            {showTranscript ? "Masquer la transcription" : "Afficher la transcription"}
            <ChevronDown
              size={16}
              className={`ml-auto transition-transform ${showTranscript ? "rotate-180" : ""}`}
            />
          </button>

          {showTranscript && (
            <Card className="bg-surface-50 dark:bg-surface-800/50 border-dashed border-surface-300 dark:border-surface-600">
              <CardBody>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                  Transcription
                </p>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed italic">
                  {selected.transcript}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Questions */}
          <div className="space-y-5">
            {selected.questions.map((q, qIdx) => (
              <Card key={q.id}>
                <CardBody>
                  <p className="font-semibold text-surface-900 dark:text-white mb-4">
                    <span className="text-primary-500 mr-2">{qIdx + 1}.</span>
                    {q.question}
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
                        <span className="font-bold text-surface-400 mr-3">
                          {["A", "B", "C", "D"][aIdx]}.
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { cancelSpeech(); setTtsState("idle"); setStage("list"); }}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleSubmit}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Soumettre mes reponses
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
