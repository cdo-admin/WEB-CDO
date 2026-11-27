/* Portofolio: tombol filter, daftar proyek dari admin (GET /api/portfolio), dan jendela detail proyek.
   Selama admin belum mengaktifkan "atur dari admin", kartu bawaan di halaman (children) yang dipakai. */
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../i18n/i18n.js';
import { T } from '../cms/components.jsx';
import { useCms } from '../cms/cms.js';
import { assetUrl } from '../lib/pages.js';
import { PF_BADGE, PF_TXT } from './portfolioColors.js';

const PF_KEY = 'candiPortfolioCache2';
const BASE_FILTERS = [['all', 'Semua Proyek'], ['medis', 'Medis & Rumah Sakit'], ['kriogenik', 'Filling Station & Dewars'], ['industri', 'Industri & Fabrikasi Baja']];
const ON = 'bg-navy-900 text-white shadow-luxury-sm', OFF = 'bg-white text-navy-900 border border-slate-200 hover:border-navy-900';

const Ctx = createContext(null);
const readCache = () => { try { return JSON.parse(localStorage.getItem(PF_KEY) || 'null'); } catch { return null; } };

export function PortfolioProvider({ children }) {
  const { edit } = useCms();
  const [state, setState] = useState(() => (edit ? null : readCache()));
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    if (edit) return;
    api('/portfolio').then((st) => { setState(st); try { localStorage.setItem(PF_KEY, JSON.stringify(st)); } catch { /* ignore */ } }).catch(() => {});
  }, [edit]);
  return (
    <Ctx.Provider value={{ state: state && state.managed ? state : null, filter, setFilter, setDetail }}>
      {children}
      {detail && <PortfolioDetail p={detail} onClose={() => setDetail(null)} />}
    </Ctx.Provider>
  );
}

export function PortfolioFilters() {
  const { t, lang } = useI18n();
  const { state, filter, setFilter } = useContext(Ctx);
  const extra = state ? (state.filters || []).filter((f) => f && f.key && f.label).concat([{ key: 'lainnya', label: 'Lainnya', en: 'Others' }]) : [];
  return (
    <>
      {BASE_FILTERS.map(([key, label]) => (
        <button key={key} type="button" data-filter={key} onClick={() => setFilter(key)}
          className={'portfolio-filter-btn px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all ' + (filter === key ? ON : OFF)}>
          <T>{label}</T>
        </button>
      ))}
      {extra.map((f) => (
        <button key={f.key} type="button" data-filter={f.key} onClick={() => setFilter(f.key)}
          className={'portfolio-filter-btn px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all ' + (filter === f.key ? ON : OFF)}>
          {lang === 'en' && f.en ? f.en : t(f.label)}
        </button>
      ))}
    </>
  );
}

/** Ambil isi teks dari kartu bawaan (yang belum diatur admin) untuk jendela detail. */
function fromDom(el) {
  const q = (s) => { const n = el.querySelector(s); return n ? n.textContent.trim() : ''; };
  const im = el.querySelector('img'), sp = el.querySelectorAll('.p-8 > div > span'), ft = el.querySelectorAll('.border-t span');
  return {
    title: q('h3'), image_url: im ? im.getAttribute('src') : '', image_alt: im ? im.alt : '', badge: q('.absolute.top-4'),
    location: sp[0] ? sp[0].textContent.trim() : '', status: sp[1] ? sp[1].textContent.trim() : '', description: q('.p-8 > p'),
    foot_left: ft[0] ? ft[0].textContent.trim() : '', foot_right: ft[1] ? ft[1].textContent.trim() : '',
    badge_color: 'navy', status_color: 'emerald', foot_color: 'emerald', detail: '', gallery: [], fromDom: true,
  };
}

