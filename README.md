# TEFAQ Master

**Plateforme de preparation au TEFAQ propulsee par l'IA**

> Preparez-vous au Test d'Evaluation du Francais pour l'Acces au Quebec avec un feedback GPT-4, une progression adaptative et un suivi de niveau CECR en temps reel.

---

## Fonctionnalites

- **Comprehension ecrite** — Textes authentiques quebecois + QCM + minuterie
- **Comprehension orale** — Audio + transcriptions + controles de lecture
- **Expression orale** — Enregistrement + transcription Whisper + evaluation IA sur 5 criteres
- **Expression ecrite** — Redaction + correction grammaticale + suggestions vocabulaire IA
- **Niveaux A1 a C1** — Exercices adaptatifs sur tout le spectre CECR
- **Tableau de bord** — Scores par module, serie quotidienne, XP, progression CECR
- **Mode gratuit/premium** — 5 exercices/jour gratuits, illimites en premium

---

## Stack technique

- **Next.js 15** (App Router + TypeScript)
- **Tailwind CSS v4** (theme custom, dark mode)
- **Supabase** (Auth + PostgreSQL + RLS)
- **OpenAI API** (GPT-4o-mini + Whisper)
- **Zustand** (state management)
- **react-hot-toast** (notifications)

---

## Installation

### 1. Cloner et installer

```bash
git clone https://github.com/votrecompte/tefaq-master
cd tefaq-master
npm install
```

### 2. Variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
```

### 3. Base de donnees Supabase

1. Creez un projet sur [supabase.com](https://supabase.com)
2. Executez `database/schema.sql` dans l'editeur SQL
3. Activez l'authentification par email

### 4. Lancer

```bash
npm run dev
# http://localhost:3000
```

---

## Mode demo (sans Supabase)

Cliquez sur **"Essayer en mode demo"** sur la page de connexion. Un utilisateur fictif Premium est cree localement — aucune configuration requise.

---

## Deploiement sur Vercel

```bash
npm i -g vercel
vercel deploy
```

Configurez les variables d'environnement dans le tableau de bord Vercel.

---

## Structure

```
app/
  (auth)/login        — Connexion
  (auth)/register     — Inscription (2 etapes)
  dashboard/          — Tableau de bord
  dashboard/progress  — Progression CECR
  dashboard/settings  — Parametres utilisateur
  reading/            — Comprehension ecrite
  listening/          — Comprehension orale
  speaking/           — Expression orale (Premium)
  writing/            — Expression ecrite
  admin/              — Panneau admin
  api/writing/evaluate  — API correction ecrite
  api/speaking/evaluate — API evaluation orale
components/
  ui/                 — Button, Card, Badge, Input, ProgressBar, ScoreCircle
  shared/             — AppLayout, Sidebar, TopBar, Timer
lib/
  openai.ts           — Evaluation IA (GPT-4 + Whisper)
  supabase.ts         — Client Supabase
  store.ts            — Zustand (auth, theme)
  sample-data.ts      — Exercices demo
  utils.ts            — Helpers
database/
  schema.sql          — Schema PostgreSQL + RLS + triggers
types/index.ts        — Types TypeScript
```

---

## Scripts

```bash
npm run dev      # Dev (localhost:3000)
npm run build    # Build production
npm run start    # Production
npm run lint     # ESLint
npx tsc --noEmit # Verif TypeScript
```

---

## Licence

MIT
