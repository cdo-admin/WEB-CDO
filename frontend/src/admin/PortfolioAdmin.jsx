// Portofolio: proyek di halaman Portofolio + tombol filter tambahan.
import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { getConfig, setConfig, uploadMedia, Modal, PhotoStrip, RowActions, StatusChip, useAdminToast, useFail } from './common.jsx';
import { useItems } from './useItems.js';

const PF_BADGE = { navy: ['#0A192F', 'Biru tua'], sky: ['#0284c7', 'Biru muda'], emerald: ['#047857', 'Hijau'], amber: ['#b45309', 'Oranye'], rose: ['#be123c', 'Merah'], slate: ['#334155', 'Abu-abu'] };
const PF_TXT = { emerald: ['#059669', 'Hijau'], sky: ['#0284c7', 'Biru'], amber: ['#d97706', 'Oranye'], rose: ['#e11d48', 'Merah'], slate: ['#475569', 'Abu-abu'], navy: ['#0A192F', 'Biru tua'] };
const PF_CAT = { medis: 'Medis & Rumah Sakit', kriogenik: 'Filling Station & Dewars', industri: 'Industri & Fabrikasi Baja', lainnya: 'Lainnya' };
const PF_EN = [['title', 'Judul (EN)'], ['badge', 'Label foto (EN)'], ['location', 'Lokasi (EN)'], ['status', 'Status (EN)'], ['description', 'Deskripsi (EN)'], ['detail', 'Penjelasan lengkap (EN)'], ['foot_left', 'Info bawah kiri (EN)'], ['foot_right', 'Info bawah kanan (EN)']];
const SEED_PF = [{ category: 'medis', image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80', image_alt: 'Instalasi Gas Medis RS Surabaya - Sidoarjo', badge: 'INSTALASI MEDIS', badge_color: 'navy', location: 'Surabaya & Sidoarjo', status: 'Aktif Beroperasi', status_color: 'emerald', title: 'Pemasangan Gas Piping System & Suplai Oksigen Medis', description: 'Instalasi pipa tembaga seamless degreased, manifold changeover otomatis, serta pengiriman rutin tabung 6 m³ untuk fasilitas rawat inap, ICU, dan instalasi gawat darurat.', foot_left: 'Layanan: Piping & Delivery', foot_right: '100% On-Time', foot_color: 'emerald' }, { category: 'kriogenik', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', image_alt: 'Modernisasi Stasiun Pengisian Filling Station Safe N Lock Sidoarjo', badge: 'SAFE N LOCK SIDOARJO', badge_color: 'sky', location: 'Kawasan Safe N Lock Blok K', status: 'Stasiun Pengisian Utama', status_color: 'sky', title: 'Filling Station Modern Berstandar K3', description: 'Fasilitas stasiun pengisian otomatis modern milik PT. Candi Oxygen di Sidoarjo yang melayani pengisian O2, N2, Argon, CO2, serta perawatan tabung berstandar K3.', foot_left: 'Fasilitas: Filling Station', foot_right: 'Auto-Vacuum', foot_color: 'sky' }, { category: 'industri', image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', image_alt: 'Fabrikasi Baja dan Pengelasan Presisi Gresik & Pasuruan', badge: 'INDUSTRI & GALANGAN', badge_color: 'navy', location: 'Kawasan Industri Gresik & Pasuruan', status: 'Pasokan Kontrak', status_color: 'sky', title: 'Suplai Argon, Mixed Gases & Purging Nitrogen Galangan', description: 'Penyediaan pasokan gas Argon High Purity dan Gas Campuran dalam paket rak cradle silinder 16 tabung serta layanan purging pipelines Nitrogen untuk proyek galangan & pabrik baja.', foot_left: 'Produk: Argon, Mixed, Purging', foot_right: 'Cradle System', foot_color: 'sky' }, { category: 'industri', image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', image_alt: 'Nitrogen Liquid Pembekuan Cepat Makanan Mojokerto', badge: 'FOOD & BEVERAGE', badge_color: 'navy', location: 'Mojokerto & Malang', status: 'Food Grade', status_color: 'emerald', title: 'Penyediaan Liquid Nitrogen & CO2 Pembekuan Makanan', description: 'Pasokan teratur Nitrogen Cair dalam tabung cryogenic dewar serta gas CO2 food grade untuk industri pengemasan makanan beku, minuman berkarbonasi, dan modified atmosphere packaging.', foot_left: 'Format: Cryogenic Dewars', foot_right: 'Higienis & Bersertifikat', foot_color: 'emerald' }, { category: 'medis', image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', image_alt: 'Pasokan Oksigen Rumah Sakit & Homecare Jawa Timur', badge: 'HOMECARE & KLINIK', badge_color: 'sky', location: 'Jawa Timur Raya', status: 'Respon Tanggap', status_color: 'emerald', title: 'Armada Pengiriman Oksigen Medis Homecare & Regulator', description: 'Layanan cepat tanggap antar tabung oksigen medis 1 m³ dan 6 m³ lengkap dengan regulator medis berstandar, trolley silinder, dan pengujian kebocoran untuk pemulihan pasien di rumah.', foot_left: 'Layanan: Homecare Delivery', foot_right: 'Siap Kirim', foot_color: 'emerald' }, { category: 'kriogenik', image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', image_alt: 'Purging Pipelines with Nitrogen di Pabrik Petrokimia', badge: 'PURGING PIPELINE', badge_color: 'navy', location: 'Zona Industri Petrokimia', status: 'Sertifikasi Migas/K3', status_color: 'sky', title: 'Pembersihan & Inerting Jaringan Pipa dengan Nitrogen Kering', description: 'Jasa pengurasan pipa (purging) menggunakan gas Nitrogen bertekanan tinggi untuk menghilangkan uap hidrokarbon, kelembaban, dan oksigen sebelum proses re-commissioning pabrik kimia.', foot_left: 'Teknologi: High Pressure N2', foot_right: 'Zero Spark Risk', foot_color: 'sky' }];

