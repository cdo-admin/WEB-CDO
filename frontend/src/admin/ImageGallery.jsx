// Galeri Gambar: semua gambar bawaan di website (dikumpulkan dari kode halaman saat build), bisa diganti sekaligus.
import { useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../lib/pages.js';
import { upsert, removeContent, listContent, uploadMedia, useAdminToast, useFail } from './adminLib.js';

const SOURCES = import.meta.glob(['../pages/*.jsx', '!../pages/*.test.jsx', '../components/Header.jsx', '../components/Footer.jsx'], { query: '?raw', import: 'default', eager: true });
const FILE_PAGE = { HomePage: 'index.html', AboutPage: 'about.html', ProductsPage: 'products.html', PortfolioPage: 'portfolio.html', GalleryPage: 'gallery.html', CareerPage: 'career.html', ContactPage: 'contact.html', QuotePage: 'quote.html' };
const GL_PAGES = [['index.html', 'Beranda'], ['about.html', 'Tentang Kami'], ['products.html', 'Produk & Layanan'], ['portfolio.html', 'Portofolio'], ['gallery.html', 'Galeri Kegiatan'], ['career.html', 'Karir'], ['contact.html', 'Kontak'], ['quote.html', 'Penawaran']];

/** Daftar { src, pages[] } dari <CImg src="..."> di kode halaman. */
function collectImages() {
  const map = {}, order = [];
  Object.entries(SOURCES).forEach(([path, code]) => {
    const name = path.split('/').pop().replace('.jsx', '');
    const pages = FILE_PAGE[name] ? [FILE_PAGE[name]] : Object.values(FILE_PAGE); // header & footer: semua halaman
    const src = code.replace(/<PortfolioGrid>[\s\S]*?<\/PortfolioGrid>/, ''); // foto kartu portofolio diatur di menu Portofolio
    const re = /<CImg\s[^>]*?src=(?:"([^"]+)"|\{"([^"]+)"\})/g;
    let m;
    while ((m = re.exec(src))) {
      const s = m[1] || m[2];
      if (!s || /^data:/.test(s)) continue;
      if (!map[s]) { map[s] = { src: s, pages: [] }; order.push(s); }
      pages.forEach((p) => { if (map[s].pages.indexOf(p) < 0) map[s].pages.push(p); });
    }
  });
  return order.map((s) => map[s]);
}
const glName = (s) => { try { return decodeURIComponent(s.split('?')[0].split('/').pop()); } catch { return s.split('/').pop(); } };
const pageLabel = (f) => (GL_PAGES.find((x) => x[0] === f) || [f, f])[1];

export default function ImageGallery() {
  const toast = useAdminToast(), fail = useFail();
  const imgs = useMemo(() => collectImages(), []);
  const [ov, setOv] = useState({});
  const [page, setPage] = useState('');
  const [only, setOnly] = useState(false);
  const target = useRef(null), file = useRef(null);

  const load = () => listContent({ kind: 'img', scope: '' }).then((r) => { const o = {}; (r || []).forEach((x) => { o[x.key] = x.value_id; }); setOv(o); }).catch(fail);
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f || !target.current) return;
    const src = target.current, png = /\.png$/i.test(src) && /logo|icon/i.test(src);
    toast('Mengunggah & mengecilkan foto…');
    uploadMedia(f, png ? 800 : 1920, png)
      .then((u) => upsert([{ kind: 'img', key: src, scope: '', value_id: u }]).then(() => setOv((o) => ({ ...o, [src]: u }))))
      .then(() => toast('Gambar diganti, langsung tampil di website')).catch(fail);
  };
  const reset = (src) => removeContent({ kind: 'img', key: src, scope: '' }).then(() => { setOv((o) => { const n = { ...o }; delete n[src]; return n; }); toast('Dikembalikan ke gambar asli'); }).catch(fail);
  const list = imgs.filter((i) => (!page || i.pages.indexOf(page) >= 0) && (!only || ov[i.src]));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Galeri Gambar</h2><p className="text-xs text-slate-500">Semua gambar di website, dikumpulkan dari seluruh halaman. Klik <b>Ganti</b> lalu pilih foto dari komputer. Foto otomatis dikecilkan, dan langsung tampil di website.</p></div>
        <button type="button" className="btn btn-ghost" onClick={load}><i className="fa-solid fa-rotate" /> Muat ulang</button>
      </div>
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-[200px]">
          {[['', 'Semua']].concat(GL_PAGES).map(([p, l]) => {
            const n = p ? imgs.filter((i) => i.pages.indexOf(p) >= 0).length : imgs.length;
            return <button key={p} type="button" onClick={() => setPage(p)} className={'text-xs font-semibold px-3 py-1.5 rounded-full border ' + (page === p ? 'bg-sky-700 text-white border-sky-700' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50')}>{l} <span className="opacity-70">{n}</span></button>;
          })}
        </div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer"><input type="checkbox" checked={only} onChange={(e) => setOnly(e.target.checked)} /> Hanya yang sudah diganti</label>
      </div>
      <div className="mb-4 text-[11px] text-slate-500"><p><i className="fa-solid fa-circle-info" /> Foto kartu proyek di halaman Portofolio diganti lewat menu <b>Portofolio</b>.</p></div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {!list.length && <div className="text-sm text-slate-500 col-span-full">{only ? 'Belum ada gambar yang diganti.' : 'Tidak ada gambar.'}</div>}
        {list.map((i) => {
          const o = ov[i.src];
          return (
            <div key={i.src} className="card overflow-hidden">
              <div className="h-40 bg-slate-100 relative">
                <img src={assetUrl(o || i.src)} className="w-full h-full object-contain" alt="" loading="lazy" />
                {o && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">SUDAH DIGANTI</span>}
              </div>
              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-800 break-all line-clamp-1" title={i.src}>{glName(i.src)}</div>
                <div className="text-[11px] text-slate-500">Dipakai di: {i.pages.map(pageLabel).join(', ')}</div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-primary !py-1.5 flex-1 justify-center" onClick={() => { target.current = i.src; file.current.click(); }}><i className="fa-solid fa-upload" /> Ganti</button>
                  {o && <button type="button" className="btn btn-ghost !py-1.5" title="Kembali ke gambar asli" onClick={() => reset(i.src)}><i className="fa-solid fa-rotate-left" /> Asli</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <input ref={file} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </>
  );
}
