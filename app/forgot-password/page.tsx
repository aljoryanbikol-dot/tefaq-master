"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      // Demo mode
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="font-display font-bold text-xl text-surface-900 dark:text-white">TEFAQ Master</span>
        </div>

        {!sent ? (
          <>
            <h1 className="font-display font-bold text-3xl text-surface-900 dark:text-white mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mb-8">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                required
              />
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Envoyer le lien de réinitialisation
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-950/40 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-3">
              Email envoyé !
            </h1>
            <p className="text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
              Si un compte est associé à <strong>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
            </p>
            <p className="text-xs text-surface-400 mb-6">
              Vérifiez aussi votre dossier de courrier indésirable.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
