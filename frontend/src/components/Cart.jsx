/* Keranjang pesanan ala toko online (pengganti assets/js/cart.js).
   1. Halaman Produk: "Pesan" -> jendela spesifikasi/kustomisasi -> "Masukkan Keranjang".
   2. Isi keranjang tersimpan di browser (tetap ada walau pindah halaman).
   3. Keranjang -> "Pesan" -> halaman /quote yang sudah berisi pesanan. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useCms, usePageFile } from '../cms/CmsProvider.jsx';
import { useToast } from './Toast.jsx';
import { useQuoteConfig, pair, isCustom, compose, specGroups } from '../data/useQuoteConfig.js';
import { PRODUCT_SPECS, SPEC_LABELS } from '../data/productSpecs.js';
import { assetUrl } from '../lib/pages.js';
import { WA_FALLBACK, MAIL_FALLBACK } from '../lib/order.js';

const KEY = 'candiCart1';
const load = () => { try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);
export const specFor = (idTitle) => PRODUCT_SPECS[idTitle];

/** Nomor WhatsApp & email tujuan pesanan, ikut perubahan link dari admin. */
export function useContactTargets() {
  const { pick } = useCms();
  const wa = pick('href', '', 'https://wa.me/' + WA_FALLBACK);
  const m = wa && /wa\.me\/(\d+)/.exec(wa.id || '');
  const mail = pick('href', '', 'mailto:' + MAIL_FALLBACK);
  const mm = mail && /^mailto:([^?]+)/.exec(mail.id || '');
  return { waNumber: m ? m[1] : WA_FALLBACK, email: mm ? mm[1] : MAIL_FALLBACK };
}

