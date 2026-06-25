"use client";
import { useState, useRef, useCallback } from "react";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/ui/Badge";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { sampleSpeakingPrompts } from "@/lib/sample-data";
import { Mic, Square, ArrowRight, Clock, Loader2, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import type { SpeakingPrompt, SpeakingEvaluation } from "@/types";

type Stage = "list" | "prep" | "recording" | "processing" | "results";

export default function SpeakingPage() {
  const [stage, setStage] = useState<Stage>("list");
  const [selected, setSelected] = useState<SpeakingPrompt | null>(null);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecorder.current = mr;
      setRecordingTime(0);
      setStage("recording");
      timer.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      toast.error("Acces au microphone refuse. Veuillez autoriser l'acces dans votre navigateur.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (timer.current) {
      clearInterval(timer.current);
    }
    setStage("processing");
    setTimeout(() => evaluateRecording(), 500);
  }, []);

  const evaluateRecording = async () => {
    if (!selected) return;
    try {
      // In production this calls /api/speaking/evaluate
      // For demo, we return a mock evaluation
      await new Promise((r) => setTimeout(r, 3000));
      const mockEval: SpeakingEvaluation = {
        overall_score: 72,
        cefr_level: "B1",
        pronunciation_score: 78,
        fluency_score: 68,
        grammar_score: 75,
        vocabulary_score: 70,
        coherence_score: 69,
        transcript: `Bonjour, je vais vous parler de ${selected.topic.toLowerCase()}. C'est un sujet tres interessant pour moi...`,
        feedback: "Votre expression orale demontre une bonne maitrise des structures de base. Votre prononciation est generalement claire et comprehensible. Vous faites preuve d'une certaine fluidite, bien que des hesitations soient encore presentes. Il est recommande de travailler sur la richesse du vocabulaire et la complexite grammaticale pour atteindre un niveau superieur.",
        strengths: ["Prononciation claire et comprehensible", "Bonne structure de base du discours", "Vocabulaire adapte au sujet"],
        weaknesses: ["Hesitations frequentes reduisant la fluidite", "Structures grammaticales repetitives", "Manque de connecteurs logiques"],
        suggestions: ["Ecoutez des podcasts en francais quebecois quotidiennement", "Pratiquez les connecteurs comme 'par consequent', 'en outre', 'cependant'", "Enregistrez-vous regulierement pour suivre votre progression"],
      };
      setEvaluation(mockEval);
      setStage("results");
    } catch {
      toast.error("Erreur lors de l'evaluation. Veuillez reessayer.");
      setStage("prep");
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (stage === "list") {
    return (
      <AppLayout title="Expression orale">
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">Expression orale</h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Enregistrez votre reponse et recevez une evaluation IA detaillee</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {sampleSpeakingPrompts.map((p) => (
              <Card key={p.id} hover onClick={() => { setSelected(p); setStage("prep"); }} className="group">
                <CardBody className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <LevelBadge level={p.level} />
                    <span className="text-xs text-surface-400 px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-full">{p.topic}</span>
                    <div className="ml-auto flex items-center gap-1 text-xs text-surface-400">
                      <Clock size={12} />{Math.floor(p.duration / 60)} min
                    </div>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed line-clamp-3">{p.prompt}</p>
                  <div className="flex items-center gap-1 mt-3 text-primary-600 dark:text-primary-400 text-xs font-semibold">
                    <Mic size={12} />Commencer cet exercice
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (stage === "prep" && selected) {
    return (
      <AppLayout title="Preparation">
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
          <div className="flex items-center gap-3">
            <LevelBadge level={selected.level} size="md" />
            <span className="text-sm text-surface-500 dark:text-surface-400">{selected.topic}</span>
          </div>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-900/30">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4 text-orange-700 dark:text-orange-400">
                <Mic size={18} />
                <span className="font-semibold text-sm">Sujet a traiter</span>
              </div>
              <p className="text-surface-900 dark:text-white leading-relaxed">{selected.prompt}</p>
              <div className="flex items-center gap-2 mt-4 text-surface-500 text-sm">
                <Clock size={14} />
                <span>Duree recommandee : {Math.floor(selected.duration / 60)} minutes</span>
              </div>
            </CardBody>
          </Card>

          {selected.example_response && (
            <Card>
              <CardBody>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Exemple de reponse (niveau {selected.level})</p>
                <p className="text-sm text-surface-600 dark:text-surface-400 italic leading-relaxed">{selected.example_response}</p>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Criteres d'evaluation</h3>
              <div className="space-y-2">
                {[
                  { label: "Prononciation", desc: "Clarte et qualite de la prononciation" },
                  { label: "Fluidite", desc: "Debit de parole et hesitations" },
                  { label: "Grammaire", desc: "Precision des structures grammaticales" },
                  { label: "Vocabulaire", desc: "Richesse et adequation du lexique" },
                  { label: "Coherence", desc: "Organisation et logique du discours" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={14} className="text-success-500 flex-shrink-0" />
                    <span className="font-medium text-surface-700 dark:text-surface-300">{c.label}</span>
                    <span className="text-surface-400 text-xs">— {c.desc}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStage("list")}>Retour</Button>
            <Button className="flex-1" size="lg" icon={<Mic size={18} />} onClick={startRecording}>
              Commencer l'enregistrement
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (stage === "recording" && selected) {
    return (
      <AppLayout title="Enregistrement en cours">
        <div className="max-w-xl mx-auto text-center space-y-8 animate-fade-in">
          <div>
            <div className="w-32 h-32 rounded-full bg-danger-500/10 flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-danger-500/20 animate-ping" />
              <div className="absolute inset-3 rounded-full bg-danger-500/20 animate-ping" style={{ animationDelay: "0.3s" }} />
              <div className="w-20 h-20 rounded-full bg-danger-500 flex items-center justify-center z-10 shadow-lg">
                <Mic size={32} className="text-white" />
              </div>
            </div>
            <div className="font-mono text-4xl font-bold text-surface-900 dark:text-white mb-2">{formatTime(recordingTime)}</div>
            <p className="text-surface-500 text-sm">Enregistrement en cours...</p>
          </div>

          <Card className="bg-surface-50 dark:bg-surface-800/50">
            <CardBody className="p-4">
              <p className="text-sm text-surface-600 dark:text-surface-300 italic text-left">{selected.prompt}</p>
            </CardBody>
          </Card>

          <div className="flex gap-3 justify-center">
            <Button variant="danger" size="lg" icon={<Square size={18} />} onClick={stopRecording}>
              Arreter l'enregistrement
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (stage === "processing") {
    return (
      <AppLayout title="Analyse en cours">
        <div className="max-w-xl mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center mx-auto mb-6">
            <Loader2 size={40} className="text-primary-600 animate-spin" />
          </div>
          <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-3">Analyse en cours...</h2>
          <p className="text-surface-500 text-sm leading-relaxed max-w-sm mx-auto">
            Notre IA analyse votre prononciation, votre fluidite, votre grammaire et votre vocabulaire. Cela prend environ 10 secondes.
          </p>
          <div className="mt-8 space-y-2 max-w-xs mx-auto">
            {["Transcription de l'audio", "Analyse grammaticale", "Evaluation de la fluidite", "Generation du feedback"].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Loader2 size={14} className="text-primary-500 animate-spin flex-shrink-0" />
                <span className="text-surface-500">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (stage === "results" && evaluation && selected) {
    return (
      <AppLayout title="Evaluation orale">
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          {/* Header */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Score global</p>
                  <div className="font-display font-black text-6xl">{evaluation.overall_score}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">Niveau {evaluation.cefr_level}</span>
                  </div>
                </div>
                <ScoreCircle score={evaluation.overall_score} size="lg" color="white" className="opacity-90" />
              </div>
            </div>
          </Card>

          {/* Scores */}
          <Card>
            <CardBody>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-500" /> Scores par critere
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "Prononciation", score: evaluation.pronunciation_score },
                  { label: "Fluidite", score: evaluation.fluency_score },
                  { label: "Grammaire", score: evaluation.grammar_score },
                  { label: "Vocabulaire", score: evaluation.vocabulary_score },
                  { label: "Coherence", score: evaluation.coherence_score },
                ].map((c) => (
                  <ScoreCircle key={c.label} score={c.score} label={c.label} size="sm" className="mx-auto" />
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Transcript */}
          <Card>
            <CardBody>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Transcription de votre reponse</p>
              <p className="text-sm text-surface-700 dark:text-surface-300 italic leading-relaxed">{evaluation.transcript}</p>
            </CardBody>
          </Card>

          {/* Feedback */}
          <Card>
            <CardBody>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">Evaluation detaillee</p>
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{evaluation.feedback}</p>
            </CardBody>
          </Card>

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

          {/* Suggestions */}
          <Card>
            <CardBody>
              <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">Conseils personnalises</p>
              <ul className="space-y-3">
                {evaluation.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary-600 dark:text-primary-400">{i + 1}</div>
                    <span className="text-sm text-surface-700 dark:text-surface-300">{s}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setSelected(selected); setStage("prep"); }}>
              Recommencer
            </Button>
            <Button className="flex-1" icon={<ArrowRight size={16} />} iconPosition="right" onClick={() => setStage("list")}>
              Autre exercice
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
