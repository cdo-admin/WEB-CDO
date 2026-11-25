# Panduan Admin PT. Candi Oxygen

Panel admin ada di **`admin.html`** (contoh: `https://websiteanda.com/admin.html`). Dari sana Anda bisa:

| Menu | Fungsi |
|---|---|
| **Statistik** | Jumlah pengunjung, asal pengunjung (Instagram, WhatsApp, LinkedIn, Google, dll), halaman terpopuler, perangkat, bahasa |
| **Edit Website** | Klik teks / gambar / tombol / kartu di halaman, lalu ubah. Teks Indonesia dan English, ganti foto, ganti link (WA, IG, LinkedIn), duplikat atau sembunyikan produk dan proyek |
| **Form Penawaran** | Tambah / sembunyikan produk, ubah ukuran, atur sub pilihan (WG / HP / UHP, dll) |
| **Galeri Gambar** | Ganti foto mana pun di seluruh website dari satu tempat, tanpa Commit / Push |
| **Filter Portofolio**: di menu *Portofolio* ada kotak "Tombol filter". Tombol bawaan (Medis, Filling Station, Industri) dan **Lainnya** tidak bisa dihapus. Untuk menambah filter, isi nama (dan nama Inggris kalau mau), klik **Tambah filter**, lalu pilih kelompok itu saat menambah atau mengedit proyek. Menghapus filter memindahkan proyeknya ke "Lainnya".

**Galeri Kegiatan** | Tambah foto kegiatan kantor (outing, 17 Agustusan, buka bersama, dll) beserta deskripsinya untuk halaman Galeri |
| **Portofolio** | Tambah, ubah, sembunyikan, atau hapus proyek di halaman Portofolio |
| **Pesan Masuk** | Lamaran kerja dan review dari pengunjung. Tombol **Balas via Gmail** |
| **Link Pelacak** | Pilih halaman tujuan, lalu salin link siap pakai untuk Instagram, WhatsApp, LinkedIn, brosur QR, dll |

Semua perubahan langsung tampil di website. Tidak perlu coding atau menghubungi developer.

---

## Setup sekali saja (sekitar 20 menit)

### 1. Buat project Supabase (gratis)
1. Buka https://supabase.com → **Start your project** → daftar (boleh pakai Google/GitHub).
2. **New project** → isi nama (misal `candi-oxygen`), buat **Database Password** (simpan!), pilih region **Southeast Asia (Singapore)** → **Create**. Tunggu 1-2 menit.

### 2. Jalankan SQL setup
1. Buka file **`supabase/setup.sql`** dengan Notepad.
2. Di baris paling bawah, ganti `EMAIL_ADMIN_ANDA@gmail.com` dengan **email admin**. Boleh tambah admin lain dengan menyalin barisnya.
3. Di Supabase: menu **SQL Editor** → **New query** → tempel seluruh isi file → **Run**. Harus muncul "Success".

### 3. Buat akun admin
1. Menu **Authentication → Users → Add user → Create new user**.
2. Isi **email yang sama** dengan langkah 2 dan buat kata sandi. Centang **Auto Confirm User**.
3. (Disarankan) **Authentication → Sign In / Providers → Email**: matikan **Allow new users to sign up**.

> Hanya email yang tercatat di `admin_users` yang bisa membuka panel. Akun lain otomatis ditolak.

