# Backend — Laravel API (PT. Candi Oxygen)

API untuk website React di `../frontend`. Menggantikan Supabase pada versi HTML lama.

## Menjalankan (lokal)

```bash
composer install
cp .env.example .env          # lalu isi ADMIN_EMAIL & ADMIN_PASSWORD bila perlu
php artisan key:generate
php artisan migrate           # default SQLite (database/database.sqlite)
php artisan storage:link      # agar gambar unggahan admin bisa diakses di /storage
php artisan admin:create admin@candioxygen.co.id   # buat akun admin panel
php artisan serve             # http://localhost:8000
```

Untuk MySQL, ubah `DB_CONNECTION=mysql` dan isi `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` di `.env`.

## Endpoint

| Publik | Keterangan |
|---|---|
| `GET /api/site-content` | Semua isi CMS (teks, gambar, link, pengaturan) |
| `GET /api/jobs`, `/api/portfolio`, `/api/gallery` | Lowongan, portofolio, galeri kegiatan |
| `POST /api/contact-messages`, `/api/quote-requests`, `/api/career-applications`, `/api/reviews` | Formulir pengunjung (dibatasi 20/menit) |
| `POST /api/page-views` | Statistik kunjungan anonim |

Panel admin (`/api/admin/*`) memakai token Laravel Sanctum dari `POST /api/admin/login`.

## Menyajikan website React dari Laravel (satu domain)

```bash
cd ../frontend && npm install && npm run build:laravel
```

Hasil build masuk ke `public/app`, dan semua alamat selain `/api/*` & `/storage/*` diarahkan ke React (lihat `routes/web.php`).
Jika frontend di-hosting terpisah, atur `FRONTEND_URLS` (CORS) di `.env` ini dan `VITE_API_URL` di frontend.

## Test

```bash
php artisan test
```
