# PT. CANDI OXYGEN — PREMIER LUXURY WEBSITE

Website resmi multi-page untuk **PT. Candi Oxygen** dengan estetika dan standar kemewahan tingkat tinggi yang terinspirasi oleh website resmi **Rolex (rolex.com)** dan **Omega Watches**.

---

## 💎 Identitas Perusahaan & Ketentuan Bisnis Resmi

1. **Nama Entitas Legal**: **PT. Candi Oxygen** (Supplier Gas Berkualitas Tinggi sejak tahun 1980 / **EST. 1980**).
2. **Lokasi Tunggal**:
   - **Kawasan Industri & Pergudangan "Safe N Lock" Blok K No. 1726-1729**
   - Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul, Sidoarjo, Jawa Timur 61232.
   - Peta interaktif exact Google Maps terintegrasi di seluruh halaman terkait dengan pinpoint lokasi.
3. **Wilayah Layanan Armada Pengiriman**:
   - Distribusi armada B3 terjadwal mencakup wilayah **Jawa Timur** (Surabaya, Sidoarjo, Gresik, Pasuruan, Mojokerto, Malang, Probolinggo, dan sekitarnya).
4. **Kontak Resmi & Media Sosial**:
   - **Telepon Kantor**: (031) 990103 15 / 16
   - **WhatsApp**: +62 811-3739-800 (`https://wa.me/628113739800`)
   - **Instagram**: `@candioxygengases` (`https://www.instagram.com/candioxygengases`)
   - **TikTok**: `@candioxygengases` (`https://www.tiktok.com/@candioxygengases`)
   - **Email**: `info@candioxygen.co.id`
5. **Tipografi Resmi**:
   - **Headings & Judul Halaman**: **Montserrat**
   - **Judul Website Header (`CANDI OXYGEN`)**: **Montserrat Bold** (Weight 800, tracking elegan)
   - **Teks Paragraf & Isi Dokumen**: **Roboto**

---

## 🚀 Fitur Baru & Pembaruan Sistem

