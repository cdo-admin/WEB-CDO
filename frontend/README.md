# Frontend — React + Vite (PT. Candi Oxygen)

Website publik (Beranda, Tentang, Produk, Portofolio, Galeri, Karir, Kontak, Penawaran) dan panel admin (`/admin`),
hasil migrasi dari versi HTML/CSS/JS lama. Data diambil dari API Laravel di `../backend`.

## Pengembangan

```bash
npm install
npm run dev        # http://localhost:5173 — /api & /storage diteruskan ke Laravel (http://localhost:8000)
```

Jalankan juga backend: `cd ../backend && php artisan serve`.

## Test

```bash
npm test           # sekali jalan (Vitest + Testing Library, jsdom)
npm run test:watch # mode pantau saat mengembangkan
npm run lint       # oxlint
```

Test ada di samping kodenya (`*.test.jsx`); helper bersama di `src/test/` (`renderSite` = provider situs publik,
`mockApi` = mock `fetch` ke API Laravel). Setiap perbaikan bug wajib disertai test regresi yang gagal sebelum perbaikan.

## Build

| Perintah | Hasil |
|---|---|
| `npm run build:laravel` | Ke `../backend/public/app`, disajikan langsung oleh Laravel (satu domain, disarankan) |
| `npm run build` | Ke `dist/` untuk hosting statis terpisah; isi `VITE_API_URL` di `.env.production` |

## Struktur

- `src/pages/` — halaman website
- `src/components/` — header, footer, keranjang, formulir, peta, dll.
- `src/admin/` — panel admin (login, editor isi, inbox, lowongan, portofolio, galeri, statistik)
- `src/cms/` — isi website yang bisa diubah admin
- `src/i18n/` — dua bahasa (Indonesia / English)
- `src/lib/api.js` — pemanggil API Laravel
- `public/assets/images/` — gambar website
