// Lowongan Karir: tambah, ubah, sembunyikan, urutkan, atau hapus lowongan di halaman Karir.
import { useEffect, useState } from 'react';
import { Modal, RowActions, StatusChip } from './common.jsx';
import { getConfig, setConfig, useAdminToast, useFail } from './adminLib.js';
import { useItems } from './useItems.js';
import { JOB_COLORS } from './jobColors.js';

const SEED_JOBS = [
  { title: 'Teknisi Stasiun Pengisian (Filling Station Operator)', category: 'PABRIK & OPERASIONAL', color: 'sky', location: 'Safe N Lock Sidoarjo',
    description: 'Mengoperasikan sistem manifold pengisian gas silinder Oksigen, Nitrogen, Argon, dan CO2, melakukan pengecekan visual kondisi tabung, serta memastikan prosedur keselamatan K3 bejana bertekanan terpenuhi.',
    detail1: 'Status: Full-Time', detail2: 'Pendidikan: SMK/D3 Teknik Mesin/Elektro', apply_role: 'Teknisi Filling Station Operator' },
  { title: 'Pengemudi Armada Pengiriman (Delivery Service Driver B1/B2)', category: 'LOGISTIK & DISTRIBUSI', color: 'emerald', location: 'Wilayah Jawa Timur (Base: Sidoarjo)',
    description: 'Menghantarkan tabung gas industri dan tabung medis secara terjadwal dan aman ke klien rumah sakit, industri pabrik, bengkel, serta pengiriman langsung ke rumah (homecare) wilayah Jawa Timur.',
    detail1: 'Status: Full-Time', detail2: 'Syarat: SIM B1 / B2 Umum Aktif', apply_role: 'Delivery Service Driver Jawa Timur' },
  { title: 'Teknisi Gas Piping System & Nitrogen Purging', category: 'REKAYASA PIPA', color: 'purple', location: 'Project Base Jawa Timur',
    description: 'Melakukan penyambungan brazing pipa tembaga medis RS, instalasi manifold gas sentral industri, serta prosedur pembersihan pipa (purging) dengan gas Nitrogen bertekanan tinggi.',
    detail1: 'Status: Full-Time / Kontrak Proyek', detail2: 'Pengalaman: Min. 1 Tahun di Pemipaan', apply_role: 'Teknisi Gas Piping System & Purging' },
];
const EN_KEYS = [['title', 'Judul (EN)'], ['category', 'Label kategori (EN)'], ['location', 'Lokasi (EN)'], ['description', 'Deskripsi (EN)'], ['detail1', 'Info 1 (EN)'], ['detail2', 'Info 2 (EN)']];

function JobForm({ job, onClose, onSave }) {
  const [v, setV] = useState(() => ({ title: '', category: '', color: 'sky', location: '', description: '', detail1: '', detail2: '', apply_role: '', is_active: true, ...(job || {}), en: { ...((job && job.en) || {}) } }));
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const setEn = (k) => (e) => setV({ ...v, en: { ...v.en, [k]: e.target.value } });
  const submit = () => {
    if (!v.title.trim()) return;
    const n = (s) => (s || '').trim() || null;
    onSave({ title: v.title.trim(), category: n(v.category), color: v.color, location: n(v.location), description: n(v.description), detail1: n(v.detail1), detail2: n(v.detail2),
      apply_role: n(v.apply_role), is_active: v.is_active, en: Object.fromEntries(EN_KEYS.map(([k]) => [k, (v.en[k] || '').trim()])) });
  };
  return (
    <Modal title={job ? 'Edit lowongan' : 'Tambah lowongan'} onClose={onClose} onSubmit={submit}>
      <div><label className="lbl">Judul posisi *</label><input className="inp" required value={v.title} onChange={set('title')} placeholder="Contoh: Teknisi Stasiun Pengisian (Filling Station Operator)" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="lbl">Label kategori</label><input className="inp" value={v.category || ''} onChange={set('category')} placeholder="Contoh: PABRIK & OPERASIONAL" /></div>
        <div><label className="lbl">Warna label</label><select className="inp" value={v.color} onChange={set('color')}>{Object.entries(JOB_COLORS).map(([k, c]) => <option key={k} value={k}>{c[2]}</option>)}</select></div>
      </div>
      <div><label className="lbl">Lokasi penempatan</label><input className="inp" value={v.location || ''} onChange={set('location')} placeholder="Contoh: Safe N Lock Sidoarjo" /></div>
      <div><label className="lbl">Deskripsi pekerjaan</label><textarea className="inp" rows="4" value={v.description || ''} onChange={set('description')} placeholder="Tugas dan tanggung jawab singkat" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="lbl">Info 1</label><input className="inp" value={v.detail1 || ''} onChange={set('detail1')} placeholder="Contoh: Status: Full-Time" /></div>
        <div><label className="lbl">Info 2</label><input className="inp" value={v.detail2 || ''} onChange={set('detail2')} placeholder="Contoh: Pendidikan: SMK/D3 Teknik Mesin" /></div>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"><input type="checkbox" checked={v.is_active} onChange={set('is_active')} /> Tayangkan di website</label>
      <details className="border border-slate-200 rounded-lg p-3">
        <summary className="text-xs font-bold text-slate-600 cursor-pointer">Terjemahan Inggris (opsional, tampil saat pengunjung memilih EN)</summary>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {EN_KEYS.map(([k, l]) => <div key={k} className={k === 'title' || k === 'description' ? 'sm:col-span-2' : ''}><label className="lbl">{l}</label>
            {k === 'description' ? <textarea className="inp" rows="3" value={v.en[k] || ''} onChange={setEn(k)} /> : <input className="inp" value={v.en[k] || ''} onChange={setEn(k)} />}</div>)}
        </div>
      </details>
      <details className="border border-slate-200 rounded-lg p-3">
        <summary className="text-xs font-bold text-slate-600 cursor-pointer">Pengaturan lanjutan</summary>
        <div className="mt-3"><label className="lbl">Nama posisi yang tercatat di lamaran</label><input className="inp" value={v.apply_role || ''} onChange={set('apply_role')} placeholder="Kosongkan = sama dengan judul" /></div>
      </details>
      <div className="flex justify-end gap-2 pt-1"><button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button><button className="btn btn-primary" type="submit">Simpan</button></div>
    </Modal>
  );
}

