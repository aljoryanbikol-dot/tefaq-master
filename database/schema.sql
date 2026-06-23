-- =============================================
-- TEFAQ Master - PostgreSQL Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  current_level TEXT NOT NULL DEFAULT 'A2' CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  target_level TEXT NOT NULL DEFAULT 'B2' CHECK (target_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  daily_goal INTEGER NOT NULL DEFAULT 5,
  streak_days INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND plan = 'premium'
    )
  );

-- =============================================
-- READING EXERCISES
-- =============================================
CREATE TABLE IF NOT EXISTS public.reading_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  text TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  time_limit INTEGER, -- in seconds
  topic TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reading_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reading exercises" ON public.reading_exercises
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage reading exercises" ON public.reading_exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan = 'premium')
  );

-- =============================================
-- LISTENING EXERCISES
-- =============================================
CREATE TABLE IF NOT EXISTS public.listening_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  audio_url TEXT NOT NULL,
  transcript TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  duration INTEGER NOT NULL, -- in seconds
  topic TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.listening_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listening exercises" ON public.listening_exercises
  FOR SELECT USING (is_active = true);

-- =============================================
-- SPEAKING PROMPTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.speaking_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  prompt TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 120, -- in seconds
  topic TEXT NOT NULL,
  example_response TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.speaking_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active speaking prompts" ON public.speaking_prompts
  FOR SELECT USING (is_active = true);

-- =============================================
-- WRITING PROMPTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.writing_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  prompt TEXT NOT NULL,
  word_count_min INTEGER NOT NULL DEFAULT 60,
  word_count_max INTEGER NOT NULL DEFAULT 250,
  topic TEXT NOT NULL,
  example_response TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.writing_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active writing prompts" ON public.writing_prompts
  FOR SELECT USING (is_active = true);

-- =============================================
-- USER PROGRESS
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN ('reading', 'listening', 'speaking', 'writing')),
  exercise_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  time_spent INTEGER NOT NULL DEFAULT 0, -- in seconds
  details JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_module ON public.user_progress(module);
CREATE INDEX idx_user_progress_completed_at ON public.user_progress(completed_at);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- DAILY USAGE TRACKING (for free plan limits)
-- =============================================
CREATE TABLE IF NOT EXISTS public.daily_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  exercises_completed INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily usage" ON public.daily_usage
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reading_exercises_updated_at
  BEFORE UPDATE ON public.reading_exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update streak on progress insert
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
BEGIN
  SELECT last_activity_date INTO last_date
  FROM public.profiles WHERE id = NEW.user_id;

  IF last_date IS NULL OR last_date < CURRENT_DATE - INTERVAL '1 day' THEN
    IF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
      UPDATE public.profiles SET
        streak_days = streak_days + 1,
        last_activity_date = CURRENT_DATE,
        total_xp = total_xp + NEW.score / 2
      WHERE id = NEW.user_id;
    ELSE
      UPDATE public.profiles SET
        streak_days = 1,
        last_activity_date = CURRENT_DATE,
        total_xp = total_xp + NEW.score / 2
      WHERE id = NEW.user_id;
    END IF;
  ELSE
    UPDATE public.profiles SET
      total_xp = total_xp + NEW.score / 2
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_progress_inserted
  AFTER INSERT ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_streak();

