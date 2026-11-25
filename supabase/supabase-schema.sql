-- ==============================================================================
-- PT. CANDI OXYGEN - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Jalankan skrip SQL ini pada SQL Editor di dashboard Supabase Anda
-- (https://app.supabase.com -> Project Anda -> SQL Editor)

-- 1. Tabel Pesan Kontak Masuk (contact_messages)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Permintaan Penawaran Resmi / RFQ (quote_requests)
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    client_type TEXT,
    category TEXT,
    selected_items TEXT[],
    estimated_volume TEXT,
    delivery_location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Pendaftaran Karir (career_applications)
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT NOT NULL,
    linkedin_url TEXT,
    portfolio_url TEXT,
    cover_letter TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- KEBIJAKAN KEAMANAN ROW LEVEL SECURITY (RLS)
-- Mengizinkan pengunjung anonim mengirim formulir (INSERT) secara aman
-- ==============================================================================

-- Aktifkan RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Kebijakan INSERT Publik Anonim
CREATE POLICY "Izinkan publik mengirim pesan kontak" 
ON public.contact_messages FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Izinkan klien mengirim permintaan penawaran resmi" 
ON public.quote_requests FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Izinkan pelamar mengirim lamaran karir" 
ON public.career_applications FOR INSERT 
TO anon 
WITH CHECK (true);