function PfForm({ p, cats, onClose, onSave }) {
  const toast = useAdminToast(), fail = useFail();
  const [v, setV] = useState(() => ({ title: '', category: 'industri', badge: '', badge_color: 'navy', location: '', status: '', status_color: 'emerald', description: '', foot_left: '', foot_right: '', foot_color: 'emerald', image_url: '', detail: '', is_active: true, ...(p || {}), en: { ...((p && p.en) || {}) }, gallery: ((p && p.gallery) || []).slice() }));
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const setEn = (k) => (e) => setV({ ...v, en: { ...v.en, [k]: e.target.value } });
  const opts = cats.some((o) => o[0] === v.category) ? cats : cats.slice(0, -1).concat([[v.category, v.category], cats[cats.length - 1]]);
  const upCover = (e) => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; setBusy(true); toast('Mengunggah foto…'); uploadMedia(f, 1400).then((u) => { setV((x) => ({ ...x, image_url: u })); toast('Foto terunggah'); }).catch(fail).finally(() => setBusy(false)); };
  const upGal = async (e) => {
    const fs = [...e.target.files]; e.target.value = ''; if (!fs.length) return;
    setBusy(true); toast('Mengunggah ' + fs.length + ' foto…'); let n = 0;
    try { for (const f of fs) { const u = await uploadMedia(f, 1600); n++; setV((x) => ({ ...x, gallery: x.gallery.concat([u]) })); } toast(n + ' foto ditambahkan'); } catch (x) { fail(x); } finally { setBusy(false); }
  };
  const submit = () => {
    if (!v.title.trim()) return;
    const n = (s) => (s || '').trim() || null;
    onSave({ title: v.title.trim(), category: v.category, badge: n(v.badge), badge_color: v.badge_color, location: n(v.location), status: n(v.status), status_color: v.status_color,
      description: n(v.description), foot_left: n(v.foot_left), foot_right: n(v.foot_right), foot_color: v.foot_color, image_url: n(v.image_url), image_alt: v.title.trim(),
      detail: n(v.detail), gallery: v.gallery.slice(), is_active: v.is_active, en: Object.fromEntries(PF_EN.map(([k]) => [k, (v.en[k] || '').trim()])) });
  };
  const color = (k, map) => <select className="inp" value={v[k]} onChange={set(k)}>{Object.entries(map).map(([c, x]) => <option key={c} value={c}>{x[1]}</option>)}</select>;
  return (
    <Modal title={p ? 'Edit proyek' : 'Tambah proyek'} onClose={onClose} onSubmit={submit}>
      <div><label className="lbl">Foto proyek</label>
        <div className="flex items-center gap-3">
          <div className="w-28 h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-300 text-2xl">{v.image_url ? <img src={v.image_url} className="w-full h-full object-cover" alt="" /> : <i className="fa-regular fa-image" />}</div>
          <div className="flex-1 min-w-0 space-y-2"><label className="btn btn-ghost cursor-pointer"><i className="fa-solid fa-upload" /> Pilih foto dari komputer<input type="file" accept="image/*" className="hidden" onChange={upCover} /></label><input className="inp text-xs" value={v.image_url || ''} onChange={set('image_url')} placeholder="atau tempel alamat gambar (https://...)" /></div>
        </div></div>
      <div><label className="lbl">Judul proyek *</label><input className="inp" required value={v.title} onChange={set('title')} placeholder="Contoh: Pemasangan Gas Piping System RS Surabaya" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="lbl">Kelompok (untuk tombol filter)</label><select className="inp" value={v.category} onChange={set('category')}>{opts.map((o) => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="lbl">Label di foto</label><input className="inp" value={v.badge || ''} onChange={set('badge')} placeholder="INSTALASI MEDIS" /></div><div><label className="lbl">Warna</label>{color('badge_color', PF_BADGE)}</div></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="lbl">Lokasi / klien (kiri atas)</label><input className="inp" value={v.location || ''} onChange={set('location')} placeholder="Surabaya & Sidoarjo" /></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="lbl">Status (kanan atas)</label><input className="inp" value={v.status || ''} onChange={set('status')} placeholder="Aktif Beroperasi" /></div><div><label className="lbl">Warna</label>{color('status_color', PF_TXT)}</div></div>
      </div>
      <div><label className="lbl">Deskripsi proyek</label><textarea className="inp" rows="4" value={v.description || ''} onChange={set('description')} placeholder="Ceritakan pekerjaan yang dilakukan" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="lbl">Info bawah (kiri)</label><input className="inp" value={v.foot_left || ''} onChange={set('foot_left')} placeholder="Layanan: Piping & Delivery" /></div>
        <div className="grid grid-cols-2 gap-2"><div><label className="lbl">Info bawah (kanan)</label><input className="inp" value={v.foot_right || ''} onChange={set('foot_right')} placeholder="100% On-Time" /></div><div><label className="lbl">Warna</label>{color('foot_color', PF_TXT)}</div></div>
      </div>
      <div className="border-t border-slate-200 pt-4 space-y-4">
        <div><div className="text-sm font-bold text-slate-900">Halaman detail (tampil saat kartu proyek diklik)</div><p className="text-[11px] text-slate-500">Ikhtisar diambil otomatis dari isian di atas. Tambahkan penjelasan lengkap dan foto galeri di bawah ini (boleh dikosongkan).</p></div>
        <div><label className="lbl">Penjelasan lengkap kegiatan</label><textarea className="inp" rows="7" value={v.detail || ''} onChange={set('detail')} placeholder="Ceritakan latar belakang, pekerjaan yang dilakukan, hasil, dan pihak yang terlibat. Tekan Enter untuk paragraf baru." /></div>
        <div><label className="lbl">Galeri foto <span className="text-slate-400 font-normal">{v.gallery.length ? '(' + v.gallery.length + ' foto)' : '(belum ada)'}</span></label>
          <PhotoStrip list={v.gallery} setList={(g) => setV({ ...v, gallery: g })} />
          <label className="btn btn-ghost cursor-pointer"><i className="fa-solid fa-images" /> Tambah foto (boleh pilih banyak)<input type="file" accept="image/*" multiple className="hidden" onChange={upGal} /></label>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"><input type="checkbox" checked={v.is_active} onChange={set('is_active')} /> Tayangkan di website</label>
      <details className="border border-slate-200 rounded-lg p-3">
        <summary className="text-xs font-bold text-slate-600 cursor-pointer">Terjemahan Inggris (opsional, tampil saat pengunjung memilih EN)</summary>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {PF_EN.map(([k, l]) => <div key={k} className={['title', 'description', 'detail'].includes(k) ? 'sm:col-span-2' : ''}><label className="lbl">{l}</label>
            {['description', 'detail'].includes(k) ? <textarea className="inp" rows={k === 'detail' ? 5 : 3} value={v.en[k] || ''} onChange={setEn(k)} /> : <input className="inp" value={v.en[k] || ''} onChange={setEn(k)} />}</div>)}
        </div>
      </details>
      <div className="flex justify-end gap-2 pt-1"><button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button><button className="btn btn-primary" type="submit" disabled={busy}>Simpan</button></div>
    </Modal>
  );
}

export default function PortfolioAdmin() {
  const toast = useAdminToast(), fail = useFail();
  const [cfg, setCfg] = useState(null); // { managed, filters }
  useEffect(() => { getConfig('portfolio').then((c) => setCfg({ managed: !!(c && c.managed), filters: (c && Array.isArray(c.filters)) ? c.filters : [] })).catch(fail); }, [fail]);
  const saveCfg = (next) => setConfig('portfolio', next).then(() => setCfg(next));
  const markManaged = () => (cfg && !cfg.managed ? saveCfg({ ...cfg, managed: true }) : null);
  const { items, load, toggle, remove, move, save, importMany } = useItems('portfolio', { onChange: markManaged });
  const [edit, setEdit] = useState(undefined);
  const [fName, setFName] = useState(''), [fEn, setFEn] = useState('');
  const filters = cfg ? cfg.filters : [];
  const cats = [['medis', PF_CAT.medis], ['kriogenik', PF_CAT.kriogenik], ['industri', PF_CAT.industri]].concat(filters.map((f) => [f.key, f.label])).concat([['lainnya', 'Lainnya']]);
  const catLabel = (k) => PF_CAT[k] || (filters.find((x) => x.key === k) || {}).label || k || '';
  const act = (items || []).filter((j) => j.is_active).length;

  const addFilter = () => {
    const name = fName.trim(); if (!name) { toast('Isi nama filter dulu'); return; }
    if (name.toLowerCase() === 'lainnya' || Object.values(PF_CAT).some((l) => l.toLowerCase() === name.toLowerCase()) || filters.some((f) => f.label.toLowerCase() === name.toLowerCase())) { toast('Nama filter itu sudah ada'); return; }
    const base = 'f-' + (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x');
    let key = base, n = 2; while (filters.some((f) => f.key === key)) key = base + '-' + (n++);
    saveCfg({ ...cfg, filters: filters.concat([{ key, label: name, en: fEn.trim() }]) }).then(() => { setFName(''); setFEn(''); toast('Filter ditambahkan'); }).catch(fail);
  };
  const delFilter = (f) => {
    const used = (items || []).filter((p) => p.category === f.key);
    if (!window.confirm('Hapus filter "' + f.label + '"?' + (used.length ? '\n' + used.length + ' proyek di filter ini akan dipindah ke "Lainnya".' : ''))) return;
    (used.length ? adminApi('/items/portfolio/bulk', { method: 'POST', body: { ids: used.map((p) => p.id), category: 'lainnya' } }) : Promise.resolve())
      .then(() => saveCfg({ ...cfg, filters: filters.filter((x) => x.key !== f.key) })).then(() => { toast('Filter dihapus'); load(); }).catch(fail);
  };
  const onSave = (row) => {
    if (!edit) row.sort_order = (items || []).reduce((m, j) => Math.max(m, j.sort_order || 0), 0) + 10;
    save(edit && edit.id, row).then(() => { setEdit(undefined); toast('Proyek tersimpan'); }).catch(fail);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Portofolio Proyek</h2><p className="text-xs text-slate-500">Tambah, ubah, sembunyikan, atau hapus proyek. Halaman Portofolio di website langsung mengikuti daftar ini.</p></div>
        <button type="button" className="btn btn-primary" disabled={!items || !cfg} onClick={() => setEdit(null)}><i className="fa-solid fa-plus" /> Tambah proyek</button>
      </div>
      <div className="card p-4 mb-4">
        <div className="mb-2"><div className="text-sm font-bold text-slate-900">Tombol filter halaman Portofolio</div><div className="text-[11px] text-slate-500">Kelompok bawaan tidak bisa dihapus. Tambahkan kelompok baru di sini, lalu pilih saat menambah/mengedit proyek. Filter tambahan tampil setelah halaman Portofolio diatur dari admin.</div></div>
        <div className="flex flex-wrap gap-2 mb-3">
          {[PF_CAT.medis, PF_CAT.kriogenik, PF_CAT.industri].map((l) => <span key={l} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">{l}</span>)}
          {filters.map((f) => <span key={f.key} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800">{f.label}{f.en && <span className="text-sky-500 font-normal">/ {f.en}</span>}<button type="button" className="text-sky-500 hover:text-red-600 leading-none" title="Hapus filter" onClick={() => delFilter(f)}>&times;</button></span>)}
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">Lainnya</span>
        </div>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div><label className="lbl">Nama filter baru</label><input className="inp" maxLength="40" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Contoh: Pabrik Makanan & Minuman" /></div>
          <div><label className="lbl">Nama dalam bahasa Inggris (opsional)</label><input className="inp" maxLength="40" value={fEn} onChange={(e) => setFEn(e.target.value)} placeholder="Food & Beverage Plants" /></div>
          <button type="button" className="btn btn-primary" onClick={addFilter} disabled={!cfg}><i className="fa-solid fa-plus" /> Tambah filter</button>
        </div>
      </div>
      <div className="mb-4">
        {cfg && !cfg.managed && items && (
          <div className="card p-4 border-amber-300 bg-amber-50 text-sm text-amber-900"><b>Halaman Portofolio masih memakai 6 proyek bawaan dari kode website</b> (belum diatur dari admin).
            <div className="flex flex-wrap gap-2 mt-3">
              {items.length ? <button type="button" className="btn btn-primary" onClick={() => markManaged().then(() => toast('Halaman Portofolio sekarang diatur dari admin')).catch(fail)}>Mulai atur dari admin</button> : (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => importMany(SEED_PF.map((p, i) => ({ sort_order: (i + 1) * 10, is_active: true, ...p })), '6 proyek diimpor').catch(fail)}>Impor 6 proyek bawaan (lalu bisa diedit)</button>
                  <button type="button" className="btn btn-ghost" onClick={() => markManaged().then(() => toast('Halaman Portofolio sekarang diatur dari admin')).catch(fail)}>Mulai dari kosong</button>
                </>
              )}
            </div>
          </div>
        )}
        {cfg && cfg.managed && (
          <div className="card p-3 border-emerald-300 bg-emerald-50 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
            <span><i className="fa-solid fa-circle-check" /> Halaman Portofolio mengikuti daftar di bawah. <b>{act}</b> proyek tayang.</span>
            <button type="button" className="underline font-semibold" onClick={() => { if (window.confirm('Kembali memakai 6 proyek bawaan di kode website? Daftar di admin tidak dihapus, hanya tidak dipakai.')) saveCfg({ ...cfg, managed: false }).then(() => toast('Kembali ke tampilan bawaan')).catch(fail); }}>Kembali ke tampilan bawaan</button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {!items ? <p className="text-sm text-slate-500">Memuat…</p> : !items.length ? <div className="card p-6 text-sm text-slate-500">Belum ada proyek di daftar.</div> : items.map((p, i) => (
          <div key={p.id} className={'card p-3 ' + (p.is_active ? '' : 'opacity-60')}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">{p.image_url && <img src={p.image_url} className="w-full h-full object-cover" alt="" loading="lazy" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {p.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: (PF_BADGE[p.badge_color] || PF_BADGE.navy)[0] }}>{p.badge}</span>}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{catLabel(p.category)}</span>
                  {(p.detail || (p.gallery && p.gallery.length > 0)) && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700">DETAIL{p.gallery && p.gallery.length ? ' • ' + p.gallery.length + ' FOTO' : ''}</span>}
                  <StatusChip on={p.is_active} />
                </div>
                <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{[p.location, p.status].filter(Boolean).join(' • ')}</div>
              </div>
              <RowActions i={i} n={items.length} active={p.is_active} onMove={(d) => move(i, d)} onToggle={() => toggle(p, ['Proyek disembunyikan', 'Proyek ditayangkan'])}
                onEdit={() => setEdit(p)} onDelete={() => remove(p, 'Proyek dihapus')} />
            </div>
          </div>
        ))}
      </div>
      {edit !== undefined && <PfForm p={edit} cats={cats} onClose={() => setEdit(undefined)} onSave={onSave} />}
    </>
  );
}