export default function Jobs() {
  const toast = useAdminToast(), fail = useFail();
  const [managed, setManaged] = useState(null);
  useEffect(() => { getConfig('careers').then((c) => setManaged(!!(c && c.managed))).catch(fail); }, [fail]);
  const markManaged = () => (managed ? null : setConfig('careers', { managed: true }).then(() => setManaged(true)));
  const { items, toggle, remove, move, save, importMany } = useItems('jobs', { onChange: markManaged });
  const [edit, setEdit] = useState(undefined); // undefined = tertutup, null = baru
  const act = (items || []).filter((j) => j.is_active).length;

  const onSave = (row) => {
    if (!edit) row.sort_order = (items || []).reduce((m, j) => Math.max(m, j.sort_order || 0), 0) + 10;
    save(edit && edit.id, row).then(() => { setEdit(undefined); toast('Lowongan tersimpan'); }).catch(fail);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Lowongan Karir</h2><p className="text-xs text-slate-500">Tambah, ubah, sembunyikan, atau hapus lowongan. Halaman Karir di website langsung mengikuti daftar ini.</p></div>
        <button type="button" className="btn btn-primary" disabled={!items} onClick={() => setEdit(null)}><i className="fa-solid fa-plus" /> Tambah lowongan</button>
      </div>
      <div className="mb-4">
        {managed === false && items && (
          <div className="card p-4 border-amber-300 bg-amber-50 text-sm text-amber-900"><b>Halaman Karir masih memakai 3 lowongan bawaan dari kode website</b> (belum diatur dari admin).
            <div className="flex flex-wrap gap-2 mt-3">
              {items.length ? <button type="button" className="btn btn-primary" onClick={() => markManaged().then(() => toast('Halaman Karir sekarang diatur dari admin')).catch(fail)}>Mulai atur dari admin</button> : (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => importMany(SEED_JOBS.map((j, i) => ({ sort_order: (i + 1) * 10, is_active: true, ...j })), '3 lowongan diimpor').catch(fail)}>Impor 3 lowongan bawaan (lalu bisa diedit)</button>
                  <button type="button" className="btn btn-ghost" onClick={() => markManaged().then(() => toast('Halaman Karir sekarang diatur dari admin')).catch(fail)}>Mulai dari kosong</button>
                </>
              )}
            </div>
          </div>
        )}
        {managed && (
          <div className="card p-3 border-emerald-300 bg-emerald-50 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
            <span><i className="fa-solid fa-circle-check" /> Halaman Karir mengikuti daftar di bawah. <b>{act}</b> lowongan tayang{act ? '.' : ' — pengunjung melihat pesan "belum ada lowongan" dan tombol Talent Pool.'}</span>
            <button type="button" className="underline font-semibold" onClick={() => { if (window.confirm('Kembali memakai 3 lowongan bawaan di kode website? Daftar di admin tidak dihapus, hanya tidak dipakai.')) setConfig('careers', { managed: false }).then(() => { setManaged(false); toast('Kembali ke tampilan bawaan'); }).catch(fail); }}>Kembali ke tampilan bawaan</button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {!items ? <p className="text-sm text-slate-500">Memuat…</p> : !items.length ? <div className="card p-6 text-sm text-slate-500">Belum ada lowongan di daftar.</div> : items.map((j, i) => {
          const c = JOB_COLORS[j.color] || JOB_COLORS.sky;
          return (
            <div key={j.id} className={'card p-4 ' + (j.is_active ? '' : 'opacity-60')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {j.category && <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: c[0], color: c[1] }}>{j.category}</span>}
                    <StatusChip on={j.is_active} />
                    {j.location && <span className="text-[11px] text-slate-500"><i className="fa-solid fa-location-dot" /> {j.location}</span>}
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{j.title}</div>
                  {j.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{j.description}</p>}
                  <div className="text-[11px] text-slate-500 mt-1">{[j.detail1, j.detail2].filter(Boolean).join(' • ')}</div>
                </div>
                <RowActions i={i} n={items.length} active={j.is_active} onMove={(d) => move(i, d)} onToggle={() => toggle(j, ['Lowongan disembunyikan', 'Lowongan ditayangkan'])}
                  onEdit={() => setEdit(j)} onDelete={() => remove(j, 'Lowongan dihapus')} />
              </div>
            </div>
          );
        })}
      </div>
      {edit !== undefined && <JobForm job={edit} onClose={() => setEdit(undefined)} onSave={onSave} />}
    </>
  );
}