### 4. Hubungkan website ke Supabase
1. Supabase → **Project Settings → API**. Salin **Project URL** dan **anon public key**.
2. Buka `assets/js/supabase.js`, ganti `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.
3. Jangan pernah memakai atau membagikan key bertuliskan **service_role**.

### 5. Upload website ke hosting
Editor visual dan statistik hanya berjalan bila website sudah online. Cara termudah dan gratis:
- **Netlify Drop**: buka https://app.netlify.com/drop, lalu seret **seluruh folder website** (berisi `index.html`, `admin.html`, folder `assets`, dll). Anda langsung mendapat alamat website.
- Alternatif: Cloudflare Pages atau GitHub Pages.

Struktur folder:
```
index.html, about.html, products.html, portfolio.html, career.html, contact.html, quote.html
admin.html                 <- panel admin (tidak ada link ke sini di website)
assets/js/  main.js  i18n.js  supabase.js  quote-options.js  cms.js  phone.js  cart.js  locations.js
assets/images/ ...
supabase/setup.sql         <- hanya untuk setup, boleh tidak di-upload
supabase/tambah_lowongan.sql, tambah_portofolio.sql  <- jalankan sekali bila tabel belum ada
```

### 6. Masuk
Buka `alamatwebsite/admin.html` → login dengan email dan kata sandi dari langkah 3.
Setelah login, kunjungan dari browser Anda tidak dihitung di statistik.

---

## Cara pakai harian

**Ubah teks**: Edit Website → pilih halaman → klik teks → ubah kolom *Indonesia* dan *English* → **Simpan**.
**Ganti foto**: klik gambar → **Unggah gambar baru** (JPG/PNG/WebP, usahakan di bawah 2 MB).
**Ganti nomor WhatsApp / Instagram / LinkedIn**: klik ikon atau tombolnya → ubah kolom **Link**. Ikon yang sama muncul di semua halaman, jadi ubah di satu halaman dan berlaku di semua.
  - WhatsApp: `https://wa.me/628123456789` · Instagram: `https://instagram.com/akun` · LinkedIn: `https://www.linkedin.com/company/nama-perusahaan`
  - Tulisan nomor yang terlihat (misal "+62 811...") diubah dengan mengklik tulisannya.
**Tambah produk atau proyek baru**: klik kartu yang mirip → **Duplikat kartu** → klik judul, deskripsi, dan foto kartu baru untuk mengubahnya. Di halaman Produk, centang *Tambahkan juga ke form penawaran dan pencarian* agar produk bisa dipesan.
**Sembunyikan produk**: klik kartu → **Sembunyikan**. Bisa ditampilkan lagi dengan klik kartu yang pudar → **Tampilkan kembali**.
**Batalkan perubahan**: klik bagian tersebut → **Kembalikan ke asli**.
**Lowongan Karir**: menu *Lowongan Karir*. Pertama kali, klik **Impor 3 lowongan bawaan** (atau *Mulai dari kosong*). Setelah itu bisa **Tambah lowongan**, **Edit**, **Sembunyikan/Tayangkan**, geser urutan dengan panah, atau **Hapus**. Halaman Karir langsung mengikuti daftar. Kalau semua lowongan disembunyikan, pengunjung melihat pesan "belum ada lowongan" dan tombol *Talent Pool*. Isi terjemahan Inggris (opsional) di bagian "Terjemahan Inggris".
**Galeri Gambar**: menu *Galeri Gambar* menampilkan semua foto di website, bisa disaring per halaman. Klik **Ganti**, pilih foto dari komputer. Foto otomatis dikecilkan dan langsung tampil di website (tidak perlu Commit / Push). Tombol **Asli** mengembalikan ke foto bawaan di file. Satu foto yang dipakai di banyak halaman (misal logo) cukup diganti sekali. Foto kartu proyek di halaman Portofolio diganti lewat menu *Portofolio*.
**Galeri Kegiatan**: menu *Galeri Kegiatan* (beda dengan *Galeri Gambar*). Klik **Tambah kegiatan**, isi foto sampul, judul, tanggal, deskripsi, dan foto tambahan (boleh banyak). Kegiatan terbaru otomatis ditaruh paling atas; urutan bisa digeser dengan panah. **Sembunyikan** menyimpan kegiatan tanpa menayangkannya, **Hapus** menghilangkannya permanen. Selama belum ada kegiatan, pengunjung melihat pesan "Oops, sepertinya belum ada kegiatan yang dipost di sini". Di website, klik foto → muncul jendela dengan gambar besar dan deskripsi. Prasyarat: jalankan `supabase/tambah_galeri_kegiatan.sql` sekali di Supabase.
**Portofolio**: menu *Portofolio*. Pertama kali, klik **Impor 6 proyek bawaan** (atau *Mulai dari kosong*). Setelah itu bisa **Tambah proyek**, **Edit** (foto, judul, kelompok filter, label, lokasi, status, deskripsi), **Sembunyikan/Tayangkan**, geser urutan dengan panah, atau **Hapus**. Prasyarat: jalankan `supabase/tambah_portofolio.sql` sekali di Supabase.
**Balas via Gmail**: di *Pesan Masuk*, buka sebuah pesan lalu klik **Balas via Gmail**. Gmail terbuka di tab baru dengan alamat penerima, subjek, dan salam pembuka sudah terisi. Bila browser login ke beberapa akun Google, isi kolom *Gmail pengirim* di atas daftar pesan agar Gmail memakai akun kantor.
**Link Pelacak**: pilih halaman tujuan, klik **Salin link** pada baris platform yang dipakai, lalu tempel di bio / profil platform itu.
**Nomor telepon di formulir**: semua kolom telepon (Kontak, Penawaran, Karir) hanya menerima angka, punya pilihan negara (default Indonesia +62), dan menolak nomor yang panjangnya tidak sesuai. Nomor tersimpan berformat internasional, misal `+62 812 3456 7890`. Yang diperiksa adalah format dan panjang nomor, bukan apakah nomornya aktif.
**Pesan Masuk**: dua kategori, Lamaran Kerja dan Review Masuk, lalu per sub-kategori (posisi yang dilamar atau jumlah bintang). Review menampilkan bintang 1-5 dan isi ulasan. Pesanan/penawaran sekarang dikirim langsung lewat WhatsApp atau email, jadi tidak lagi ditampilkan di sini (salinannya tetap tersimpan di tabel `quote_requests` Supabase). Untuk menerima review, jalankan sekali `supabase/tambah_review.sql` di SQL Editor. Klik sebuah pesan untuk membuka detail, lalu balas lewat WhatsApp atau Email. Tersedia pencarian dan filter "Hanya belum dibaca".
**Form Penawaran**: menu *Form Penawaran*. Satu pilihan per baris. Contoh sub pilihan kemurnian: `WG | WG (Welding Grade)`. Klik **Simpan semua**.

