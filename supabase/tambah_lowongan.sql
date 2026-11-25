-- Jalankan SEKALI di Supabase > SQL Editor (aman diulang). Menambah fitur Lowongan Karir.

-- 5b) Lowongan karir (diatur dari admin) -------------------------------------------
create table if not exists public.job_openings (
  id bigserial primary key,
  created_at timestamptz default now(),
  sort_order int default 0,
  is_active boolean default true,
  title text not null,
  category text,
  color text default 'sky',
  location text,
  description text,
  detail1 text,
  detail2 text,
  apply_role text,
  en jsonb default '{}'::jsonb
);
alter table public.job_openings enable row level security;
drop policy if exists "publik lihat lowongan aktif" on public.job_openings;
create policy "publik lihat lowongan aktif" on public.job_openings for select using (is_active = true or public.is_admin());
drop policy if exists "admin kelola lowongan" on public.job_openings;
create policy "admin kelola lowongan" on public.job_openings for all using (public.is_admin()) with check (public.is_admin());

