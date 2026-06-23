"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { BookOpen, Headphones, Mic, PenLine, CheckCircle, ArrowRight, Star, Zap, Crown } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-display font-bold text-xl text-surface-900 dark:text-white">TEFAQ Master</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors px-3 py-1.5">
              Connexion
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
              Commencer <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-950/20 dark:via-surface-950 dark:to-accent-950/20 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold mb-8">
            <Zap size={14} className="text-accent-500" />
            Propulsé par l&apos;intelligence artificielle GPT-4
          </div>

          <h1 className="font-display font-bold text-5xl lg:text-7xl text-surface-900 dark:text-white mb-6 leading-tight">
            Réussissez le{" "}
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">TEFAQ</span>{" "}
            avec confiance
          </h1>

          <p className="text-xl text-surface-600 dark:text-surface-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            La plateforme de préparation au TEFAQ qui évalue votre niveau en temps réel, identifie vos lacunes et crée un parcours personnalisé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl transition-all shadow-glow hover:shadow-glow-lg">
              Essai gratuit <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 text-lg font-bold rounded-2xl hover:border-primary-400 hover:text-primary-600 transition-all">
              Se connecter
            </Link>
          </div>
          <p className="mt-6 text-sm text-surface-400 dark:text-surface-500">
            ✓ Aucune carte requise &nbsp;·&nbsp; ✓ 5 exercices gratuits/jour &nbsp;·&nbsp; ✓ Annulez à tout moment
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl overflow-hidden bg-white dark:bg-surface-900">
            <div className="bg-surface-100 dark:bg-surface-800 px-4 py-3 flex items-center gap-2 border-b border-surface-200 dark:border-surface-700">
              <div className="w-3 h-3 rounded-full bg-danger-400" />
              <div className="w-3 h-3 rounded-full bg-warning-400" />
              <div className="w-3 h-3 rounded-full bg-success-400" />
              <div className="flex-1 mx-4 bg-white dark:bg-surface-700 rounded-lg px-3 py-1 text-xs text-surface-400">tefaqmaster.ca/dashboard</div>
            </div>
            <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Compréhension écrite", score: 78, color: "from-blue-500 to-cyan-400", icon: "📖" },
                { label: "Compréhension orale", score: 65, color: "from-purple-500 to-pink-400", icon: "🎧" },
                { label: "Expression orale", score: 82, color: "from-orange-500 to-red-400", icon: "🎤" },
                { label: "Expression écrite", score: 71, color: "from-green-500 to-teal-400", icon: "✍️" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl p-4 bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-lg mb-3`}>{m.icon}</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mb-1">{m.label}</div>
                  <div className="text-2xl font-bold text-surface-900 dark:text-white">{m.score}<span className="text-sm text-surface-400">/100</span></div>
                  <div className="mt-2 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${m.color} rounded-full`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 p-4 text-white flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium opacity-80">Niveau CECR estimé</div>
                  <div className="text-3xl font-display font-bold mt-1">B1</div>
                  <div className="text-sm opacity-70 mt-0.5">Intermédiaire</div>
                </div>
                <div className="text-6xl opacity-20 font-display font-black">B1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-surface-900 dark:text-white mb-4">Les 4 compétences du TEFAQ</h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg max-w-2xl mx-auto">Chaque module simule fidèlement les conditions de l&apos;examen réel avec un feedback IA détaillé.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <BookOpen size={28} />, color: "from-blue-500 to-cyan-400", bg: "bg-blue-50 dark:bg-blue-950/30", title: "Compréhension écrite", desc: "Textes authentiques québécois, questions à choix multiples, minuterie et correction automatique. Niveaux A1 à C1.", features: ["Textes TEFAQ authentiques", "Score instantané", "Explications détaillées", "Difficulté adaptative"] },
              { icon: <Headphones size={28} />, color: "from-purple-500 to-pink-400", bg: "bg-purple-50 dark:bg-purple-950/30", title: "Compréhension orale", desc: "Enregistrements audio en français québécois avec contrôles de lecture et questions de compréhension.", features: ["Audio français québécois", "Contrôles de lecture", "Transcription disponible", "5 niveaux CECR"] },
              { icon: <Mic size={28} />, color: "from-orange-500 to-red-400", bg: "bg-orange-50 dark:bg-orange-950/30", title: "Expression orale", desc: "Enregistrez votre réponse, obtenez une transcription automatique et une évaluation IA sur 5 critères.", features: ["Reconnaissance vocale", "Score prononciation", "Analyse de fluidité", "Recommandations IA"] },
              { icon: <PenLine size={28} />, color: "from-green-500 to-teal-400", bg: "bg-green-50 dark:bg-green-950/30", title: "Expression écrite", desc: "Rédigez vos textes et recevez des corrections grammaticales, suggestions de vocabulaire et estimation de niveau.", features: ["Correction grammaticale IA", "Enrichissement vocabulaire", "Estimation CECR", "Conseils de structure"] },
            ].map((mod) => (
              <div key={mod.title} className={`rounded-2xl p-6 border border-surface-200 dark:border-surface-700 ${mod.bg} group hover:shadow-lg transition-all duration-300`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform`}>{mod.icon}</div>
                <h3 className="font-display font-bold text-xl text-surface-900 dark:text-white mb-2">{mod.title}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 leading-relaxed">{mod.desc}</p>
                <ul className="space-y-2">
                  {mod.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
                      <CheckCircle size={15} className="text-success-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "10 000+", label: "Apprenants actifs" },
            { value: "95%", label: "Taux de réussite TEFAQ" },
            { value: "A1–C1", label: "Niveaux couverts" },
            { value: "4.9/5", label: "Satisfaction utilisateurs" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display font-black text-4xl text-primary-600 dark:text-primary-400 mb-2">{s.value}</div>
              <div className="text-surface-500 dark:text-surface-400 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-surface-900 dark:text-white mb-4">Tarifs simples et transparents</h2>
            <p className="text-surface-500 dark:text-surface-400 text-lg">Commencez gratuitement, évoluez quand vous êtes prêt.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-8">
              <div className="text-surface-500 dark:text-surface-400 font-semibold mb-2">Gratuit</div>
              <div className="font-display font-black text-5xl text-surface-900 dark:text-white mb-1">0 $</div>
              <div className="text-surface-400 text-sm mb-8">Pour toujours</div>
              <ul className="space-y-3 mb-8">
                {["5 exercices par jour", "Tous les modules", "Score automatique", "Suivi de progression basique"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                    <CheckCircle size={16} className="text-success-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center px-6 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
                Commencer gratuitement
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-primary-500 bg-gradient-to-br from-primary-600 to-accent-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">POPULAIRE</span>
              </div>
              <div className="flex items-center gap-2 font-semibold mb-2 opacity-90"><Crown size={16} /> Premium</div>
              <div className="font-display font-black text-5xl mb-1">29 $</div>
              <div className="opacity-70 text-sm mb-8">par mois · Annulez à tout moment</div>
              <ul className="space-y-3 mb-8">
                {["Exercices illimités", "Analyse orale complète", "Examens blancs TEFAQ", "Rapports de progression", "Recommandations IA personnalisées", "Accès prioritaire aux nouveaux contenus"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-white/80" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register?plan=premium" className="block text-center px-6 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                Démarrer l&apos;essai Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-4xl text-surface-900 dark:text-white text-center mb-16">Ce que disent nos apprenants</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Amira B.", country: "🇲🇦 Maroc", level: "B2", text: "Grâce à TEFAQ Master, j'ai obtenu mon niveau B2 au premier essai. Les corrections IA de l'expression écrite sont incroyablement précises." },
              { name: "Carlos M.", country: "🇲🇽 Mexique", level: "C1", text: "La simulation d'examen oral est révolutionnaire. Le feedback sur ma prononciation québécoise m'a vraiment aidé à progresser rapidement." },
              { name: "Yuki T.", country: "🇯🇵 Japon", level: "B1", text: "Interface intuitive, exercices variés et feedback détaillé. C'est la meilleure application de préparation au TEFAQ que j'ai trouvée." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-6">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-accent-400 fill-accent-400" />)}</div>
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-sm">{t.name.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-surface-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-surface-400">{t.country} · Niveau {t.level} obtenu</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">Commencez votre préparation aujourd&apos;hui</h2>
          <p className="text-xl opacity-80 mb-10">Rejoignez des milliers de candidats qui se préparent au TEFAQ avec l&apos;IA.</p>
          <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 text-lg font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl">
            Créer mon compte gratuit <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-display font-bold text-surface-900 dark:text-white">TEFAQ Master</span>
          </div>
          <p className="text-sm text-surface-400">© 2024 TEFAQ Master. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm text-surface-400">
            <Link href="#" className="hover:text-surface-700 dark:hover:text-surface-200">Confidentialité</Link>
            <Link href="#" className="hover:text-surface-700 dark:hover:text-surface-200">Conditions</Link>
            <Link href="#" className="hover:text-surface-700 dark:hover:text-surface-200">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
