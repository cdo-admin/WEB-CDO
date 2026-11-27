// Alat bersama panel admin: context toast, panggilan API isi website, unggah gambar, urutan item.
import { createContext, useCallback, useContext } from 'react';
import { adminApi } from '../lib/api.js';

export const ToastCtx = createContext(() => {});
export const useAdminToast = () => useContext(ToastCtx);
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

/** Ubah urutan satu langkah lalu simpan (sort_order = 10, 20, 30, ...). */
export async function moveItem(type, list, idx, d) {
  const k = idx + d; if (k < 0 || k >= list.length) return;
  const a = list.slice(); [a[idx], a[k]] = [a[k], a[idx]];
  await adminApi('/items/' + type + '/reorder', { method: 'POST', body: { ids: a.map((x) => x.id) } });
}