## Alur pemesanan (keranjang & WhatsApp)

1. Pengunjung membuka **Produk & Layanan**, klik **Pesan** pada produk → muncul jendela spesifikasi/ukuran, jumlah, dan catatan → **Masukkan Keranjang**.
2. Ikon keranjang (pojok kanan bawah) menampung semua item, tetap ada walau pindah halaman. Klik **Pesan** di keranjang → masuk ke formulir RFQ (`quote.html`) yang sudah terisi pesanannya.
3. Pengunjung mengisi identitas dan alamat → **Kirim Pesanan via WhatsApp** → WhatsApp terbuka ke nomor yang tertera di website, berisi template Purchase Order (data pemesan, rincian pesanan, pengiriman, No. Referensi `PO-tanggal-kode`). Pengunjung tinggal menekan Kirim. Tersedia juga tombol **Kirim Pesanan via Email** (membuka aplikasi email dengan isi yang sama, tujuan `info@candioxygen.co.id` — diambil dari tautan mailto di website).
4. Pesanan yang sama juga tersimpan sebagai arsip di database Supabase (tabel `quote_requests`, No. Referensi ada di kolom notes). Jika database sedang gangguan, WhatsApp tetap terbuka.

Nomor tujuan diambil otomatis dari tautan `wa.me` di website (bawaan: 62 811-3739-800). Pilihan spesifikasi diatur di `assets/js/quote-options.js`.

## Peta lokasi (Beranda & Kontak)

