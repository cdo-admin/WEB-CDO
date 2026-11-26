// Tab kategori halaman Produk: klik -> scroll halus ke kategori, plus penanda tab yang sedang dilihat (scroll-spy).
import { useEffect, useRef, useState } from 'react';
import { T } from '../cms/components.jsx';

const TABS = [['all', 'Semua Koleksi'], ['gases', 'Gas Industri & Medis'], ['services', 'Layanan Profesional'], ['equipment', 'Perlengkapan Gas']];
const TARGETS = { all: 'catalog-start', gases: 'section-gases', services: 'section-services', equipment: 'section-equipment' };
const ON = 'bg-navy-900 text-white shadow-sm', OFF = 'bg-white text-navy-900 border border-slate-200 hover:border-navy-900';

function offset() {
  const h = document.getElementById('main-header'), b = document.getElementById('products-tabbar');
  return (h ? h.offsetHeight : 80) + (b ? b.offsetHeight : 0) + 8;
}

export default function ProductTabs() {
  const [active, setActive] = useState('all');
  const lock = useRef(0);

  useEffect(() => {
    let ticking = false;
    const spy = () => {
      ticking = false;
      if (Date.now() < lock.current) return;
      const line = offset() + 40;
      let cur = 'all';
      ['gases', 'services', 'equipment'].forEach((c) => { const el = document.getElementById(TARGETS[c]); if (el && el.getBoundingClientRect().top <= line) cur = c; });
      setActive(cur);
    };
    const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const go = (cat) => {
    const el = document.getElementById(TARGETS[cat]);
    if (!el) return;
    let y = el.getBoundingClientRect().top + window.pageYOffset - offset();
    if (cat === 'all') y -= 40;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    setActive(cat);
    lock.current = Date.now() + 900;
    window.history.replaceState(null, '', cat === 'all' ? window.location.pathname + window.location.search : '#' + TARGETS[cat]);
  };

  return TABS.map(([cat, label]) => (
    <button key={cat} type="button" data-category={cat} aria-current={active === cat ? 'true' : undefined} onClick={() => go(cat)}
      className={'products-tab-btn px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.14em] transition-all ' + (active === cat ? ON : OFF)}>
      <T>{label}</T>
    </button>
  ));
}
