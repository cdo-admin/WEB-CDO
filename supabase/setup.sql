-- =============================================================================
-- PT. CANDI OXYGEN — SETUP DATABASE ADMIN (jalankan SEKALI di Supabase)
-- Supabase Dashboard -> SQL Editor -> New query -> tempel semua isi file ini -> Run
-- =============================================================================
-- !! WAJIB: ganti 'tobymaxwell26@gmail.com' di bagian paling bawah dengan email admin.

-- 1) Daftar admin (hanya email di sini yang boleh masuk panel admin) ------------
create table if not exists public.admin_users (
  email text primary key
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));
$$;

drop policy if exists "admin lihat admin" on public.admin_users;
create policy "admin lihat admin" on public.admin_users for select using (public.is_admin());

-- 2) Isi website yang bisa diedit ---------------------------------------------
-- kind: text | img | href | hide | clone | config
create table if not exists public.site_content (
  kind text not null,
  key text not null,
  scope text not null default '',
  value_id text,
  value_en text,
  position bigint default 0,
  updated_at timestamptz default now(),
  primary key (kind, key, scope)
);
alter table public.site_content enable row level security;

drop policy if exists "publik baca konten" on public.site_content;
create policy "publik baca konten" on public.site_content for select using (true);
drop policy if exists "admin tulis konten" on public.site_content;
create policy "admin tulis konten" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

-- 3) Statistik pengunjung -----------------------------------------------------
create table if not exists public.page_views (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  visitor_id text,
  session_id text,
  path text,
  source text,          -- instagram, whatsapp, linkedin, google, direct, ...
  medium text,          -- social, search, direct, referral, messaging, campaign
  referrer_host text,
  campaign text,
  device text,          -- mobile / desktop / tablet
  lang text,
  screen_w int
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
alter table public.page_views enable row level security;

drop policy if exists "pengunjung catat kunjungan" on public.page_views;
create policy "pengunjung catat kunjungan" on public.page_views for insert
  with check (char_length(coalesce(path,'')) < 300 and char_length(coalesce(source,'')) < 80);
drop policy if exists "admin lihat kunjungan" on public.page_views;
create policy "admin lihat kunjungan" on public.page_views for select using (public.is_admin());
drop policy if exists "admin hapus kunjungan" on public.page_views;
create policy "admin hapus kunjungan" on public.page_views for delete using (public.is_admin());

-- 4) Pesan masuk (form kontak, penawaran, karir) -----------------------------------
create table if not exists public.contact_messages (
  id bigserial primary key, created_at timestamptz default now(),
  full_name text, email text, phone text, company text, subject text, message text
);
create table if not exists public.quote_requests (
  id bigserial primary key, created_at timestamptz default now(),
  full_name text, email text, phone text, company text, client_type text, category text,
  selected_items jsonb, estimated_volume text, delivery_location text, notes text
);
create table if not exists public.career_applications (
  id bigserial primary key, created_at timestamptz default now(),
  full_name text, email text, phone text, position text, linkedin_url text, portfolio_url text, cover_letter text
);
alter table public.contact_messages     add column if not exists is_read boolean default false;
alter table public.quote_requests       add column if not exists is_read boolean default false;
alter table public.career_applications  add column if not exists is_read boolean default false;

do $$
declare t text;
begin
  foreach t in array array['contact_messages','quote_requests','career_applications'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "pengunjung kirim" on public.%I', t);
    execute format('create policy "pengunjung kirim" on public.%I for insert with check (true)', t);
    execute format('drop policy if exists "admin kelola" on public.%I', t);
    execute format('create policy "admin kelola" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- 4b) Review masuk dari pengunjung ------------------------------------------------
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

-- 5) Penyimpanan gambar (foto yang diunggah admin) ------------------------------------
insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "publik lihat media" on storage.objects;
create policy "publik lihat media" on storage.objects for select using (bucket_id = 'site-media');
drop policy if exists "admin unggah media" on storage.objects;
create policy "admin unggah media" on storage.objects for insert with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "admin ubah media" on storage.objects;
create policy "admin ubah media" on storage.objects for update using (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "admin hapus media" on storage.objects;
create policy "admin hapus media" on storage.objects for delete using (bucket_id = 'site-media' and public.is_admin());

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

-- 5c) Portofolio proyek (diatur dari admin) -------------------------------------------
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

-- 6) !! DAFTARKAN EMAIL ADMIN (ganti dengan email Anda; boleh lebih dari satu baris) -------------
insert into public.admin_users (email) values ('tobymaxwell26@gmail.com')
on conflict do nothing;

-- ========== 4c. Galeri Kegiatan ==========
create table if not exists public.gallery_items (
  id bigserial primary key,
  created_at timestamptz default now(),
  sort_order int default 0,
  is_active boolean default true,
  title text not null,
  event_date date,                         -- tanggal kegiatan (opsional)
  description text,                        -- cerita / deskripsi kegiatan
  image_url text,                          -- foto sampul
  photos jsonb default '[]'::jsonb,        -- foto tambahan (daftar alamat gambar)
  en jsonb default '{}'::jsonb             -- terjemahan Inggris {title, description}
);
alter table public.gallery_items enable row level security;
drop policy if exists "publik lihat galeri aktif" on public.gallery_items;
create policy "publik lihat galeri aktif" on public.gallery_items for select using (is_active = true or public.is_admin());
drop policy if exists "admin kelola galeri" on public.gallery_items;
create policy "admin kelola galeri" on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());
notify pgrst, 'reload schema';
