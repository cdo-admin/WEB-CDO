// Pilihan produk, ukuran, dan varian form penawaran: bawaan (quoteOptions.js) + perubahan dari admin.
import { useMemo } from 'react';
import { useCms } from '../cms/CmsProvider.jsx';
import { QUOTE_BASE_OPTIONS, PER_PRODUCT as BASE_PP, VARIANTS as BASE_VAR, SPECS, CUSTOM_SPEC } from './quoteOptions.js';

const CAT_LABELS = { gas: 'Produk Gas', service: 'Layanan Servis', equipment: 'Perlengkapan Gas' };

export function buildQuoteConfig(cfg = {}) {
  const products = cfg.products || [], hidden = cfg.hidden || [], over = cfg.overrides || {};
  const PER_PRODUCT = JSON.parse(JSON.stringify(BASE_PP));
  const VARIANTS = JSON.parse(JSON.stringify(BASE_VAR));
  const options = QUOTE_BASE_OPTIONS.filter((o) => hidden.indexOf(o.value) === -1).map((o) => ({ ...o }));
  products.forEach((p) => {
    if (!p.name || options.some((o) => o.value === p.name)) return;
    const cat = p.category || 'gas';
    const o = { value: p.name, label: p.label || p.name, category: cat, catLabel: p.catLabel || CAT_LABELS[cat] || 'Produk Gas', extra: true };
    let idx = -1;
    options.forEach((x, i) => { if (x.category === cat) idx = i; });
    if (idx >= 0) { o.group = options[idx].group; options.splice(idx + 1, 0, o); } else options.push(o);
    if (p.specs) PER_PRODUCT[p.name] = [{ label: 'Ukuran / Spesifikasi', items: p.specs }];
    if (p.variant && p.variant.items && p.variant.items.length) VARIANTS[p.name] = p.variant;
  });
  Object.keys(over).forEach((name) => {
    const ov = over[name] || {};
    if (ov.specs) PER_PRODUCT[name] = [{ label: 'Ukuran / Spesifikasi', items: ov.specs }];
    if (ov.variant === false) delete VARIANTS[name];
    else if (ov.variant && ov.variant.items && ov.variant.items.length) VARIANTS[name] = ov.variant;
  });
  return { options, PER_PRODUCT, VARIANTS, SPECS, CUSTOM_SPEC };
}

export function useQuoteConfig() {
  const { model } = useCms();
  return useMemo(() => buildQuoteConfig(model.config.quote), [model]);
}

export const pair = (it) => (typeof it === 'string' ? [it, it] : it);
export const isCustom = (v) => CUSTOM_SPEC.indexOf(v) !== -1;
/** "Mixed Gases" + "ArO" -> "Mixed Gases (ArO)"; "Nitrogen (N2)" + "HP" -> "Nitrogen (N2, HP)" */
export function compose(name, variant) {
  if (!variant) return name;
  return name.slice(-1) === ')' ? name.slice(0, -1) + ', ' + variant + ')' : name + ' (' + variant + ')';
}
/** Kelompok ukuran untuk produk (+ opsi Kustom di akhir). */
export function specGroups(qc, name, category, variant) {
  const full = compose(name, variant);
  const g = (qc.PER_PRODUCT[full] || qc.PER_PRODUCT[name] || qc.SPECS[category] || []).slice();
  g.push({ label: g.length ? 'Spesifikasi Khusus' : '', items: [[CUSTOM_SPEC[0], CUSTOM_SPEC[1]]] });
  return g;
}
