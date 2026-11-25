-- ============================================================
-- Tambah fitur Review Masuk (aman dijalankan berulang)
-- Supabase > SQL Editor > New query > tempel semua > Run
-- ============================================================
create table if not exists public.reviews (
  id bigserial primary key,
  created_at timestamptz default now(),
  full_name text, company text, email text, phone text,
  rating int check (rating between 1 and 5),
  message text,
  is_read boolean default false
);
alter table public.reviews enable row level security;
drop policy if exists "pengunjung kirim" on public.reviews;
create policy "pengunjung kirim" on public.reviews for insert
  with check (rating between 1 and 5 and length(coalesce(message,'')) <= 3000);
drop policy if exists "admin kelola" on public.reviews;
create policy "admin kelola" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
