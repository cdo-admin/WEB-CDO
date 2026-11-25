-- ============================================================
-- Perbaiki penyimpanan foto (bucket "site-media") — aman dijalankan berulang
-- Jalankan jika unggah foto di admin gagal.
-- Supabase > SQL Editor > New query > tempel semua > Run
-- ============================================================
insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "publik lihat media" on storage.objects;
create policy "publik lihat media" on storage.objects for select using (bucket_id = 'site-media');
drop policy if exists "admin unggah media" on storage.objects;
create policy "admin unggah media" on storage.objects for insert with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "admin ubah media" on storage.objects;
create policy "admin ubah media" on storage.objects for update using (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "admin hapus media" on storage.objects;
create policy "admin hapus media" on storage.objects for delete using (bucket_id = 'site-media' and public.is_admin());
