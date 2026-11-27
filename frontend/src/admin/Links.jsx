// Link Pelacak: link berparameter utm_source agar menu Statistik tahu persis asal pengunjung.
import { useState } from 'react';
import { PAGE_ROUTES, PAGE_LABELS } from '../lib/pages.js';
import { useAdminToast } from './adminLib.js';

const LK_SRC = [
  ['instagram', 'social', 'Instagram', 'fa-brands fa-instagram', '#e1306c', 'Tempel di kolom "Situs web" pada Edit Profil Instagram.'],
  ['whatsapp', 'messaging', 'WhatsApp', 'fa-brands fa-whatsapp', '#16a34a', 'Tempel di profil bisnis / info WhatsApp atau di status.'],
  ['linkedin', 'social', 'LinkedIn', 'fa-brands fa-linkedin-in', '#0a66c2', 'Tempel di kolom "Situs web" pada halaman LinkedIn perusahaan.'],
  ['tiktok', 'social', 'TikTok', 'fa-brands fa-tiktok', '#111827', 'Tempel di kolom "Situs web" pada profil TikTok (akun bisnis).'],
  ['facebook', 'social', 'Facebook', 'fa-brands fa-facebook-f', '#1877f2', 'Tempel di bagian Info atau tombol ajakan pada Halaman Facebook.'],
  ['email', 'email', 'Email / newsletter', 'fa-solid fa-envelope', '#f59e0b', 'Tempel di tanda tangan email atau isi newsletter.'],
  ['brosur', 'offline', 'Brosur / QR code', 'fa-solid fa-qrcode', '#64748b', 'Ubah menjadi QR code (misal lewat qr-code-generator.com) lalu cetak.'],
  ['google-bisnisku', 'search', 'Google Business Profile', 'fa-brands fa-google', '#ea4335', 'Tempel di kolom "Situs web" pada profil Bisnis Google.'],
];
function copyText(t) {
  return (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(t) : Promise.reject()).catch(() => {
    const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch { /* ignore */ } ta.remove();
  });
}

export default function Links() {
  const toast = useAdminToast();
  const [page, setPage] = useState('index.html');
  const [camp, setCamp] = useState('');
  const [copied, setCopied] = useState(-1);
  const url = (s) => {
    let u = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, '') + PAGE_ROUTES[page] + '?utm_source=' + encodeURIComponent(s[0]) + '&utm_medium=' + s[1];
    const c = camp.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-'); if (c) u += '&utm_campaign=' + encodeURIComponent(c);
    return u;
  };
  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Link Pelacak</h2>
      <p className="text-xs text-slate-500 mb-4 max-w-2xl">Cara pakai: <b>(1)</b> pilih halaman tujuan, <b>(2)</b> klik <b>Salin link</b> di baris tempat Anda mau memasangnya, <b>(3)</b> tempel di bio / profil tempat itu. Setelah itu menu Statistik tahu persis berapa pengunjung yang datang dari sana.</p>
      <div className="card p-4 max-w-3xl mb-4">
        <label className="lbl">1. Pengunjung diarahkan ke halaman mana?</label>
        <select className="inp max-w-sm" value={page} onChange={(e) => setPage(e.target.value)}>{PAGE_LABELS.map(([p, l]) => <option key={p} value={p}>{l}</option>)}</select>
        <details className="mt-3"><summary className="text-xs font-semibold text-slate-500 cursor-pointer">Opsi tambahan (boleh dilewati)</summary>
          <div className="mt-2 max-w-sm"><label className="lbl">Nama kampanye</label><input className="inp" placeholder="contoh: promo-nov-2026" value={camp} onChange={(e) => setCamp(e.target.value)} /><p className="text-[11px] text-slate-400 mt-1">Hanya berguna bila ingin membedakan beberapa promo di tempat yang sama.</p></div></details>
      </div>
      <div className="max-w-3xl"><div className="lbl mb-2">2. Salin link untuk tempat yang Anda pakai</div>
        <div className="space-y-2">
          {LK_SRC.map((s, i) => (
            <div key={s[0]} className="card p-3 flex flex-wrap items-center gap-3">
              <div className="w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0" style={{ background: s[4] }}><i className={s[3]} /></div>
              <div className="flex-1 min-w-[180px]"><div className="text-sm font-bold text-slate-900">{s[2]}</div><div className="text-[11px] text-slate-500">{s[5]}</div><div className="text-[10px] text-slate-400 font-mono truncate max-w-md">{url(s)}</div></div>
              <button type="button" className="btn btn-primary" onClick={() => copyText(url(s)).then(() => { toast('Link ' + s[2] + ' disalin. Tinggal tempel.'); setCopied(i); setTimeout(() => setCopied(-1), 2000); })}>
                {copied === i ? <><i className="fa-solid fa-check" /> Tersalin</> : <><i className="fa-regular fa-copy" /> Salin link</>}
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-4 max-w-3xl"><i className="fa-solid fa-circle-info" /> Instagram, WhatsApp, dan TikTok sering menyembunyikan asal pengunjung. Karena itu pasang link khusus di atas, bukan link biasa. Link yang lama tetap berfungsi, hanya saja tidak tercatat dari mana asalnya.</p>
    </>
  );
}
