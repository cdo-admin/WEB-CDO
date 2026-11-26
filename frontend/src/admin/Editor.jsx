// Edit Website: halaman tampil di iframe (?cms_edit=1). Klik teks / gambar / link / kartu -> ubah di panel kanan.
import { useEffect, useRef, useState } from 'react';
import { PAGE_ROUTES } from '../lib/pages.js';
import { upsert, removeContent, listContent, getConfig, setConfig, uploadMedia, useAdminToast, useFail } from './common.jsx';

const PAGES = [['index.html', 'Beranda'], ['about.html', 'Tentang'], ['products.html', 'Produk'], ['portfolio.html', 'Portofolio'], ['gallery.html', 'Galeri Kegiatan'], ['career.html', 'Karir'], ['contact.html', 'Kontak'], ['quote.html', 'Penawaran']];
const QCAT = { gases: 'gas', services: 'service', equipment: 'equipment' };

function TextBox({ t, i, many, onSave, onReset }) {
  const [id, setId] = useState(t.id), [en, setEn] = useState(t.en);
  return (
    <div className="space-y-2">
      <div className="lbl">Teks {many ? i + 1 : ''}</div>
      <div className="text-[11px] text-slate-400 line-clamp-2">Asli: {t.orig.slice(0, 120)}</div>
      <label className="lbl !text-slate-500">Indonesia</label>
      <textarea className="inp" rows={Math.min(6, Math.max(2, Math.ceil(t.id.length / 38)))} value={id} onChange={(e) => setId(e.target.value)} />
      <label className="lbl !text-slate-500">English</label>
      <textarea className="inp" rows={Math.min(6, Math.max(2, Math.ceil((t.en || t.id).length / 38)))} value={en} placeholder="Terjemahan English" onChange={(e) => setEn(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className="btn btn-primary" onClick={() => onSave(id, en.trim())}><i className="fa-solid fa-check" /> Simpan</button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>Kembalikan ke asli</button>
      </div>
    </div>
  );
}

function Panel({ d, page, done }) {
  const toast = useAdminToast(), fail = useFail();
  const scope = d.scope || '';
  const [imgUrl, setImgUrl] = useState(d.img ? d.img.cur : '');
  const [href, setHref] = useState(d.href ? d.href.cur : '');
  const [dup, setDup] = useState(false), [dupQuote, setDupQuote] = useState(false), [dupName, setDupName] = useState('');
  const canQuote = page === 'products.html' && d.card && QCAT[d.card.section];

  const saveText = (t, id, en) => {
    if (id !== t.orig && !en && !window.confirm('Kolom English kosong. Versi English akan tampil dengan teks Indonesia. Lanjut simpan?')) return;
    upsert([{ kind: 'text', key: t.orig, scope, value_id: id, value_en: en || null }]).then(() => done('Teks tersimpan')).catch(fail);
  };
  const setImg = (u) => upsert([{ kind: 'img', key: d.img.orig, scope, value_id: u }]).then(() => done('Gambar diganti')).catch(fail);
  const onFile = (e) => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    toast('Mengunggah…');
    const png = /\.png$/i.test(d.img.orig) && /logo|icon/i.test(d.img.orig);
    uploadMedia(f, png ? 800 : 1920, png).then(setImg).catch(fail);
  };
  const toggleHide = () => (d.card.hidden ? removeContent({ kind: 'hide', key: d.card.sig, scope: '' }) : upsert([{ kind: 'hide', key: d.card.sig, scope: '', value_id: '1' }]))
    .then(() => done(d.card.hidden ? 'Kartu ditampilkan' : 'Kartu disembunyikan')).catch(fail);
  const delClone = () => {
    if (!window.confirm('Hapus kartu tambahan ini?')) return;
    removeContent({ kind: 'clone', key: d.card.sig, scope: d.card.scope }).then(() => removeContent({ scope: d.card.scope })).then(() => done('Kartu dihapus')).catch(fail);
  };
  const doDup = async () => {
    const newScope = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
    const qName = canQuote && dupQuote ? dupName.trim() : '';
    if (canQuote && dupQuote && !qName) { toast('Isi nama produk untuk form penawaran', true); return; }
    try {
      await upsert([{ kind: 'clone', key: d.card.sig, scope: newScope, value_id: '', position: Date.now() }]);
      if (d.card.isClone) { // salin isi kartu sumber
        const rows = (await listContent({ scope: d.card.scope })).filter((x) => ['text', 'img', 'href'].includes(x.kind));
        if (rows.length) await upsert(rows.map((x) => ({ kind: x.kind, key: x.key, scope: newScope, value_id: x.value_id, value_en: x.value_en })));
      }
      if (qName) {
        const cfg = (await getConfig('quote')) || {}; cfg.products = cfg.products || [];
        if (!cfg.products.some((x) => x.name === qName)) cfg.products.push({ name: qName, label: qName, category: QCAT[d.card.section], specs: null, variant: null, search: true });
        await setConfig('quote', cfg);
      }
      done('Kartu disalin. Klik kartu baru untuk mengedit.');
    } catch (e) { fail(e); }
  };

  if (!d.texts.length && !d.img && !d.href && !d.card) return <p className="text-sm text-slate-500">Bagian ini tidak bisa diedit. Coba klik teks, gambar, atau kartu di dekatnya.</p>;
  return (
    <div className="space-y-5">
      {d.scope && <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5"><i className="fa-solid fa-clone" /> Bagian dari kartu tambahan. Perubahan hanya berlaku untuk kartu ini.</div>}
      {d.texts.map((t, i) => (
        <TextBox key={t.orig} t={t} i={i} many={d.texts.length > 1} onSave={(id, en) => saveText(t, id, en)}
          onReset={() => removeContent({ kind: 'text', key: t.orig, scope }).then(() => done('Dikembalikan ke asli')).catch(fail)} />
      ))}
      {d.img && (
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <div className="lbl">Gambar</div>
          <img src={d.img.src} className="w-full h-32 object-cover rounded-lg border border-slate-200" alt="" />
          <label className="btn btn-primary cursor-pointer w-full justify-center"><i className="fa-solid fa-upload" /> Unggah gambar baru<input type="file" accept="image/*" className="hidden" onChange={onFile} /></label>
          <label className="lbl !text-slate-500">atau alamat gambar (URL)</label>
          <input className="inp" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => imgUrl.trim() && setImg(imgUrl.trim())}>Simpan URL</button>
            <button type="button" className="btn btn-ghost" onClick={() => removeContent({ kind: 'img', key: d.img.orig, scope }).then(() => done('Dikembalikan ke asli')).catch(fail)}>Kembalikan ke asli</button>
          </div>
        </div>
      )}
      {d.href && (
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <div className="lbl">Link tombol / ikon</div>
          <input className="inp" value={href} onChange={(e) => setHref(e.target.value)} />
          <p className="text-[11px] text-slate-400">WhatsApp: https://wa.me/628xxxxxxxxxx · Instagram: https://instagram.com/akun · Email: mailto:nama@email.com · Telepon: tel:+62...</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary" onClick={() => {
              const u = href.trim(); if (!u) return;
              if (/^\s*javascript:/i.test(u)) { toast('Link tidak valid', true); return; }
              upsert([{ kind: 'href', key: d.href.orig, scope, value_id: u }]).then(() => done('Link tersimpan')).catch(fail);
            }}><i className="fa-solid fa-check" /> Simpan link</button>
            <button type="button" className="btn btn-ghost" onClick={() => removeContent({ kind: 'href', key: d.href.orig, scope }).then(() => done('Dikembalikan ke asli')).catch(fail)}>Kembalikan ke asli</button>
          </div>
        </div>
      )}
      {d.card && (
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <div className="lbl">Kartu: {d.card.title.slice(0, 50)}</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setDup(true)}><i className="fa-solid fa-clone" /> Duplikat kartu</button>
            {d.card.isClone ? <button type="button" className="btn btn-danger" onClick={delClone}><i className="fa-solid fa-trash" /> Hapus kartu ini</button>
              : <button type="button" className="btn btn-ghost" onClick={toggleHide}><i className={'fa-solid ' + (d.card.hidden ? 'fa-eye' : 'fa-eye-slash')} /> {d.card.hidden ? 'Tampilkan kembali' : 'Sembunyikan'}</button>}
          </div>
          {dup && (
            <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-xs text-slate-600">Kartu salinan akan muncul tepat setelah kartu ini. Klik teks dan fotonya untuk mengubah isinya.</p>
              {canQuote && <label className="flex items-start gap-2 text-xs"><input type="checkbox" className="mt-0.5" checked={dupQuote} onChange={(e) => setDupQuote(e.target.checked)} /> <span>Tambahkan juga ke form penawaran dan pencarian</span></label>}
              {canQuote && dupQuote && <div><label className="lbl">Nama produk di form penawaran</label><input className="inp" placeholder="contoh: Hidrogen (H2)" value={dupName} onChange={(e) => setDupName(e.target.value)} /></div>}
              <button type="button" className="btn btn-primary" onClick={doDup}><i className="fa-solid fa-clone" /> Buat salinan</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Editor() {
  const toast = useAdminToast();
  const frame = useRef(null);
  const [page, setPage] = useState('index.html');
  const [width, setWidth] = useState('100%');
  const [sel, setSel] = useState(null);
  const [selKey, setSelKey] = useState(0);

  useEffect(() => {
    const on = (e) => {
      if (e.origin !== window.location.origin || !e.data || !e.data.cms || !frame.current || e.source !== frame.current.contentWindow) return;
      if (e.data.cms === 'select') { setSel(e.data.data); setSelKey((k) => k + 1); }
      if (e.data.cms === 'reloaded') setSel(null);
    };
    window.addEventListener('message', on);
    return () => window.removeEventListener('message', on);
  }, []);

  const done = (msg) => { toast(msg); frame.current?.contentWindow?.postMessage({ cms: 'reload' }, window.location.origin); };
  const src = import.meta.env.BASE_URL.replace(/\/$/, '') + PAGE_ROUTES[page] + '?cms_edit=1';

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div><h2 className="text-xl font-bold text-slate-900">Edit Website</h2><p className="text-xs text-slate-500">Klik teks, gambar, tombol, atau kartu di halaman di bawah, lalu ubah lewat panel di kanan.</p></div>
        <div className="flex flex-wrap gap-2">
          {PAGES.map(([p, l]) => <button key={p} type="button" className={'btn ' + (p === page ? 'btn-primary' : 'btn-ghost')} onClick={() => { setPage(p); setSel(null); }}>{l}</button>)}
        </div>
      </div>
      <div id="editor-wrap" className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-500">
            <i className="fa-solid fa-hand-pointer" /> Mode edit aktif. Tombol dan link tidak akan berpindah halaman.
            <span className="ml-auto flex gap-1">
              <button type="button" className="btn btn-ghost !py-1 !px-2" onClick={() => setWidth('100%')}>Desktop</button>
              <button type="button" className="btn btn-ghost !py-1 !px-2" onClick={() => setWidth('420px')}>HP</button>
            </span>
          </div>
          <div className="bg-slate-200 flex justify-center">
            <iframe ref={frame} key={page} src={src} title="Pratinjau" className="bg-white" style={{ width, height: '78vh', border: 0, transition: 'width .2s' }} />
          </div>
        </div>
        <aside id="editor-panel" className="card p-4 w-[360px] shrink-0 lg:sticky lg:top-4 max-h-[88vh] overflow-y-auto">
          {sel ? <Panel key={selKey} d={sel} page={page} done={done} /> : (
            <div className="text-sm text-slate-500 space-y-3">
              <div className="font-bold text-slate-800"><i className="fa-solid fa-circle-info text-sky-600" /> Cara pakai</div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Klik <b>teks</b> untuk mengubah kata-katanya (isi versi Indonesia dan English).</li>
                <li>Klik <b>gambar</b> untuk mengganti foto.</li>
                <li>Klik <b>tombol / link</b> untuk mengubah tujuannya (WhatsApp, Instagram, LinkedIn, dll).</li>
                <li>Klik <b>kartu produk / proyek</b> lalu pilih Duplikat atau Sembunyikan.</li>
                <li>Kartu dengan garis hijau adalah kartu tambahan buatan Anda.</li>
                <li>Perubahan langsung tersimpan dan tampil di website.</li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
