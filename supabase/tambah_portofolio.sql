-- Jalankan SEKALI di Supabase > SQL Editor (aman diulang). Menambah fitur Portofolio yang diatur dari admin.

create table if not exists public.portfolio_items (
  id bigserial primary key,
  created_at timestamptz default now(),
  sort_order int default 0,
  is_active boolean default true,
  title text not null,
  category text default 'industri',      -- medis | kriogenik | industri (untuk tombol filter)
  badge text,                             -- label kecil di atas foto
  badge_color text default 'navy',
  location text,                          -- teks kiri atas (lokasi / klien)
  status text,                            -- teks kanan atas
  status_color text default 'emerald',
  description text,
  foot_left text,
  foot_right text,
  foot_color text default 'emerald',
  image_url text,
  image_alt text,
  en jsonb default '{}'::jsonb,
  detail text,                            -- penjelasan lengkap (tampil saat kartu diklik)
  gallery jsonb default '[]'::jsonb       -- daftar alamat foto galeri
);
alter table public.portfolio_items add column if not exists detail text;
alter table public.portfolio_items add column if not exists gallery jsonb default '[]'::jsonb;
alter table public.portfolio_items enable row level security;
drop policy if exists "publik lihat portofolio aktif" on public.portfolio_items;
create policy "publik lihat portofolio aktif" on public.portfolio_items for select using (is_active = true or public.is_admin());
drop policy if exists "admin kelola portofolio" on public.portfolio_items;
create policy "admin kelola portofolio" on public.portfolio_items for all using (public.is_admin()) with check (public.is_admin());