### 1. Mode Dua Bahasa (Bilingual: Indonesia 🇮🇩 & English 🇬🇧)
- Pengunjung dapat memilih bahasa melalui tombol bendera di header (desktop & mobile).
- Sistem didukung oleh engine penerjemahan real-time [`assets/js/i18n.js`](file:///c:/Users/tobym/Downloads/WEBSITE%20CDO/assets/js/i18n.js).
- Pilihan bahasa tersimpan otomatis di `localStorage` peramban pengunjung sehingga tidak hilang saat berpindah halaman.

### 2. Search Bar Header Terintegrasi dengan Pemisah Kategori
- Kotak pencarian hadir di header seluruh halaman (`header-search-wrap`).
- Mengetikkan huruf akan memunculkan menu saran (*suggestion dropdown*) real-time yang memisahkan hasil pencarian dengan header kategori berikon:
  - `PRODUK GAS (INDUSTRIAL & MEDICAL)`
  - `LAYANAN PROFESIONAL (SERVICES)`
  - `PERLENGKAPAN GAS (EQUIPMENT)`
- Mengklik salah satu saran akan mengarahkan pengguna langsung ke modal spesifikasi atau bagian terkait.

### 3. Showroom Dinamis & Unik pada Halaman Produk & Layanan (`products.html`)
- Menggantikan daftar teks biasa dengan showroom interaktif mewah:
  - Simbol kimia berelemen elegan ($O_2, N_2, Ar, C_2H_2, CO_2$).
  - Tag kemurnian gas (*Industrial Grade, High Purity, Ultra High Purity 99.999%*).
  - Spesifikasi bejana tekan dan standar regulasi K3.
  - Modal interaktif spesifikasi teknis lengkap dengan tombol aksi langsung ke formulir RFQ.

### 4. Dynamic Order Table pada Halaman Ajukan Penawaran (`quote.html`)
- Menjawab masalah jika pelanggan memesan banyak jenis gas berbeda, ukuran berbeda, dan alat berbeda.
- Mengganti isian kotak teks panjang yang membingungkan dengan sistem tabel pemesanan dinamis:
  - Pemilihan Komoditas / Layanan melalui dropdown terkelompok.
  - Pemilihan Ukuran / Spesifikasi Tabung ($1\text{ m}^3, 1.5\text{ m}^3, 2\text{ m}^3, 6\text{ m}^3, 7\text{ m}^3$, Cradle, Dewar Liquid).
  - Input jumlah kuantitas dan catatan khusus per item.
  - Tombol **Preset Cepat** (+10 Tabung Oksigen $6\text{ m}^3$, +5 Tabung Nitrogen, dll).
  - Tabel rekapitulasi langsung dengan penghitung jumlah item dan tombol hapus baris.
  - Saat form dikirim, seluruh isi tabel terformat rapi dan masuk ke database Supabase.

### 5. Company Journey Timeline pada Halaman Tentang Kami (`about.html`)
- Jejak rekam jejak vertikal elegan ala Rolex dengan penanda tahun, judul tonggak pencapaian, dan cerita historis.
- Dilengkapi komentar penanda HTML yang jelas (`<!-- [EDIT TIMELINE N: ...] -->`) untuk memudahkan penambahan atau perubahan tahun di masa depan.

---

## 📂 Struktur Berkas Website

```
WEBSITE CDO/
├── index.html              # Beranda (Rolex Hero, Single Showcase Oksigen Medis, Pinpoint Safe N Lock)
├── about.html              # Tentang Kami (Rolex Hero, Sejarah, Timeline, Visi & Misi Resmi Verbatim)
├── products.html           # Showroom Dinamis Produk, Layanan & Perlengkapan + Modal Spesifikasi
├── portfolio.html          # Portofolio Proyek (Filter Kategori Interaktif, Rekam Jejak Medis & Industri)
├── career.html             # Karir & Rekrutmen (Formasi Terbuka, Sistem Talent Pool, Modal Lamaran)
├── contact.html            # Kontak & Lokasi (Peta Interaktif Safe N Lock Sidoarjo, Formulir Pesan)
├── quote.html              # Ajukan Penawaran Resmi (Dynamic Order Table & RFQ Supabase)
├── supabase-schema.sql     # Skrip SQL tabel kontak, RFQ, dan lamaran karir
├── assets/
│   ├── css/
│   │   └── style.css       # Google Fonts (Montserrat & Roboto), styling tema Rolex, Omega lines, Order Table
│   ├── js/
│   │   ├── i18n.js         # Kamus dwibasa & sistem switch bahasa ID/EN otomatis
│   │   ├── main.js         # Pengendali search bar, dynamic order table, scroll fade headings, filter
│   │   └── supabase.js     # Integrasi API Supabase untuk semua form
│   └── images/
│       └── logo.png        # Logo resmi PT. Candi Oxygen
└── README.md
```

---

## 📋 Panduan Pengelolaan Website

### 1. Cara Mengubah atau Menambah Linimasa (Timeline) di `about.html`
Buka [`about.html`](file:///c:/Users/tobym/Downloads/WEBSITE%20CDO/about.html) lalu cari komentar:
```html
<!-- [EDIT TIMELINE 1: AWAL MULA 1980] -->
<!-- [EDIT TIMELINE 2: EKSPANSI PERGUDANGAN SAFE N LOCK] -->
<!-- [EDIT TIMELINE 3: SERTIFIKASI K3 BEJANA BERTEKANAN] -->
<!-- [EDIT TIMELINE 4: MODERNISASI FILLING STATION] -->
<!-- [EDIT TIMELINE 5: TRANSFORMATIF PT. CANDI OXYGEN HARI INI] -->
```
Anda cukup menyalin salah satu blok kartu timeline tersebut untuk menambahkan tahun baru.

### 2. Cara Mengatur Status Lowongan Karir di `career.html`
- **Jika Sedang Tidak Ada Lowongan**:
  Buka [`career.html`](file:///c:/Users/tobym/Downloads/WEBSITE%20CDO/career.html), tambahkan class `hidden` pada `<div id="active-positions-container">` dan hapus class `hidden` pada `<div id="no-positions-container">`. Pengunjung akan diarahkan untuk mendaftarkan CV ke **Talent Pool**.
- **Jika Ingin Menambah Posisi Baru**:
  Salin salah satu blok kartu lowongan di dalam `#active-positions-container` dan sesuaikan nama jabatan, kualifikasi, serta nilai atribut `data-career-role`.

### 3. Kemana Seluruh Data Formulir Masuk?
Seluruh formulir terintegrasi ke database **Supabase**:
1. **Formulir RFQ / Penawaran** (`quote.html` & `products.html`) $\rightarrow$ Tabel `public.quote_requests`. Daftar item pesanan dari *Dynamic Order Table* tersusun rapi di kolom `estimated_volume` dan `selected_items`.
2. **Formulir Kontak** (`contact.html`) $\rightarrow$ Tabel `public.contact_messages`.
3. **Formulir Lamaran Karir** (`career.html`) $\rightarrow$ Tabel `public.career_applications`.

---

© 2026 PT. Candi Oxygen. All Rights Reserved.