-- =============================================
-- SEED DATA - Reading Exercises (A2)
-- =============================================
INSERT INTO public.reading_exercises (title, level, topic, text, questions) VALUES
(
  'La vie quotidienne à Montréal',
  'A2',
  'Vie urbaine',
  'Montréal est une grande ville du Québec, au Canada. C''est une ville bilingue où les gens parlent français et anglais. Environ 4 millions de personnes habitent dans la région de Montréal.

La ville est connue pour ses festivals, notamment le Festival International de Jazz de Montréal qui attire des musiciens du monde entier chaque été. Les Montréalais aiment aussi le Festival Juste pour Rire, un festival de comédie très populaire.

Dans les quartiers de Montréal, on trouve beaucoup de restaurants, de cafés et de boutiques. Le Vieux-Montréal est un quartier historique avec des bâtiments anciens et des rues pavées. C''est un endroit très touristique.

Les transports en commun à Montréal sont bien développés. Le métro, les autobus et les pistes cyclables permettent aux habitants de se déplacer facilement dans la ville.',
  '[
    {"id": "q1", "question": "Combien de personnes habitent dans la région de Montréal ?", "options": ["Environ 1 million", "Environ 2 millions", "Environ 4 millions", "Environ 6 millions"], "correct_answer": 2, "explanation": "Le texte dit ''Environ 4 millions de personnes habitent dans la région de Montréal.''"}, 
    {"id": "q2", "question": "Qu''est-ce que le Festival Juste pour Rire ?", "options": ["Un festival de musique", "Un festival de comédie", "Un festival de cinéma", "Un festival de danse"], "correct_answer": 1, "explanation": "Le texte mentionne que c''est ''un festival de comédie très populaire''."},
    {"id": "q3", "question": "Comment se caractérise le Vieux-Montréal ?", "options": ["C''est un quartier moderne", "C''est un quartier résidentiel", "C''est un quartier historique", "C''est un quartier industriel"], "correct_answer": 2, "explanation": "Le texte décrit le Vieux-Montréal comme ''un quartier historique avec des bâtiments anciens''."},
    {"id": "q4", "question": "Quel moyen de transport les Montréalais utilisent-ils beaucoup en été ?", "options": ["La voiture", "Le train", "Le vélo", "Le taxi"], "correct_answer": 2, "explanation": "Le texte précise ''Beaucoup de Montréalais utilisent le vélo, surtout en été.''"}
  ]'::JSONB
);

-- =============================================
-- SEED DATA - Speaking Prompts
-- =============================================
INSERT INTO public.speaking_prompts (level, prompt, duration, topic) VALUES
('A1', 'Présentez-vous : donnez votre nom, votre âge, votre pays d''origine et votre profession. (Parlez pendant environ 1 minute)', 60, 'Présentation personnelle'),
('A2', 'Parlez de votre routine quotidienne. Que faites-vous le matin, l''après-midi et le soir ? (Parlez pendant environ 2 minutes)', 120, 'Vie quotidienne'),
('B1', 'Décrivez un événement culturel important dans votre pays d''origine. (Parlez pendant environ 3 minutes)', 180, 'Culture et traditions'),
('B2', 'Quels sont les avantages et les inconvénients du télétravail ? Donnez votre opinion. (Parlez pendant environ 4 minutes)', 240, 'Travail et société'),
('C1', 'Analysez les défis de l''intégration des immigrants dans la société québécoise et proposez des solutions. (Parlez pendant environ 5 minutes)', 300, 'Société et immigration');

-- =============================================
-- SEED DATA - Writing Prompts
-- =============================================
INSERT INTO public.writing_prompts (level, prompt, word_count_min, word_count_max, topic) VALUES
('A2', 'Vous voulez inviter un ami québécois à votre anniversaire. Écrivez-lui un message pour l''inviter. Donnez les informations importantes : la date, l''heure, le lieu et ce que vous ferez ensemble.', 60, 120, 'Communication informelle'),
('B1', 'Vous avez récemment assisté à un événement culturel à Montréal. Décrivez cet événement et recommandez-le (ou non) à d''autres personnes.', 150, 250, 'Vie culturelle'),
('B2', 'La ville de Montréal envisage d''interdire les voitures dans le centre-ville les fins de semaine. Rédigez une lettre à la mairie pour exprimer votre opinion sur cette mesure.', 250, 400, 'Vie urbaine et environnement'),
('C1', 'Selon vous, la mondialisation représente-t-elle une menace ou une opportunité pour les cultures locales comme la culture québécoise ? Développez votre argumentation avec des exemples précis.', 400, 600, 'Mondialisation et culture');

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
