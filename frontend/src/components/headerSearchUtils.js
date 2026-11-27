import { useMemo } from 'react';
import { candiSearchCatalog } from '../data/searchCatalog.js';
import { useCms } from '../cms/cms.js';

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

