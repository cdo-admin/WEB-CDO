/* Lokasi perusahaan di peta Jawa Timur (dipindahkan dari assets/js/locations.js).
   lat, lng : koordinat (di Google Maps: klik kanan pada lokasi -> klik angka koordinat -> tersalin)
   url      : tujuan saat pin diklik (link Google Maps atau halaman profil Google Bisnis) */
export const LOCATIONS = [
  {
    id: 'oxygen',
    name: 'PT. Candi Oxygen Gases',
    address: 'Pergudangan & Industri "Safe N Lock" Blok K No. 1726-1729, Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul, Sidoarjo, Jawa Timur 61232',
    lat: -7.4626228, lng: 112.7480059,                       // titik pasti dari Google Maps
    url: 'https://maps.app.goo.gl/PkMwwPr6fTNHs1Qb6',
    side: 'right'
  },
  {
    id: 'sukses',
    name: 'PT. Candi Sukses Abadi',
    address: 'Jl. Bypass Krian, Semawut, Balongbendo, Kec. Balongbendo, Kabupaten Sidoarjo, Jawa Timur 61263',
    lat: -7.4790, lng: 112.5900,                              // PERKIRAAN. Sesuaikan dengan titik pasti dari Google Maps
    url: 'https://maps.app.goo.gl/12P91W1nhxMzChZS9',
    side: 'left'
  }
];
export const JATIM = [[-8.85, 111.0], [-6.8, 114.45]];                 // batas tampilan Jawa Timur
export const PIN_COLORS = { oxygen: '#0284c7', sukses: '#0A192F' };
