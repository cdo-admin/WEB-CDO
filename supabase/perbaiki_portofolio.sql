-- ============================================================
-- Perbaiki tabel portofolio: tambah kolom "detail" & "gallery" — aman dijalankan berulang
-- Jalankan jika admin menampilkan: "could not find the 'detail' column of 'portfolio_items' in the schema cache"
-- Supabase > SQL Editor > New query > tempel semua > Run
-- ============================================================
alter table public.portfolio_items add column if not exists detail text;
alter table public.portfolio_items add column if not exists gallery jsonb default '[]'::jsonb;
-- muat ulang cache skema API agar kolom baru langsung dikenali
notify pgrst, 'reload schema';
