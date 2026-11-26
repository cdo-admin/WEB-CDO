// Kotak pencarian header dengan saran per kategori (dulu initHeaderSearch di main.js).
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { candiSearchCatalog } from '../data/searchCatalog.js';
import { useCms } from '../cms/CmsProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { internalRoute } from '../lib/pages.js';

const GROUPS = [
  ['gases', 'fa-fire-flame-simple text-sky-500', 'PRODUK GAS (INDUSTRIAL & MEDICAL)'],
  ['services', 'fa-wrench text-emerald-500', 'LAYANAN PROFESIONAL (SERVICES)'],
  ['equipment', 'fa-toolbox text-amber-500', 'PERLENGKAPAN GAS (EQUIPMENT)'],
];

/** Katalog bawaan + produk tambahan dari admin (Form Penawaran). */
export function useSearchCatalog() {
  const { model } = useCms();
  return useMemo(() => {
    const extra = ((model.config.quote || {}).products || []).filter((p) => p.name && p.search !== false).map((p) => {
      const c = p.category === 'service' ? 'services' : p.category === 'equipment' ? 'equipment' : 'gases';
      return {
        id: 'cms-' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), keywords: p.name.toLowerCase(), name: p.label || p.name, category: c,
        categoryLabel: { gases: 'PRODUK GAS', services: 'LAYANAN PROFESIONAL', equipment: 'PERLENGKAPAN GAS' }[c],
        desc: p.desc || 'Produk terbaru PT. Candi Oxygen', tag: 'TERBARU', target: 'products.html#section-' + c, specTitle: p.label || p.name,
      };
    });
    return candiSearchCatalog.concat(extra);
  }, [model]);
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = document.getElementById('main-header'), bar = document.getElementById('products-tabbar');
  const offset = (header ? header.offsetHeight : 80) + (bar ? bar.offsetHeight : 0) + 8;
  window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - offset), behavior: 'smooth' });
  return true;
}

export default function HeaderSearch({ wrapClass, inputClass, dropClass, placeholder }) {
  const t = useT();
  const nav = useNavigate();
  const loc = useLocation();
  const catalog = useSearchCatalog();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const query = q.trim().toLowerCase();
  const matches = query ? catalog.filter((it) =>
    it.name.toLowerCase().includes(query) || (it.keywords || '').toLowerCase().includes(query) || it.desc.toLowerCase().includes(query) ||
    it.tag.toLowerCase().includes(query) || it.category.toLowerCase().includes(query)) : [];

  const go = (it) => {
    setOpen(false); setQ('');
    const hash = (it.target.split('#')[1]) || '';
    if (loc.pathname === '/products' && hash && scrollToSection(hash)) { window.history.replaceState(null, '', '#' + hash); return; }
    nav(internalRoute(it.target) || '/products');
  };

  return (
    <div className={wrapClass} ref={wrap}>
      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
      <input type="text" className={inputClass} placeholder={t(placeholder)} autoComplete="off" value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(!!e.target.value.trim()); }}
        onFocus={() => { if (q.trim()) setOpen(true); }} />
      <div className={'header-search-suggestions ' + (dropClass || '') + (open && query ? ' active' : '')}>
        {open && query && !matches.length && (
          <div className="p-4 text-center text-xs text-slate-400">
            <i className="fa-solid fa-magnifying-glass text-slate-300 text-sm mb-1.5 block" />
            {t('Tidak ada produk, layanan, atau alat gas yang cocok.')}
          </div>
        )}
        {open && GROUPS.map(([cat, icon, label]) => {
          const list = matches.filter((m) => m.category === cat);
          if (!list.length) return null;
          return (
            <Fragment key={cat}>
              <div className="search-category-header"><i className={'fa-solid ' + icon} /><span>{t(label)}</span></div>
              {list.map((it) => (
                <div key={it.id} className="search-suggestion-item" onClick={() => go(it)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') go(it); }}>
                  <div className="pr-2">
                    <div className="item-title">{t(it.name)}</div>
                    <div className="item-desc">{t(it.desc)}</div>
                  </div>
                  <span className="item-tag shrink-0">{t(it.tag)}</span>
                </div>
              ))}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