export function PortfolioGrid({ children }) {
  const { lang } = useI18n();
  const { state, filter, setDetail } = useContext(Ctx);
  const box = useRef(null);
  const pick = (p, k) => { const en = p.en || {}; return lang === 'en' && en[k] && String(en[k]).trim() ? String(en[k]).trim() : (p[k] || ''); };

  // filter dengan animasi memudar (sama seperti versi lama)
  useEffect(() => {
    const timers = [];
    box.current?.querySelectorAll('.portfolio-item').forEach((item) => {
      const show = filter === 'all' || item.getAttribute('data-category') === filter;
      if (show) { item.style.display = ''; timers.push(setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10)); }
      else { item.style.opacity = '0'; item.style.transform = 'scale(0.96)'; timers.push(setTimeout(() => { item.style.display = 'none'; }, 300)); }
    });
    return () => timers.forEach(clearTimeout);
  }, [filter, state, children]);

  const open = (e) => {
    const el = e.target.closest('.portfolio-item');
    if (!el || (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ')) return;
    if (e.type === 'keydown') e.preventDefault();
    const id = el.getAttribute('data-pf-id');
    const p = id && state ? state.items.find((x) => String(x.id) === id) : null;
    setDetail(p || fromDom(el));
  };

  return (
    <div id="portfolio-container" ref={box} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" onClick={open} onKeyDown={open}>
      {!state ? children : !state.items.length ? (
        <div className="col-span-full text-center text-slate-500 text-sm py-16"><T>Daftar proyek segera diperbarui.</T></div>
      ) : state.items.map((p) => {
        const sc = PF_TXT[p.status_color] || PF_TXT.emerald, fc = PF_TXT[p.foot_color] || PF_TXT.emerald;
        return (
          <div key={p.id} className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300 cursor-pointer"
            tabIndex={0} role="button" data-pf-id={p.id} data-category={p.category || 'industri'}>
            <div className="relative h-64 overflow-hidden bg-slate-200">
              {p.image_url && <img src={assetUrl(p.image_url)} alt={p.image_alt || p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              {p.badge && <div className="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm" style={{ background: PF_BADGE[p.badge_color] || PF_BADGE.navy }}>{pick(p, 'badge')}</div>}
            </div>
            <div className="p-8 space-y-4">
              {(p.location || p.status) && (
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400"><span>{pick(p, 'location')}</span><span className="font-mono font-semibold text-right" style={{ color: sc }}>{pick(p, 'status')}</span></div>
              )}
              <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors">{pick(p, 'title')}</h3>
              {p.description && <p className="text-slate-600 text-xs leading-relaxed">{pick(p, 'description')}</p>}
              {(p.foot_left || p.foot_right) && (
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 text-[11px] text-slate-500 font-mono"><span>{pick(p, 'foot_left')}</span><span className="font-bold text-right" style={{ color: fc }}>{pick(p, 'foot_right')}</span></div>
              )}
              <div className="pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600 group-hover:text-navy-900 transition-colors"><T>Lihat Detail →</T></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PortfolioDetail({ p, onClose }) {
  const { t, lang } = useI18n();
  const [zoom, setZoom] = useState(-1);
  const pick = (k) => { if (p.fromDom) return p[k] || ''; const en = p.en || {}; return lang === 'en' && en[k] && String(en[k]).trim() ? String(en[k]).trim() : (p[k] || ''); };
  const g = (p.gallery || []).filter(Boolean);
  const detail = pick('detail');

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const key = (e) => {
      if (e.key === 'Escape') setZoom((z) => { if (z >= 0) return -1; onClose(); return z; });
      if (e.key === 'ArrowRight') setZoom((z) => (z >= 0 ? (z + 1) % g.length : z));
      if (e.key === 'ArrowLeft') setZoom((z) => (z >= 0 ? (z - 1 + g.length) % g.length : z));
    };
    document.addEventListener('keydown', key);
    return () => { document.documentElement.style.overflow = ''; document.removeEventListener('keydown', key); };
  }, [onClose, g.length]);

  const chips = [pick('foot_left'), pick('foot_right')].filter(Boolean);
  return (
    <>
      <div id="pf-detail" className="fixed inset-0 z-[70] bg-navy-950/80 backdrop-blur-sm overflow-y-auto" style={{ padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="relative bg-white rounded-sm shadow-2xl max-w-4xl mx-auto my-4 sm:my-8 overflow-hidden" role="dialog" aria-modal="true">
          <button type="button" onClick={onClose} className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 text-navy-900 shadow flex items-center justify-center text-xl leading-none" aria-label={t('Tutup')}>&times;</button>
          {p.image_url && (
            <div className="relative h-56 sm:h-80 bg-slate-200">
              <img src={assetUrl(p.image_url)} alt={p.image_alt || p.title} className="w-full h-full object-cover" />
              {p.badge && <div className="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm" style={{ background: PF_BADGE[p.badge_color] || PF_BADGE.navy }}>{pick('badge')}</div>}
            </div>
          )}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono">{t('Ikhtisar Proyek')}</span>
              {(p.location || p.status) && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500"><span>{pick('location')}</span><span className="font-mono font-semibold" style={{ color: PF_TXT[p.status_color] || PF_TXT.emerald }}>{pick('status')}</span></div>
              )}
              <h2 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-navy-900 leading-snug">{pick('title')}</h2>
              {p.description && <p className="text-slate-600 text-sm leading-relaxed">{pick('description')}</p>}
              {chips.length > 0 && <div className="flex flex-wrap gap-2 pt-1">{chips.map((x, i) => <span key={i} className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">{x}</span>)}</div>}
            </div>
            {detail && (
              <div className="space-y-3 pt-6 border-t border-slate-200">
                <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono">{t('Penjelasan')}</span>
                <div className="text-slate-700 text-sm leading-7" style={{ whiteSpace: 'pre-line' }}>{detail}</div>
              </div>
            )}
            {g.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-200">
                <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono">{t('Galeri Foto')}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {g.map((u, i) => (
                    <button key={i} type="button" onClick={() => setZoom(i)} className="block h-36 sm:h-44 overflow-hidden rounded-sm bg-slate-200 group">
                      <img src={assetUrl(u)} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-2 text-center"><button type="button" onClick={onClose} className="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full">{t('Tutup')}</button></div>
          </div>
        </div>
      </div>
      {zoom >= 0 && g[zoom] && (
        <div id="pf-zoom" className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setZoom(-1); }}>
          <img src={assetUrl(g[zoom])} alt="" className="max-w-full max-h-full object-contain" />
          <button type="button" onClick={() => setZoom(-1)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-xl leading-none" aria-label={t('Tutup')}>&times;</button>
          {g.length > 1 && (
            <>
              <button type="button" onClick={() => setZoom((zoom - 1 + g.length) % g.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label={t('Sebelumnya')}>‹</button>
              <button type="button" onClick={() => setZoom((zoom + 1) % g.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label={t('Berikutnya')}>›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
