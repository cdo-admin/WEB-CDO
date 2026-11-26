// Alat bersama panel admin: toast, panggilan API isi website, unggah gambar.
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { adminApi } from '../lib/api.js';

const ToastCtx = createContext(() => {});
export const useAdminToast = () => useContext(ToastCtx);
export function AdminToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const tm = useRef(0);
  const toast = useCallback((m, err) => {
    clearTimeout(tm.current);
    setMsg({ m, err });
    tm.current = setTimeout(() => setMsg(null), err ? 5000 : 2200);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {msg && <div className={'toast' + (msg.err ? ' err' : '')}>{msg.m}</div>}
    </ToastCtx.Provider>
  );
}
/** toast error standar: "Gagal: ..." */
export function useFail() {
  const toast = useAdminToast();
  return useCallback((e) => { console.error(e); toast('Gagal: ' + (e && e.message ? e.message : e), true); }, [toast]);
}

/* ---------------------------- Isi website (CMS) ---------------------------- */
export const upsert = (rows) => adminApi('/site-content', { method: 'PUT', body: { rows } });
export const removeContent = (match) => adminApi('/site-content', { method: 'DELETE', body: match });
export const listContent = (query) => adminApi('/site-content', { query });
export async function getConfig(key) {
  const r = await listContent({ kind: 'config', key, scope: '' });
  try { return r && r[0] ? JSON.parse(r[0].value_id) : null; } catch { return null; }
}
export const setConfig = (key, obj) => upsert([{ kind: 'config', key, scope: '', value_id: JSON.stringify(obj) }]);

/* ------------------------------ Unggah gambar ------------------------------ */
function viaImg(file) {
  return new Promise((res, rej) => { const u = URL.createObjectURL(file), i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('File bukan gambar yang valid')); i.src = u; });
}
async function resizeImage(file, maxEdge, png) {
  const bm = window.createImageBitmap ? await createImageBitmap(file).catch(() => viaImg(file)) : await viaImg(file);
  const w = bm.width || bm.naturalWidth, h = bm.height || bm.naturalHeight, k = Math.min(1, maxEdge / Math.max(w, h));
  const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
  const cx = cv.getContext('2d'); if (!png) { cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); }
  cx.drawImage(bm, 0, 0, cv.width, cv.height);
  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('Gagal memproses gambar'))), png ? 'image/png' : 'image/jpeg', 0.82));
}
/** Kecilkan foto di browser lalu unggah ke Laravel (POST /api/admin/media). Mengembalikan URL publik. */
export async function uploadMedia(file, maxEdge = 1920, png = false) {
  if (!/^image\//.test(file.type)) throw new Error('File harus berupa gambar (JPG / PNG / WebP)');
  if (file.size > 30 * 1024 * 1024) throw new Error('Ukuran file terlalu besar (maksimal 30 MB)');
  const raw = /svg|gif/.test(file.type);
  const blob = raw ? file : await resizeImage(file, maxEdge, png);
  const ext = raw ? (file.type.indexOf('svg') > 0 ? 'svg' : 'gif') : png ? 'png' : 'jpg';
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'gambar';
  const fd = new FormData();
  fd.append('file', blob, base + '.' + ext);
  const r = await adminApi('/media', { method: 'POST', body: fd });
  return r.url;
}

/** Galeri foto kecil dengan tombol geser kiri/kanan & hapus (dipakai di Portofolio & Galeri Kegiatan). */
export function PhotoStrip({ list, setList }) {
  const move = (i, d) => { const k = i + d; if (k < 0 || k >= list.length) return; const a = list.slice(); [a[i], a[k]] = [a[k], a[i]]; setList(a); };
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
      {list.map((u, i) => (
        <div key={u + i} className="relative h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          <img src={u} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 text-white text-xs">
            <button type="button" className="px-2 py-0.5" title="Geser ke kiri" onClick={() => move(i, -1)}>‹</button>
            <button type="button" className="px-2 py-0.5" title="Hapus foto" onClick={() => setList(list.filter((_, k) => k !== i))}>✕</button>
            <button type="button" className="px-2 py-0.5" title="Geser ke kanan" onClick={() => move(i, 1)}>›</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Kotak modal admin. */
export function Modal({ title, onClose, children, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-start sm:items-center justify-center p-3 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="card w-full max-w-2xl p-5 sm:p-6 space-y-4 my-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">{title}</h3><button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl" aria-label="Tutup">&times;</button></div>
        {children}
      </form>
    </div>
  );
}

/** Daftar baris yang bisa diurutkan: tombol naik/turun, tayang/sembunyi, edit, hapus. */
export function RowActions({ i, n, active, onMove, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" className="btn btn-ghost !px-2 !py-1" disabled={i === 0} title="Naik" onClick={() => onMove(-1)}><i className="fa-solid fa-arrow-up" /></button>
      <button type="button" className="btn btn-ghost !px-2 !py-1" disabled={i === n - 1} title="Turun" onClick={() => onMove(1)}><i className="fa-solid fa-arrow-down" /></button>
      <button type="button" className="btn btn-ghost !py-1" onClick={onToggle}>{active ? 'Sembunyikan' : 'Tayangkan'}</button>
      <button type="button" className="btn btn-ghost !py-1" onClick={onEdit}><i className="fa-solid fa-pen" /> Edit</button>
      <button type="button" className="btn btn-danger !py-1" title="Hapus" onClick={onDelete}><i className="fa-solid fa-trash" /></button>
    </div>
  );
}

export const StatusChip = ({ on }) => (
  <span className={'text-[10px] font-bold px-2 py-0.5 rounded ' + (on ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600')}>{on ? 'TAYANG' : 'DISEMBUNYIKAN'}</span>
);

/** Ubah urutan satu langkah lalu simpan (sort_order = 10, 20, 30, ...). */
export async function moveItem(type, list, idx, d) {
  const k = idx + d; if (k < 0 || k >= list.length) return;
  const a = list.slice(); [a[idx], a[k]] = [a[k], a[idx]];
  await adminApi('/items/' + type + '/reorder', { method: 'POST', body: { ids: a.map((x) => x.id) } });
}
