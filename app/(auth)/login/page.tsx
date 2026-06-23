"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import type { User } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const createMockUser = (): User => ({
    id: "demo-user",
    email: "demo@tefaqmaster.ca",
    full_name: "Utilisateur Démo",
    plan: "premium",
    current_level: "B1",
    target_level: "B2",
    daily_goal: 10,
    streak_days: 7,
    total_xp: 1240,
    created_at: new Date().toISOString(),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        if (profile) { setUser(profile as User); toast.success("Bienvenue !"); router.push("/dashboard"); }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de connexion";
      toast.error(msg.includes("Invalid") ? "Email ou mot de passe incorrect" : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser(createMockUser());
    toast.success("Mode demo actif!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white" style={{ width: `${(i + 1) * 140}px`, height: `${(i + 1) * 140}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          ))}
        </div>
        <Link href="/" className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-display font-bold text-xl text-white">TEFAQ Master</span>
        </Link>
        <div className="relative">
          <h2 className="font-display font-bold text-4xl text-white mb-6 leading-tight">
            Preparez-vous au TEFAQ avec l'IA
          </h2>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Evaluez vos 4 competences linguistiques et obtenez votre niveau CECR en temps reel.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[{ emoji: "📖", label: "Comprehension ecrite" }, { emoji: "🎧", label: "Comprehension orale" }, { emoji: "🎤", label: "Expression orale" }, { emoji: "✍️", label: "Expression ecrite" }].map((m) => (
              <div key={m.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-white/90 text-sm font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm relative">Plus de 10 000 candidats prepares avec succes</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-display font-bold text-xl text-surface-900 dark:text-white">TEFAQ Master</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-surface-900 dark:text-white mb-2">Bon retour !</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">Connectez-vous pour continuer votre preparation.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input label="Adresse email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} required />
            <div className="relative">
              <Input label="Mot de passe" type={showPw ? "text" : "password"} placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-surface-400 hover:text-surface-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">Mot de passe oublie ?</Link>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<ArrowRight size={18} />} iconPosition="right">Se connecter</Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200 dark:border-surface-700" /></div>
            <div className="relative flex justify-center text-xs text-surface-400 uppercase font-semibold"><span className="bg-surface-50 dark:bg-surface-950 px-3">ou</span></div>
          </div>

          <Button variant="secondary" className="w-full" size="lg" onClick={handleDemoLogin}>🎮 Essayer en mode demo</Button>

          <p className="text-center mt-6 text-sm text-surface-500 dark:text-surface-400">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Creer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
