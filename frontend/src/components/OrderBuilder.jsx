/* Tabel pesanan dinamis di halaman Ajukan Penawaran (dulu initDynamicOrderTable di main.js + quote-options.js).
   Isi tabel = isi keranjang, jadi pesanan dari halaman Produk otomatis muncul di sini. */
import { Fragment, useEffect, useRef, useState } from 'react';
import { T, TH } from '../cms/components.jsx';
import { useI18n } from '../i18n/i18n.js';
import { SpecOptions } from './Cart.jsx';
import { useCart } from './cartContext.js';
import { useToast } from './toastContext.js';
import { useQuoteConfig, pair, isCustom, compose, specGroups } from '../data/useQuoteConfig.js';
import { TEXT } from '../data/quoteOptions.js';
import { builderReset } from './orderBuilderReset.js';

const PRESETS = [
  ['Oksigen Medis', 'Tabung 6m³', '5', 'gas', 'Produk Gas', '+ 5 Tabung Oksigen Medis 6m³'],
  ['Oksigen Industri', 'Tabung 6m³', '10', 'gas', 'Produk Gas', '+ 10 Tabung Oksigen Industri 6m³'],
  ['Nitrogen', 'Tabung 6m³', '5', 'gas', 'Produk Gas', '+ 5 Tabung Nitrogen 6m³'],
  ['Argon', 'Tabung 6m³', '5', 'gas', 'Produk Gas', '+ 5 Tabung Argon 6m³'],
  ['Gas Piping System', 'Layanan Proyek / Survei', '1', 'service', 'Layanan Servis', '+ Layanan Piping System'],
];
const BADGE = { gas: 'order-badge-gas', service: 'order-badge-service' };

