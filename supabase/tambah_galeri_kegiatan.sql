-- Jalankan SEKALI di Supabase > SQL Editor (aman diulang). Menambah fitur Galeri Kegiatan (foto kegiatan kantor).

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
