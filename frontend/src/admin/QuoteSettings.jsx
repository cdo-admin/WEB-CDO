// Form Penawaran: atur produk, ukuran, dan sub pilihan (varian) yang bisa dipesan pengunjung.
import { useEffect, useState } from 'react';
import { QUOTE_BASE_OPTIONS, PER_PRODUCT, SPECS, VARIANTS } from '../data/quoteOptions.js';
import { getConfig, setConfig, useAdminToast, useFail } from './common.jsx';

const CATS = { gas: 'Produk Gas', service: 'Layanan', equipment: 'Perlengkapan' };
const lines = (items) => (items || []).map((i) => (typeof i === 'string' ? i : i[0] === i[1] ? i[0] : i[0] + ' | ' + i[1])).join('\n');
const parseLines = (t) => t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const p = l.split('|').map((x) => x.trim()); return p.length > 1 && p[1] ? [p[0], p[1]] : p[0]; });
const flatSpecs = (cat, name) => (PER_PRODUCT[name] || SPECS[cat] || []).flatMap((g) => g.items);

function buildRows(cfg) {
  const rows = QUOTE_BASE_OPTIONS.map((o) => {
    const ov = cfg.overrides[o.value] || {};
    const specs = lines(ov.specs || flatSpecs(o.category, o.value));
    const variant = ov.variant === false ? null : (ov.variant || VARIANTS[o.value] || null);
    return { key: o.value, label: o.label, category: o.category, shown: cfg.hidden.indexOf(o.value) === -1, specs, init: specs, variant, vOn: !!variant, isNew: false };
  });
  cfg.products.forEach((p) => {
    const specs = lines(p.specs || flatSpecs(p.category, p.name));
    rows.push({ key: p.name, label: p.label || p.name, category: p.category, shown: true, specs, init: specs, variant: p.variant || null, vOn: !!p.variant, isNew: true, old: p });
  });
  return rows.map((r) => ({ ...r, vLabel: r.variant ? r.variant.label : '', vPh: r.variant ? r.variant.placeholder : '', vItems: r.variant ? lines(r.variant.items) : '' }));
}

export default function QuoteSettings() {
  const toast = useAdminToast(), fail = useFail();
  const [rows, setRows] = useState(null);
  const load = () => getConfig('quote').then((c) => {
    const cfg = { products: [], hidden: [], overrides: {}, ...(c || {}) };
    setRows(buildRows(cfg));
  }).catch(fail);
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const upd = (i, patch) => setRows((r) => r.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const add = () => {
    const name = (window.prompt('Nama produk baru (contoh: Hidrogen (H2))') || '').trim(); if (!name) return;
    let cat = (window.prompt('Kategori? ketik: gas, service, atau equipment', 'gas') || 'gas').trim().toLowerCase();
    if (!CATS[cat]) cat = 'gas';
    const specs = lines(flatSpecs(cat, name));
    setRows((r) => r.concat([{ key: name, label: name, category: cat, shown: true, specs, init: specs, variant: null, vOn: false, isNew: true, vLabel: '', vPh: '', vItems: '' }]));
  };
  const save = () => {
    const cfg = { products: [], hidden: [], overrides: {} };
    rows.forEach((r) => {
      const specs = parseLines(r.specs), changed = r.specs !== r.init;
      let variant = null;
      if (r.vOn) { const items = parseLines(r.vItems); if (items.length) variant = { label: r.vLabel.trim() || 'Pilih jenis *', placeholder: r.vPh.trim() || 'Pilih...', items }; }
      if (r.isNew) {
        const old = r.old || {};
        cfg.products.push({ name: r.key, label: old.label || r.key, category: r.category, specs: changed || old.specs ? specs : null, variant, search: old.search !== false });
        return;
      }
      if (!r.shown) cfg.hidden.push(r.key);
      const ov = {}, baseVar = VARIANTS[r.key] || null;
      if (changed) ov.specs = specs;
      if (JSON.stringify(variant) !== JSON.stringify(baseVar)) ov.variant = variant || false;
      if (ov.specs || ov.variant !== undefined) cfg.overrides[r.key] = ov;
    });
    setConfig('quote', cfg).then(() => { toast('Form penawaran tersimpan'); load(); }).catch(fail);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Produk di Form Penawaran</h2><p className="text-xs text-slate-500">Atur produk, ukuran, dan sub pilihan (misal WG / HP / UHP) yang bisa dipesan pengunjung.</p></div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost" onClick={add} disabled={!rows}><i className="fa-solid fa-plus" /> Produk baru</button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={!rows}><i className="fa-solid fa-floppy-disk" /> Simpan semua</button>
        </div>
      </div>
      <div className="card p-4 mb-4 text-xs text-slate-600 space-y-1">
        <p><b>Format baris:</b> tulis satu pilihan per baris. Contoh: <code>Tabung 6m³</code>. Jika tulisan di dropdown ingin berbeda dengan nilai yang dikirim: <code>nilai | tulisan</code>, contoh <code>HP | HP (High Purity)</code>.</p>
        <p>Pilihan <b>Kustom</b> otomatis selalu ada di akhir daftar ukuran. Kosongkan daftar ukuran jika produk hanya boleh Kustom.</p>
      </div>
      <div className="space-y-3">
        {!rows ? <p className="text-sm text-slate-500">Memuat…</p> : rows.map((r, i) => (
          <div className="card p-4" key={r.key}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="font-bold text-sm flex-1 min-w-[160px]">{r.label} <span className="text-[10px] font-normal text-slate-400">{CATS[r.category]}{r.isNew ? ' · baru' : ''}</span></div>
              {!r.isNew && <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={r.shown} onChange={(e) => upd(i, { shown: e.target.checked })} /> Tampil di form</label>}
              {r.isNew && <button type="button" className="btn btn-danger !py-1" onClick={() => { if (window.confirm('Hapus produk ini dari form penawaran?')) setRows(rows.filter((_, k) => k !== i)); }}><i className="fa-solid fa-trash" /></button>}
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div><label className="lbl">Ukuran / spesifikasi (satu per baris)</label><textarea className="inp font-mono text-xs" rows="5" value={r.specs} onChange={(e) => upd(i, { specs: e.target.value })} /></div>
              <div>
                <label className="flex items-center gap-2 lbl"><input type="checkbox" checked={r.vOn} onChange={(e) => upd(i, { vOn: e.target.checked })} /> Pakai sub pilihan (varian)</label>
                {r.vOn && (
                  <div className="space-y-2">
                    <input className="inp" placeholder="Judul, contoh: Tingkat Kemurnian *" value={r.vLabel} onChange={(e) => upd(i, { vLabel: e.target.value })} />
                    <input className="inp" placeholder="Teks awal, contoh: Pilih tingkat kemurnian..." value={r.vPh} onChange={(e) => upd(i, { vPh: e.target.value })} />
                    <textarea className="inp font-mono text-xs" rows="3" placeholder="WG | WG (Welding Grade)" value={r.vItems} onChange={(e) => upd(i, { vItems: e.target.value })} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
