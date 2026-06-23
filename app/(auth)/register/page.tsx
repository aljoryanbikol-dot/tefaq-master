"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import type { CEFRLevel } from "@/types";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    currentLevel: "A2" as CEFRLevel,
    targetLevel: "B2" as CEFRLevel,
  });

  const updateForm = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (error) throw error;
      if (data.user) {
        const profile = {
          id: data.user.id,
          email: form.email,
          full_name: form.fullName,
          plan: "free" as const,
          current_level: form.currentLevel,
          target_level: form.targetLevel,
          daily_goal: 5,
          streak_days: 0,
          total_xp: 0,
        };
        await supabase.from("profiles").insert([profile]);
        setUser({ ...profile, created_at: new Date().toISOString() });
        toast.success("Compte cree ! Bienvenue !");
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent-600 via-primary-700 to-primary-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white" style={{ width: `${(i + 1) * 140}px`, height: `${(i + 1) * 140}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          ))}
        </div>
        <Link href="/" className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-display font-bold text-xl text-white">TEFAQ Master</span>
        </Link>
        <div className="relative">
          <div className="text-white/60 font-semibold text-sm uppercase tracking-wide mb-4">Pourquoi nous choisir</div>
          <div className="space-y-4">
            {["Evaluation IA precise de vos 4 competences", "Feedback instantane et personnalise", "Exercices adaptes a votre niveau CECR", "Progression mesurable et motivante"].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white">{i + 1}</div>
                <p className="text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm relative">Inscription gratuite en moins de 2 minutes</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? "bg-primary-600" : "bg-surface-200 dark:bg-surface-700"}`} />
            ))}
          </div>

          <h1 className="font-display font-bold text-3xl text-surface-900 dark:text-white mb-2">
            {step === 1 ? "Creer votre compte" : "Votre profil linguistique"}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            {step === 1 ? "Commencez gratuitement, sans carte de credit." : "Dites-nous ou vous en etes pour personnaliser votre apprentissage."}
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {step === 1 ? (
              <>
                <Input label="Nom complet" type="text" placeholder="Marie Tremblay" value={form.fullName} onChange={(e) => updateForm("fullName", e.target.value)} icon={<User size={16} />} required />
                <Input label="Adresse email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} icon={<Mail size={16} />} required />
                <Input label="Mot de passe" type="password" placeholder="Au moins 8 caracteres" value={form.password} onChange={(e) => updateForm("password", e.target.value)} icon={<Lock size={16} />} required hint="Minimum 8 caracteres" />
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Votre niveau actuel</label>
                  <div className="grid grid-cols-5 gap-2">
                    {LEVELS.map((l) => (
                      <button key={l} type="button" onClick={() => updateForm("currentLevel", l)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all ${form.currentLevel === l ? "bg-primary-600 text-white shadow-glow" : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Niveau vise pour le TEFAQ</label>
                  <div className="grid grid-cols-5 gap-2">
                    {LEVELS.map((l) => (
                      <button key={l} type="button" onClick={() => updateForm("targetLevel", l)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all ${form.targetLevel === l ? "bg-accent-500 text-white" : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-primary-50 dark:bg-primary-950/40 rounded-xl border border-primary-100 dark:border-primary-900/30">
                  <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                    Votre parcours sera adapte pour vous faire progresser de <strong>{form.currentLevel}</strong> vers <strong>{form.targetLevel}</strong>.
                  </p>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<ArrowRight size={18} />} iconPosition="right">
              {step === 1 ? "Continuer" : "Creer mon compte"}
            </Button>
          </form>

          {step === 2 && (
            <button onClick={() => setStep(1)} className="w-full mt-3 py-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
              Retour
            </button>
          )}

          <p className="text-center mt-6 text-sm text-surface-500 dark:text-surface-400">
            Deja inscrit ?{" "}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
