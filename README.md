# PT. CANDI OXYGEN — WEBSITE RESMI

Website multi-halaman PT. Candi Oxygen dengan panel admin, dibangun dengan **React** (frontend) dan **Laravel** (backend).

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

## 📂 Struktur

```
WEBSITE-CDO-main/
├── frontend/   # React + Vite: website publik (8 halaman) + panel admin (/admin)
└── backend/    # Laravel API: isi CMS, formulir, lowongan, portofolio, galeri, statistik, login admin
```

## 🚀 Menjalankan

```bash
# Backend
cd backend
composer install && cp .env.example .env && php artisan key:generate
php artisan migrate && php artisan storage:link
php artisan admin:create admin@candioxygen.co.id
php artisan serve                       # http://localhost:8000

# Frontend (pengembangan)
cd frontend
npm install && npm run dev              # http://localhost:5173

# Produksi (satu domain, disajikan Laravel)
cd frontend && npm run build:laravel
```

Detail: [backend/README.md](backend/README.md) · [frontend/README.md](frontend/README.md)

## 📋 Fitur

- Dua bahasa (Indonesia / English), pilihan tersimpan otomatis.
- Pencarian di header dengan saran per kategori (gas, layanan, perlengkapan).
- Showroom produk dengan modal spesifikasi, keranjang, dan tabel pesanan dinamis di halaman Penawaran.
- Formulir kontak, penawaran (RFQ), lamaran karir, dan ulasan, semua masuk ke inbox admin.
- Panel admin: ubah teks/gambar/link website, kelola lowongan, portofolio, galeri kegiatan, dan lihat statistik kunjungan.

---

© 2026 PT. Candi Oxygen. All Rights Reserved.
