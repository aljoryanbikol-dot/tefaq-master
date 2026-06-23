"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/shared/AppLayout";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LevelBadge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import {
  User, Bell, Moon, Sun, Shield, CreditCard,
  Save, LogOut, Trash2, Globe, Target
} from "lucide-react";
import toast from "react-hot-toast";
import type { CEFRLevel } from "@/types";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    current_level: user?.current_level || "B1" as CEFRLevel,
    target_level: user?.target_level || "B2" as CEFRLevel,
    daily_goal: user?.daily_goal || 5,
  });

  const [notifPrefs, setNotifPrefs] = useState({
    daily_reminder: true,
    streak_alert: true,
    weekly_report: false,
    new_content: true,
  });

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.full_name,
          current_level: profileForm.current_level,
          target_level: profileForm.target_level,
          daily_goal: profileForm.daily_goal,
        })
        .eq("id", user.id);

      if (error) throw error;
      setUser({ ...user, ...profileForm });
      toast.success("Profil mis à jour avec succès !");
    } catch {
      // Demo mode - update local state only
      setUser({ ...user, ...profileForm });
      toast.success("Profil mis à jour (mode démo)");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push("/");
  };

  const sections = [
    { key: "profile", label: "Profil", icon: User },
    { key: "learning", label: "Apprentissage", icon: Target },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "appearance", label: "Apparence", icon: Moon },
    { key: "account", label: "Compte", icon: Shield },
  ];

  return (
    <AppLayout title="Paramètres">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-surface-900 dark:text-white mb-1">Paramètres</h2>
          <p className="text-surface-500 dark:text-surface-400 text-sm">Gérez votre profil et vos préférences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="p-2">
                <nav className="space-y-1">
                  {sections.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setActiveSection(s.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                          activeSection === s.key
                            ? "bg-primary-600 text-white"
                            : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                        }`}
                      >
                        <Icon size={16} />
                        {s.label}
                      </button>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-5">
            {/* Profile section */}
            {activeSection === "profile" && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                    <User size={18} className="text-primary-500" /> Informations personnelles
                  </h3>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-100 dark:border-surface-700">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold text-2xl">
                      {profileForm.full_name.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">{profileForm.full_name}</p>
                      <p className="text-sm text-surface-500">{profileForm.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <LevelBadge level={profileForm.current_level} size="sm" />
                        {user?.plan === "premium" && (
                          <span className="text-xs px-2 py-0.5 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full font-semibold">Premium</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Nom complet"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                      icon={<User size={16} />}
                    />
                    <Input
                      label="Adresse email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                      icon={<Globe size={16} />}
                      hint="La modification d'email nécessite une vérification"
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={saveProfile} loading={saving} icon={<Save size={16} />}>
                      Sauvegarder
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Learning section */}
            {activeSection === "learning" && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                    <Target size={18} className="text-primary-500" /> Objectifs d'apprentissage
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Niveau actuel</label>
                      <div className="grid grid-cols-5 gap-2">
                        {LEVELS.map((l) => (
                          <button key={l} type="button" onClick={() => setProfileForm((f) => ({ ...f, current_level: l }))}
                            className={`py-3 rounded-xl font-bold text-sm transition-all ${profileForm.current_level === l ? "bg-primary-600 text-white shadow-glow" : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200"}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Niveau visé</label>
                      <div className="grid grid-cols-5 gap-2">
                        {LEVELS.map((l) => (
                          <button key={l} type="button" onClick={() => setProfileForm((f) => ({ ...f, target_level: l }))}
                            className={`py-3 rounded-xl font-bold text-sm transition-all ${profileForm.target_level === l ? "bg-accent-500 text-white" : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200"}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
                        Objectif quotidien : <span className="text-primary-600">{profileForm.daily_goal} exercices/jour</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={profileForm.daily_goal}
                        onChange={(e) => setProfileForm((f) => ({ ...f, daily_goal: parseInt(e.target.value) }))}
                        className="w-full accent-primary-600"
                      />
                      <div className="flex justify-between text-xs text-surface-400 mt-1">
                        <span>1</span><span>20</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={saveProfile} loading={saving} icon={<Save size={16} />}>
                      Sauvegarder
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Notifications section */}
            {activeSection === "notifications" && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                    <Bell size={18} className="text-primary-500" /> Préférences de notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: "daily_reminder", label: "Rappel quotidien", desc: "Recevez un rappel pour votre session d'apprentissage" },
                      { key: "streak_alert", label: "Alerte de série", desc: "Soyez prévenu si vous êtes sur le point de perdre votre série" },
                      { key: "weekly_report", label: "Rapport hebdomadaire", desc: "Résumé de votre progression chaque semaine" },
                      { key: "new_content", label: "Nouveaux contenus", desc: "Notification quand de nouveaux exercices sont disponibles" },
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white text-sm">{n.label}</p>
                          <p className="text-xs text-surface-500 mt-0.5">{n.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifPrefs((p) => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                          className={`w-11 h-6 rounded-full transition-all relative ${notifPrefs[n.key as keyof typeof notifPrefs] ? "bg-primary-500" : "bg-surface-300 dark:bg-surface-600"}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-all ${notifPrefs[n.key as keyof typeof notifPrefs] ? "left-6" : "left-1"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => toast.success("Préférences sauvegardées !")} icon={<Save size={16} />}>
                      Sauvegarder
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Appearance section */}
            {activeSection === "appearance" && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                    <Moon size={18} className="text-primary-500" /> Apparence
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setDarkMode(false)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${!darkMode ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30" : "border-surface-200 dark:border-surface-700"}`}
                      >
                        <Sun size={24} className="text-warning-500 mb-2" />
                        <p className="font-semibold text-sm text-surface-900 dark:text-white">Mode clair</p>
                        <p className="text-xs text-surface-500 mt-0.5">Interface claire et lumineuse</p>
                      </button>
                      <button
                        onClick={() => setDarkMode(true)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${darkMode ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30" : "border-surface-200 dark:border-surface-700"}`}
                      >
                        <Moon size={24} className="text-primary-500 mb-2" />
                        <p className="font-semibold text-sm text-surface-900 dark:text-white">Mode sombre</p>
                        <p className="text-xs text-surface-500 mt-0.5">Interface sombre pour les yeux</p>
                      </button>
                    </div>
                    <p className="text-xs text-surface-400 text-center">Le mode sombre est géré par votre système ou via le bouton dans la barre du haut.</p>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Account section */}
            {activeSection === "account" && (
              <div className="space-y-5">
                {/* Plan info */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                      <CreditCard size={18} className="text-primary-500" /> Abonnement
                    </h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/20 dark:to-accent-950/20 border border-primary-100 dark:border-primary-900/30">
                      <div>
                        <p className="font-semibold text-surface-900 dark:text-white capitalize">Plan {user?.plan}</p>
                        <p className="text-sm text-surface-500">
                          {user?.plan === "free" ? "5 exercices par jour" : "Exercices illimités + toutes les fonctionnalités"}
                        </p>
                      </div>
                      {user?.plan === "free" && (
                        <Button size="sm" className="bg-accent-500 hover:bg-accent-600 flex-shrink-0">
                          Passer à Premium
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Security */}
                <Card>
                  <CardBody className="p-6">
                    <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-primary-500" /> Sécurité
                    </h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" icon={<Shield size={16} />}>
                        Changer le mot de passe
                      </Button>
                      <Button variant="outline" className="w-full justify-start" icon={<LogOut size={16} />} onClick={handleLogout}>
                        Se déconnecter
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                {/* Danger zone */}
                <Card className="border-danger-200 dark:border-danger-900/30">
                  <CardBody className="p-6">
                    <h3 className="font-semibold text-danger-600 dark:text-danger-400 mb-3 flex items-center gap-2">
                      <Trash2 size={18} /> Zone de danger
                    </h3>
                    <p className="text-sm text-surface-500 mb-4">
                      La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => toast.error("Contactez le support pour supprimer votre compte.")}
                    >
                      Supprimer mon compte
                    </Button>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
