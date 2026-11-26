/* Galeri Kegiatan: foto kegiatan kantor dari admin (GET /api/gallery). Klik -> jendela foto besar + deskripsi.
   Bila kosong, tampil pesan ramah. Dulu assets/js/gallery.js. */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { assetUrl } from '../lib/pages.js';

const photosOf = (it) => { const a = [it.image_url].concat(Array.isArray(it.photos) ? it.photos : []).filter(Boolean); return a.filter((u, i) => a.indexOf(u) === i); };

export default function ActivityGallery() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState(null);
  const [cur, setCur] = useState(null); // [index, foto]
  useEffect(() => { api('/gallery').then((r) => setItems(r || []), () => setItems([])); }, []);

  const pick = (it, k) => { const en = it.en || {}; return lang === 'en' && en[k] && String(en[k]).trim() ? String(en[k]).trim() : (it[k] || ''); };
  const fmt = (d) => {
    if (!d) return '';
    const dt = new Date(String(d).slice(0, 10) + 'T00:00:00'); if (isNaN(dt)) return '';
    try { return dt.toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return String(d); }
  };
  const step = (n) => setCur((c) => { if (!c) return c; const L = photosOf(items[c[0]]).length; return L < 2 ? c : [c[0], (c[1] + n + L) % L]; });

  useEffect(() => {
    if (!cur) return undefined;
    document.documentElement.style.overflow = 'hidden';
    const key = (e) => { if (e.key === 'Escape') setCur(null); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1); };
    document.addEventListener('keydown', key);
    return () => { document.documentElement.style.overflow = ''; document.removeEventListener('keydown', key); };
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  if (items === null) {
    return (
      <div className="text-center py-16 text-slate-500">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-sky-500" />
        <p className="mt-3 text-sm">{t('Memuat galeri…')}</p>
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="text-center py-16"><div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-3xl"><i className="fa-regular fa-images" /></div>
        <h2 className="mt-6 text-xl font-bold text-navy-900">{t('Oops, sepertinya belum ada kegiatan yang dipost di sini')}</h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">{t('Foto-foto keseruan kegiatan kantor kami akan tampil di halaman ini. Silakan kembali lagi nanti ya!')}</p>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-navy-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-sky-600 transition-colors">{t('Kembali ke Beranda')}</Link>
      </div></div>
    );
  }

  const it = cur && items[cur[0]], ph = it ? photosOf(it) : [];
  return (
    <>
      <div id="gl-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((x, i) => {
          const p = photosOf(x), d = fmt(x.event_date), desc = pick(x, 'description');
          return (
            <button key={x.id} type="button" onClick={() => setCur([i, 0])} className="group text-left bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {p[0] ? <img src={assetUrl(p[0])} alt={pick(x, 'title')} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl"><i className="fa-regular fa-image" /></div>}
                {p.length > 1 && <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2 py-1 rounded-full"><i className="fa-regular fa-images mr-1" />{p.length}</span>}
              </div>
              <div className="p-5">
                {d && <div className="text-[11px] font-mono uppercase tracking-widest text-sky-600 mb-1">{d}</div>}
                <h3 className="font-bold text-navy-900 leading-snug">{pick(x, 'title')}</h3>
                {desc && <p className="text-sm text-slate-500 mt-2 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</p>}
              </div>
            </button>
          );
        })}
      </div>
      {it && (
        <div id="gl-modal" className="fixed inset-0 z-[80] bg-navy-950/90 backdrop-blur-sm overflow-y-auto" style={{ padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) setCur(null); }}>
          <div className="relative bg-white rounded-sm shadow-2xl max-w-4xl mx-auto my-4 sm:my-8 overflow-hidden" role="dialog" aria-modal="true">
            <button type="button" onClick={() => setCur(null)} className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 text-navy-900 shadow flex items-center justify-center text-xl leading-none" aria-label={t('Tutup')}>&times;</button>
            {ph.length > 0 && (
              <div className="relative bg-black flex items-center justify-center" style={{ minHeight: '14rem' }}>
                <img src={assetUrl(ph[cur[1]] || ph[0])} alt={pick(it, 'title')} className="max-w-full object-contain" style={{ maxHeight: '70vh' }} />
                {ph.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label={t('Sebelumnya')}>‹</button>
                    <button type="button" onClick={() => step(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label={t('Berikutnya')}>›</button>
                  </>
                )}
              </div>
            )}
            {ph.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 bg-slate-100">
                {ph.map((u, k) => (
                  <button key={k} type="button" onClick={() => setCur([cur[0], k])} className={'shrink-0 w-16 h-12 rounded overflow-hidden border-2 ' + (k === cur[1] ? 'border-sky-500' : 'border-transparent opacity-70')}>
                    <img src={assetUrl(u)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="p-6 sm:p-8 space-y-3">
              {fmt(it.event_date) && <div className="text-xs font-mono uppercase tracking-widest text-sky-600">{fmt(it.event_date)}</div>}
              <h2 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-navy-900 leading-snug">{pick(it, 'title')}</h2>
              {pick(it, 'description') && (
                <div className="text-slate-600 text-sm leading-7">
                  {pick(it, 'description').split(/\n+/).filter((x) => x.trim()).map((x, i) => <p key={i} className="mb-3">{x}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
