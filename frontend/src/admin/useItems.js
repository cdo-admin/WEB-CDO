// Hook bersama untuk daftar Lowongan / Portofolio / Galeri Kegiatan (tabel di Laravel: /api/admin/items/{type}).
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { moveItem, useAdminToast, useFail } from './adminLib.js';

export function useItems(type, { onChange } = {}) {
  const toast = useAdminToast(), fail = useFail();
  const [items, setItems] = useState(null);
  const load = useCallback(() => adminApi('/items/' + type).then(setItems).catch(fail), [type, fail]);
  useEffect(() => { load(); }, [load]);

  const after = (msg) => Promise.resolve(onChange && onChange()).then(() => { if (msg) toast(msg); return load(); });
  return {
    items, load,
    toggle: (it, msgs) => adminApi(`/items/${type}/${it.id}`, { method: 'PATCH', body: { is_active: !it.is_active } }).then(() => after(it.is_active ? msgs[0] : msgs[1])).catch(fail),
    remove: (it, msg) => { if (!window.confirm('Hapus "' + it.title + '" permanen?')) return; adminApi(`/items/${type}/${it.id}`, { method: 'DELETE' }).then(() => after(msg)).catch(fail); },
    move: (idx, d) => moveItem(type, items, idx, d).then(() => after()).catch(fail),
    save: (id, row) => (id ? adminApi(`/items/${type}/${id}`, { method: 'PATCH', body: row }) : adminApi('/items/' + type, { method: 'POST', body: row })).then(() => after()),
    importMany: (rows, msg) => adminApi('/items/' + type, { method: 'POST', body: { items: rows } }).then(() => after(msg)),
  };
}