Peta Jawa Timur dengan dua pin (PT. Candi Oxygen Gases dan PT. Candi Sukses Abadi). Klik pin = membuka Google Maps lokasi tersebut. Pengaturannya ada di bagian atas `assets/js/locations.js`:
- `lat`, `lng`: koordinat. Di Google Maps klik kanan pada lokasi, lalu klik angka koordinat paling atas (otomatis tersalin), tempel ke file ini.
- `url`: tujuan saat pin diklik (link Google Maps atau halaman Google Bisnis perusahaan).
- Titik Candi Sukses Abadi saat ini **perkiraan**; sesuaikan dengan koordinat pasti dari Google Maps.
- Peta dasar memakai OpenStreetMap (gratis, tanpa API key). Jika gagal dimuat, otomatis tampil kartu alamat dengan tombol Google Maps.

## Membaca statistik
- **Pengunjung datang dari** dihitung per sesi kunjungan.
- Instagram, WhatsApp, dan TikTok sering menyembunyikan asal pengunjung. Karena itu pakai menu **Link Pelacak** dan tempel link buatan itu di bio atau status. Sumbernya tercatat tepat.
- Sumber terdeteksi otomatis dari: link berparameter (`utm_source`), situs asal (Google, LinkedIn, dll), dan jenis aplikasi (browser dalam Instagram, Facebook, LinkedIn, TikTok).
- Data berisi kode pengunjung acak, tanpa nama atau alamat IP.

## Hal yang perlu diketahui
- Perubahan teks bekerja dengan mencocokkan teks asli di halaman. Kalau developer kelak mengubah tulisan asli di file HTML, perubahan admin untuk teks itu tidak akan cocok lagi. Buka menu Edit Website untuk memeriksa dan mengeditnya ulang.
- Lowongan di halaman Karir diatur lewat menu *Lowongan Karir* (bukan Edit Website). Blok besar di halaman Layanan bisa diubah teks dan fotonya, tetapi tidak bisa diduplikasi. Kartu produk di halaman Produk dan kartu proyek di Portofolio bisa diduplikasi.
- Project Supabase gratis dijeda bila tidak ada aktivitas 7 hari. Kunjungan ke website dan login admin dihitung sebagai aktivitas. Jika sempat dijeda, tekan **Restore** di dashboard Supabase.
- Backup: Supabase → Database → Backups, atau ekspor tabel `site_content` sebagai CSV.

## Masalah umum
| Gejala | Solusi |
|---|---|
| "Supabase belum diisi" di halaman login | Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `assets/js/supabase.js` |
| "Akun ini bukan admin" | Email belum ada di `admin_users`. Jalankan di SQL Editor: `insert into admin_users(email) values ('email@anda.com');` |
| Editor menampilkan halaman kosong atau peringatan kuning | Website harus di-hosting, bukan dibuka dari file di komputer |
| Menu Galeri Kegiatan bilang "Tabel galeri kegiatan belum dibuat" | Jalankan isi `supabase/tambah_galeri_kegiatan.sql` di Supabase → SQL Editor, lalu muat ulang admin |
| Menu Portofolio bilang "Tabel portofolio belum dibuat" | Jalankan isi `supabase/tambah_portofolio.sql` di Supabase → SQL Editor, lalu muat ulang admin |
| Galeri Gambar kosong / halaman tidak terbaca | Buka admin dari website yang sudah online (bukan dari file di komputer) |
| Menu Lowongan Karir bilang "Tabel lowongan belum dibuat" | Jalankan isi `supabase/tambah_lowongan.sql` di Supabase → SQL Editor, lalu muat ulang admin |
| Statistik kosong | Pastikan `cms.js` ada di semua halaman, SQL sudah dijalankan, dan kunjungan dilakukan dari browser lain (kunjungan Anda sendiri tidak dihitung) |
| Perubahan tidak tampil di website | Tekan Ctrl+F5. Jika masih sama, periksa bahwa `supabase.js` sudah terisi |
| Gagal unggah gambar | Pastikan SQL setup dijalankan penuh (bagian "Penyimpanan gambar"), ukuran file di bawah 5 MB |
