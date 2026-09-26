-- ================================================================
-- MINTZAKATS: Datu-Basearen Eskema Ofiziala (Supabase SQL)
-- Exekutatu script hau zure Supabase Proiektuko SQL Editor-ean
-- ================================================================

-- 1. Partiden taula (Partida guztiak, puntuazioak, denborak eta eguneko blokeoa)
CREATE TABLE IF NOT EXISTS public.partidak (
    id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    date_str TEXT NOT NULL,
    week_monday_str TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 20,
    time_seconds NUMERIC(7, 2) NOT NULL DEFAULT 0,
    completed_at BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- 'started' edo 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_player_daily_game UNIQUE (player_id, date_str)
);

-- Indizeak sailkapen azkarretarako
CREATE INDEX IF NOT EXISTS idx_partidak_date_score ON public.partidak(date_str, score DESC, time_seconds ASC);
CREATE INDEX IF NOT EXISTS idx_partidak_week ON public.partidak(week_monday_str);
CREATE INDEX IF NOT EXISTS idx_partidak_player ON public.partidak(player_id);

-- 2. Jokalariaren egoera (Racha, azken partida eta azken partidako akatsak)
CREATE TABLE IF NOT EXISTS public.jokalari_egoera (
    player_id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    streak INTEGER NOT NULL DEFAULT 0,
    last_played_date TEXT,
    last_game_mistakes JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) gaitzea
ALTER TABLE public.partidak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jokalari_egoera ENABLE ROW LEVEL SECURITY;

-- 4. Politika seguruak aplikazioak irakurri eta idatzi ahal izateko (anon eta authenticated)
DROP POLICY IF EXISTS "Irakurketa librea partidak" ON public.partidak;
CREATE POLICY "Irakurketa librea partidak"
ON public.partidak FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Idazketa baimendua partidak" ON public.partidak;
CREATE POLICY "Idazketa baimendua partidak"
ON public.partidak FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Irakurketa librea jokalari_egoera" ON public.jokalari_egoera;
CREATE POLICY "Irakurketa librea jokalari_egoera"
ON public.jokalari_egoera FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Idazketa baimendua jokalari_egoera" ON public.jokalari_egoera;
CREATE POLICY "Idazketa baimendua jokalari_egoera"
ON public.jokalari_egoera FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
