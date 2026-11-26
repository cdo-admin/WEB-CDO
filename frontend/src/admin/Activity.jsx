// Galeri Kegiatan: foto kegiatan kantor (outing, 17 Agustusan, buka bersama, dll) untuk halaman Galeri.
import { useState } from 'react';
import { uploadMedia, Modal, PhotoStrip, RowActions, StatusChip, useAdminToast, useFail } from './common.jsx';
import { useItems } from './useItems.js';

function AcForm({ p, onClose, onSave }) {
  const toast = useAdminToast(), fail = useFail();
  const [v, setV] = useState(() => ({ title: '', event_date: '', description: '', image_url: '', is_active: true, ...(p || {}), en: { ...((p && p.en) || {}) }, photos: ((p && p.photos) || []).slice() }));
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const upCover = (e) => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; setBusy(true); toast('Mengunggah foto…'); uploadMedia(f, 1600).then((u) => { setV((x) => ({ ...x, image_url: u })); toast('Foto terunggah'); }).catch(fail).finally(() => setBusy(false)); };
  const upGal = async (e) => {
    const fs = [...e.target.files]; e.target.value = ''; if (!fs.length) return;
    setBusy(true); toast('Mengunggah ' + fs.length + ' foto…'); let n = 0;
    try { for (const f of fs) { const u = await uploadMedia(f, 1600); n++; setV((x) => ({ ...x, photos: x.photos.concat([u]) })); } toast(n + ' foto ditambahkan'); } catch (x) { fail(x); } finally { setBusy(false); }
  };
  const submit = () => {
    if (!v.title.trim()) return;
    const n = (s) => (s || '').trim() || null;
    onSave({ title: v.title.trim(), event_date: n(v.event_date), description: n(v.description), image_url: n(v.image_url), photos: v.photos.slice(), is_active: v.is_active,
      en: { title: (v.en.title || '').trim(), description: (v.en.description || '').trim() } });
  };
  return (
    <Modal title={p ? 'Edit kegiatan' : 'Tambah kegiatan'} onClose={onClose} onSubmit={submit}>
      <div><label className="lbl">Foto sampul (tampil di kisi galeri)</label>
        <div className="flex items-center gap-3">
          <div className="w-28 h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-300 text-2xl">{v.image_url ? <img src={v.image_url} className="w-full h-full object-cover" alt="" /> : <i className="fa-regular fa-image" />}</div>
          <div className="flex-1 min-w-0 space-y-2"><label className="btn btn-ghost cursor-pointer"><i className="fa-solid fa-upload" /> Pilih foto dari komputer<input type="file" accept="image/*" className="hidden" onChange={upCover} /></label><input className="inp text-xs" value={v.image_url || ''} onChange={set('image_url')} placeholder="atau tempel alamat gambar (https://...)" /></div>
        </div></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2"><label className="lbl">Judul kegiatan *</label><input className="inp" required value={v.title} onChange={set('title')} placeholder="Contoh: Lomba 17 Agustusan 2026" /></div>
        <div><label className="lbl">Tanggal kegiatan</label><input type="date" className="inp" value={v.event_date || ''} onChange={set('event_date')} /></div>
      </div>
      <div><label className="lbl">Deskripsi kegiatan</label><textarea className="inp" rows="5" value={v.description || ''} onChange={set('description')} placeholder="Ceritakan keseruan kegiatannya. Tekan Enter untuk paragraf baru." /></div>
      <div><label className="lbl">Foto tambahan <span className="text-slate-400 font-normal">{v.photos.length ? '(' + v.photos.length + ' foto)' : '(belum ada, boleh dikosongkan)'}</span></label>
        <PhotoStrip list={v.photos} setList={(g) => setV({ ...v, photos: g })} />
        <label className="btn btn-ghost cursor-pointer"><i className="fa-solid fa-images" /> Tambah foto (boleh pilih banyak)<input type="file" accept="image/*" multiple className="hidden" onChange={upGal} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"><input type="checkbox" checked={v.is_active} onChange={set('is_active')} /> Tayangkan di website</label>
      <details className="border border-slate-200 rounded-lg p-3">
        <summary className="text-xs font-bold text-slate-600 cursor-pointer">Terjemahan Inggris (opsional, tampil saat pengunjung memilih EN)</summary>
        <div className="space-y-3 mt-3">
          <div><label className="lbl">Judul (EN)</label><input className="inp" value={v.en.title || ''} onChange={(e) => setV({ ...v, en: { ...v.en, title: e.target.value } })} /></div>
          <div><label className="lbl">Deskripsi (EN)</label><textarea className="inp" rows="4" value={v.en.description || ''} onChange={(e) => setV({ ...v, en: { ...v.en, description: e.target.value } })} /></div>
        </div>
      </details>
      <div className="flex justify-end gap-2 pt-1"><button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button><button className="btn btn-primary" type="submit" disabled={busy}>Simpan</button></div>
    </Modal>
  );
}

export default function Activity() {
  const toast = useAdminToast(), fail = useFail();
  const { items, toggle, remove, move, save } = useItems('gallery');
  const [edit, setEdit] = useState(undefined);
  const onSave = (row) => {
    if (!edit) row.sort_order = (items || []).reduce((m, j) => Math.min(m, j.sort_order || 0), 10) - 10; // terbaru paling atas
    save(edit && edit.id, row).then(() => { setEdit(undefined); toast('Kegiatan tersimpan'); }).catch(fail);
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Galeri Kegiatan</h2><p className="text-xs text-slate-500">Foto kegiatan kantor (outing, lomba 17 Agustusan, buka bersama, dll). Halaman Galeri di website langsung mengikuti daftar ini. Kegiatan terbaru taruh paling atas.</p></div>
        <button type="button" className="btn btn-primary" disabled={!items} onClick={() => setEdit(null)}><i className="fa-solid fa-plus" /> Tambah kegiatan</button>
      </div>
      <div className="space-y-3">
        {!items ? <p className="text-sm text-slate-500">Memuat…</p> : !items.length ? <div className="card p-6 text-sm text-slate-500">Belum ada kegiatan. Klik <b>Tambah kegiatan</b> untuk mengisi galeri. Selama kosong, pengunjung melihat pesan "Oops, sepertinya belum ada kegiatan yang dipost di sini".</div> : items.map((p, i) => (
          <div key={p.id} className={'card p-3 ' + (p.is_active ? '' : 'opacity-60')}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">{p.image_url && <img src={p.image_url} className="w-full h-full object-cover" alt="" loading="lazy" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {p.event_date && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{p.event_date}</span>}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700">{(p.photos || []).length + (p.image_url ? 1 : 0)} FOTO</span>
                  <StatusChip on={p.is_active} />
                </div>
                <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{p.description || ''}</div>
              </div>
              <RowActions i={i} n={items.length} active={p.is_active} onMove={(d) => move(i, d)} onToggle={() => toggle(p, ['Kegiatan disembunyikan', 'Kegiatan ditayangkan'])}
                onEdit={() => setEdit(p)} onDelete={() => remove(p, 'Kegiatan dihapus')} />
            </div>
          </div>
        ))}
      </div>
      {edit !== undefined && <AcForm p={edit} onClose={() => setEdit(undefined)} onSave={onSave} />}
    </>
  );
}