export function CartProvider({ children }) {
  const [items, setItemsState] = useState(load);
  const [drawer, setDrawer] = useState(false);
  const [order, setOrder] = useState(null); // produk di jendela "Pesan"
  const [info, setInfo] = useState(null);   // produk di jendela "Spesifikasi"
  const [bump, setBump] = useState(0);

  const setItems = useCallback((arr) => {
    const next = (arr || []).map((x) => ({ ...x }));
    setItemsState(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const on = (e) => { if (e.key === KEY) setItemsState(load()); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);

  const anyOpen = drawer || order || info;
  useEffect(() => {
    document.documentElement.style.overflow = anyOpen ? 'hidden' : '';
    if (!anyOpen) return undefined;
    const esc = (e) => { if (e.key === 'Escape') { setDrawer(false); setOrder(null); setInfo(null); } };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [anyOpen]);

  const value = useMemo(() => ({
    items, setItems, clear: () => setItems([]),
    openDrawer: () => setDrawer(true), closeDrawer: () => setDrawer(false),
    openOrder: (p) => { setInfo(null); setOrder(p); }, openInfo: (p) => setInfo(p),
  }), [items, setItems]);

  return (
    <CartCtx.Provider value={value}>
      {children}
      <CartUi drawer={drawer} setDrawer={setDrawer} bump={bump} />
      {order && <OrderModal p={order} onClose={() => setOrder(null)} onAdded={() => { setOrder(null); setBump((b) => b + 1); setTimeout(() => setDrawer(true), 350); }} />}
      {info && <InfoModal p={info} onClose={() => setInfo(null)} onOrder={() => { const p = info; setInfo(null); setOrder(p); }} />}
    </CartCtx.Provider>
  );
}

function CartUi({ drawer, setDrawer, bump }) {
  const { t } = useI18n();
  const { items, setItems } = useCart();
  const nav = useNavigate();
  const page = usePageFile();
  const fab = useRef(null);
  const n = items.length;

  useEffect(() => {
    if (!bump || !fab.current) return;
    fab.current.classList.remove('bump'); void fab.current.offsetWidth; fab.current.classList.add('bump');
  }, [bump]);

  const hidden = page === 'quote.html' || (n === 0 && page !== 'products.html');
  const setQty = (i, q) => { const a = items.map((x) => ({ ...x })); a[i].qty = String(Math.max(1, parseInt(q, 10) || 1)); setItems(a); };

  return (
    <>
      <button ref={fab} id="cart-fab" type="button" aria-label={t('Keranjang')} style={{ display: hidden ? 'none' : 'flex' }} onClick={() => setDrawer(true)}>
        <i className="fa-solid fa-cart-shopping" /><span className="cb" style={{ display: n ? 'flex' : 'none' }}>{n}</span>
      </button>
      <div className={'cart-ov' + (drawer ? ' on' : '')} onClick={() => setDrawer(false)} />
      <aside id="cart-drawer" className={drawer ? 'on' : ''} aria-label={t('Keranjang pesanan')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, color: '#0A192F', fontSize: '1.05rem' }}>{t('Keranjang Pesanan')}</div>
            <div style={{ fontSize: '.7rem', color: '#64748b' }}>{n} {t('item')}</div>
          </div>
          <button type="button" aria-label={t('Tutup')} onClick={() => setDrawer(false)} style={{ border: 0, background: 'none', fontSize: '1.6rem', lineHeight: 1, color: '#64748b', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!n ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <i className="fa-solid fa-cart-shopping" style={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
              <p style={{ fontSize: '.85rem', fontWeight: 600, marginTop: '1rem', color: '#64748b' }}>{t('Keranjang masih kosong')}</p>
              <p style={{ fontSize: '.75rem', marginTop: '.4rem' }}>{t('Klik Pesan pada produk atau layanan, atur spesifikasinya, lalu masukkan ke keranjang.')}</p>
            </div>
          ) : (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {items.map((it, i) => (
                <div className="cart-item" key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#0A192F', fontSize: '.85rem' }}>{it.name}</div>
                      <div style={{ fontSize: '.7rem', color: '#64748b', marginTop: '.15rem' }}>{t(it.categoryLabel)} • {t(it.spec)}</div>
                      {it.notes && <div style={{ fontSize: '.7rem', color: '#64748b', fontStyle: 'italic', marginTop: '.2rem' }}>“{it.notes}”</div>}
                    </div>
                    <button type="button" aria-label={t('Hapus')} onClick={() => setItems(items.filter((_, k) => k !== i))} style={{ color: '#e11d48', border: 0, background: 'none', cursor: 'pointer', fontSize: '.9rem', alignSelf: 'flex-start' }}><i className="fa-solid fa-trash-can" /></button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.6rem' }}>
                    <span className="lb" style={{ margin: 0 }}>{t('Jumlah')}</span>
                    <span className="cart-qty">
                      <button type="button" aria-label={t('Kurangi')} onClick={() => setQty(i, (parseInt(it.qty, 10) || 1) - 1)}>−</button>
                      <input type="number" min="1" key={it.qty} defaultValue={it.qty} onBlur={(e) => setQty(i, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setQty(i, e.currentTarget.value); }} />
                      <button type="button" aria-label={t('Tambah')} onClick={() => setQty(i, (parseInt(it.qty, 10) || 1) + 1)}>+</button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {n > 0 && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '.6rem', background: '#fff' }}>
            <button type="button" className="cart-btn" onClick={() => { setDrawer(false); nav('/quote'); }}>{t('Pesan')} ({n} {t('item')}) <i className="fa-solid fa-arrow-right" /></button>
            <button type="button" className="cart-btn ghost" onClick={() => { setDrawer(false); if (page !== 'products.html') nav('/products'); }}>{t('Tambah produk lain')}</button>
            <button type="button" onClick={() => { if (window.confirm(t('Kosongkan semua item di keranjang?'))) setItems([]); }} style={{ border: 0, background: 'none', fontSize: '.7rem', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer' }}>{t('Kosongkan keranjang')}</button>
          </div>
        )}
      </aside>
    </>
  );
}

function ModalShell({ p, onClose, children }) {
  const { t } = useI18n();
  return (
    <div id="spec-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sm-box">
        <div style={{ position: 'relative' }}>
          {p.img && <div style={{ height: '9rem', background: '#0F172A', overflow: 'hidden' }}><img src={assetUrl(p.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} /></div>}
          <button type="button" aria-label={t('Tutup')} onClick={onClose} style={{ position: 'absolute', top: '.5rem', right: '.6rem', width: '2.1rem', height: '2.1rem', borderRadius: 9999, border: 0, background: 'rgba(255,255,255,.95)', fontSize: '1.3rem', lineHeight: 1, cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </div>
    </div>
  );
}

function OrderModal({ p, onClose, onAdded }) {
  const { t } = useI18n();
  const toast = useToast();
  const qc = useQuoteConfig();
  const { items, setItems } = useCart();
  const v = qc.VARIANTS[p.name];
  const [variant, setVariant] = useState('');
  const groups = specGroups(qc, p.name, p.category, variant);
  const first = pair(groups[0].items[0])[0];
  const [spec, setSpec] = useState(first);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');
  const custom = isCustom(spec);

  const changeVariant = (val) => {
    setVariant(val); setErr('');
    const g = specGroups(qc, p.name, p.category, val);
    setSpec(pair(g[0].items[0])[0]);
  };
  const submit = () => {
    const q = parseInt(qty, 10);
    if (v && !variant) return setErr('Pilih jenis terlebih dahulu sebelum menambahkan item.');
    if (custom && !notes.trim()) return setErr('Catatan wajib diisi untuk spesifikasi Kustom. Jelaskan ukuran atau kebutuhan Anda.');
    if (!q || q < 1) return setErr('Masukkan kuantitas pesanan yang valid.');
    const name = compose(p.name, variant), n = notes.trim();
    const arr = items.map((x) => ({ ...x }));
    const same = arr.find((x) => x.name === name && x.spec === spec && (x.notes || '') === n);
    if (same) same.qty = String((parseInt(same.qty, 10) || 0) + q);
    else arr.push({ name, category: p.category, categoryLabel: p.categoryLabel, spec, qty: String(q), notes: n });
    setItems(arr);
    toast(t('Masuk Keranjang'), name + ' (' + spec + ') × ' + q, 'success');
    onAdded();
  };

  return (
    <ModalShell p={p} onClose={onClose}>
      <div style={{ fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#0284c7', fontWeight: 700 }}>{t(p.categoryLabel)}</div>
      <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0A192F', margin: '.2rem 0 1rem' }}>{p.title || p.name}</h3>
      {v && (
        <div style={{ marginTop: '.9rem' }}>
          <label>{t(v.label)}</label>
          <select value={variant} onChange={(e) => changeVariant(e.target.value)}>
            <option value="">{t(v.placeholder)}</option>
            {v.items.map((it) => { const x = pair(it); return <option key={x[0]} value={x[0]}>{t(x[1])}</option>; })}
          </select>
        </div>
      )}
      <div style={{ marginTop: '.9rem' }}>
        <label>{t(p.category === 'service' ? 'Jenis Layanan' : 'Spesifikasi / Ukuran')}</label>
        <select value={spec} onChange={(e) => { setSpec(e.target.value); setErr(''); }}>
          <SpecOptions groups={groups} />
        </select>
      </div>
      <div style={{ marginTop: '.9rem' }}>
        <label>{t('Jumlah')}</label>
        <span className="cart-qty">
          <button type="button" aria-label={t('Kurangi')} onClick={() => setQty((q) => Math.max(1, (parseInt(q, 10) || 1) - 1))}>−</button>
          <input type="number" min="1" value={qty} onChange={(e) => { setQty(e.target.value); setErr(''); }} />
          <button type="button" aria-label={t('Tambah')} onClick={() => setQty((q) => (parseInt(q, 10) || 1) + 1)}>+</button>
        </span>
      </div>
      <div style={{ marginTop: '.9rem' }}>
        <label>{t(custom ? 'Catatan spesifik (WAJIB untuk spesifikasi Kustom) *' : 'Catatan (opsional)')}</label>
        <textarea rows="2" value={notes} onChange={(e) => { setNotes(e.target.value); setErr(''); }}
          placeholder={t(custom ? 'Wajib diisi: jelaskan ukuran / spesifikasi kustom yang Anda butuhkan...' : 'Contoh: sewa tabung atau tabung milik sendiri...')} />
      </div>
      {err && <p style={{ color: '#dc2626', fontSize: '.72rem', fontWeight: 600, marginTop: '.5rem' }}>{t(err)}</p>}
      <button type="button" className="cart-btn" style={{ marginTop: '1.1rem' }} onClick={submit}><i className="fa-solid fa-cart-plus" /> {t('Masukkan Keranjang')}</button>
    </ModalShell>
  );
}

export function SpecOptions({ groups }) {
  const { t } = useI18n();
  return groups.map((g, gi) => {
    const opts = g.items.map((it) => { const x = pair(it); return <option key={x[0]} value={x[0]}>{t(x[1])}</option>; });
    return g.label ? <optgroup key={gi} label={t(g.label)}>{opts}</optgroup> : opts;
  });
}

function InfoModal({ p, onClose, onOrder }) {
  const { t, lang } = useI18n();
  const en = lang === 'en';
  const d = specFor(p.idTitle) || { rows: [] };
  const rows = (d.rows || []).map((r) => [SPEC_LABELS[r[0]] ? SPEC_LABELS[r[0]][en ? 1 : 0] : r[0], en ? r[2] : r[1]]);
  return (
    <ModalShell p={p} onClose={onClose}>
      <div style={{ fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#0284c7', fontWeight: 700 }}>{t('Spesifikasi')} • {t(p.categoryLabel)}</div>
      <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0A192F', margin: '.2rem 0 .8rem' }}>{p.title || p.name}</h3>
      <div style={{ borderTop: '1px solid #e2e8f0' }}>
        {rows.length ? rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '.75rem', padding: '.6rem 0', borderBottom: '1px solid #e2e8f0', fontSize: '.8rem' }}>
            <div style={{ flex: '0 0 36%', color: '#64748b', fontWeight: 600 }}>{r[0]}</div>
            <div style={{ flex: 1, color: '#0A192F', fontWeight: 600 }}>{r[1]}</div>
          </div>
        )) : <p style={{ padding: '.8rem 0', fontSize: '.8rem', color: '#64748b' }}>{t('Spesifikasi lengkap tersedia sesuai permintaan.')}</p>}
      </div>
      {d.uses && (
        <div style={{ marginTop: '1rem' }}>
          <label>{t('Aplikasi')}</label>
          <ul style={{ margin: '.2rem 0 0 1.1rem', padding: 0, listStyle: 'disc', fontSize: '.8rem', color: '#334155', lineHeight: 1.6 }}>
            {(d.uses[en ? 'en' : 'id'] || d.uses.id).map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </div>
      )}
      {d.note && <p style={{ marginTop: '.9rem', fontSize: '.72rem', color: '#64748b', fontStyle: 'italic' }}>{d.note[en ? 'en' : 'id']}</p>}
      <button type="button" className="cart-btn" style={{ marginTop: '1.2rem' }} onClick={onOrder}><i className="fa-solid fa-cart-plus" /> {t('Pesan Produk Ini')}</button>
      <button type="button" className="cart-btn ghost" style={{ marginTop: '.6rem' }} onClick={onClose}>{t('Tutup')}</button>
    </ModalShell>
  );
}