export default function OrderBuilder() {
  const { t } = useI18n();
  const toast = useToast();
  const qc = useQuoteConfig();
  const { items, setItems } = useCart();
  const [product, setProduct] = useState('Oksigen Medis');
  const [variant, setVariant] = useState('');
  const [spec, setSpec] = useState('');
  const [qty, setQty] = useState('1');
  const [notes, setNotes] = useState('');
  const [vErr, setVErr] = useState(false);
  const [nErr, setNErr] = useState(false);
  const notesRef = useRef(null), varRef = useRef(null);

  const opt = qc.options.find((o) => o.value === product) || qc.options[0];
  const vcfg = opt ? qc.VARIANTS[opt.value] : null;
  const groups = opt ? specGroups(qc, opt.value, opt.category, vcfg ? variant : '') : [];
  const firstSpec = groups.length ? pair(groups[0].items[0])[0] : '';
  const allSpecs = groups.flatMap((g) => g.items.map((i) => pair(i)[0]));
  const curSpec = allSpecs.indexOf(spec) >= 0 ? spec : firstSpec;
  const required = isCustom(curSpec);

  // produk terpilih tidak ada lagi di opsi -> ikut opsi pertama (disesuaikan saat render)
  if (opt && opt.value !== product) setProduct(opt.value);
  useEffect(() => { builderReset.current = () => { setProduct('Oksigen Medis'); setVariant(''); setSpec(''); setQty('1'); setNotes(''); setVErr(false); setNErr(false); }; }, []);

  const add = (e) => {
    e.preventDefault();
    if (vcfg && !variant) { setVErr(true); varRef.current?.focus(); return; }
    if (required && !notes.trim()) { setNErr(true); notesRef.current?.focus(); return; }
    const name = compose(opt ? opt.value : '', vcfg ? variant : '');
    if (!name) { toast('Pilih Produk', 'Silakan pilih produk atau layanan yang ingin dipesan terlebih dahulu.', 'error'); return; }
    if (!qty.trim() || isNaN(parseInt(qty, 10)) || parseInt(qty, 10) <= 0) { toast('Jumlah Tidak Valid', 'Masukkan kuantitas pesanan yang valid.', 'error'); return; }
    setItems(items.concat([{ name, category: opt.category, categoryLabel: opt.catLabel, spec: curSpec || 'Standar', qty: qty.trim(), notes: notes.trim() }]));
    setQty('1'); setNotes('');
    toast('Item Ditambahkan', `${name} (${curSpec}) berhasil masuk ke daftar pesanan.`, 'success');
  };
  const preset = ([name, s, q, cat, label]) => {
    setItems(items.concat([{ name, category: cat, categoryLabel: label, spec: s, qty: q, notes: 'Preset Langsung' }]));
    toast('Preset Ditambahkan', `${name} ditambahkan ke tabel pesanan.`, 'success');
  };

  // kelompokkan pilihan produk per kategori (optgroup)
  const optGroups = [];
  qc.options.forEach((o) => { const g = optGroups.find((x) => x.label === (o.group || '')); if (g) g.items.push(o); else optGroups.push({ label: o.group || '', items: [o] }); });

  return (
    <>
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><T>Preset Cepat:</T></span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p[5]} type="button" onClick={() => preset(p)} className="btn-quick-preset text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-all font-medium"><T>{p[5]}</T></button>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-sm space-y-4">
        <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block"><T>Pilih Komoditas / Layanan yang Ingin Dimasukkan:</T></span>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="block font-semibold text-slate-700 text-[11px] uppercase mb-1"><T>Produk / Layanan *</T></label>
            <select id="order-item-select" className="form-input-luxury !py-2 text-xs" value={opt ? opt.value : ''}
              onChange={(e) => { setProduct(e.target.value); setVariant(''); setSpec(''); setVErr(false); setNErr(false); }}>
              {optGroups.map((g) => (
                <Fragment key={g.label}>
                  {g.label ? <optgroup label={t(g.label)}>{g.items.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}</optgroup>
                    : g.items.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                </Fragment>
              ))}
            </select>
            {vcfg && (
              <div className="mt-2" data-variant-wrap="">
                <label className="block font-semibold text-slate-700 text-[11px] uppercase mb-1">{t(vcfg.label)}</label>
                <select ref={varRef} id="order-variant-select" className="form-input-luxury !py-2 text-xs" value={variant}
                  onChange={(e) => { setVariant(e.target.value); setSpec(''); if (e.target.value) setVErr(false); }}>
                  <option value="">{t(vcfg.placeholder)}</option>
                  {vcfg.items.map((it) => { const x = pair(it); return <option key={x[0]} value={x[0]}>{t(x[1])}</option>; })}
                </select>
                {vErr && <p className="text-[11px] font-semibold text-red-600 mt-1" role="alert">{t(TEXT.variantError)}</p>}
              </div>
            )}
          </div>
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-700 text-[11px] uppercase mb-1"><T>Spesifikasi / Ukuran *</T></label>
            <select id="order-spec-select" className="form-input-luxury !py-2 text-xs" value={curSpec} onChange={(e) => { setSpec(e.target.value); if (!isCustom(e.target.value)) setNErr(false); }}>
              <SpecOptions groups={groups} />
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block font-semibold text-slate-700 text-[11px] uppercase mb-1"><T>Jumlah (Qty) *</T></label>
            <div className="flex items-center gap-2">
              <input type="number" id="order-qty-input" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="form-input-luxury !py-2 text-xs font-mono font-bold text-center" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-9">
            <label className="block font-semibold text-slate-700 text-[11px] uppercase mb-1">{t(required ? TEXT.notesRequired : TEXT.notesOptional)}</label>
            <input ref={notesRef} type="text" id="order-notes-input" value={notes} aria-required={required ? 'true' : 'false'}
              onChange={(e) => { setNotes(e.target.value); if (e.target.value.trim()) setNErr(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') add(e); }}
              placeholder={t(required ? TEXT.placeholderRequired : TEXT.placeholderOptional)} className={'form-input-luxury !py-2 text-xs' + (required ? ' !border-red-400' : '')} />
            {nErr && required && <p className="text-[11px] font-semibold text-red-600 mt-1" role="alert">{t(TEXT.error)}</p>}
          </div>
          <div className="md:col-span-3">
            <button type="button" id="btn-add-order-item" onClick={add} className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"><i className="fa-solid fa-plus" />{' '}<span><T>Tambah Item</T></span></button>
          </div>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-table-list text-sky-600" />{' '}<T>Tabel Rekapitulasi Pesanan Anda</T>
          </span>
          <span id="order-total-count" className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-mono font-bold rounded-full">{t(items.length + ' Item Terdaftar')}</span>
        </div>
        <div id="order-table-container" className="order-table-container bg-white rounded border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center"><T>No</T></th>
                <th className="py-3 px-3"><T>Produk / Layanan</T></th>
                <th className="py-3 px-3"><T>Ukuran / Spek</T></th>
                <th className="py-3 px-3 text-center w-20"><T>Kuantitas</T></th>
                <th className="py-3 px-3"><T>Catatan</T></th>
                <th className="py-3 px-3 text-center w-16"><T>Hapus</T></th>
              </tr>
            </thead>
            <tbody id="order-table-body">
              {items.map((it, i) => (
                <tr key={i} className="order-table-row border-b border-slate-100 text-xs">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400 text-center">{i + 1}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-navy-900 block">{t(it.name)}</span>
                    <span className={'text-[10px] uppercase font-mono px-2 py-0.5 rounded inline-block mt-0.5 ' + (BADGE[it.category] || 'order-badge-equipment')}>{t(it.categoryLabel)}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{t(it.spec)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-sky-700 text-center">{it.qty}</td>
                  <td className="py-3 px-3 text-slate-500 italic">{it.notes ? t(it.notes) : '-'}</td>
                  <td className="py-3 px-3 text-center">
                    <button type="button" onClick={() => setItems(items.filter((_, k) => k !== i))} className="btn-remove-order-item text-rose-500 hover:text-rose-700 p-1.5 rounded transition-colors" title={t('Hapus item ini')}>
                      <i className="fa-solid fa-trash-can text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <div id="order-table-empty" className="py-8 px-4 text-center text-slate-400 space-y-2">
              <i className="fa-solid fa-cart-flatbed text-3xl text-slate-300" />
              <p className="text-xs font-medium"><T>Belum ada item pesanan yang dimasukkan.</T></p>
              <p className="text-[11px] text-slate-400">
                <TH k={'Pilih komoditas di atas lalu klik tombol "Tambah Item" atau gunakan preset cepat.'}><T>Pilih komoditas di atas lalu klik tombol</T>{' '}<strong><T>"Tambah Item"</T></strong>{' '}<T>atau gunakan preset cepat.</T></TH>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
