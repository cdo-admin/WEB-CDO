// Pesan Masuk: lamaran kerja & review pengunjung. Balas lewat WhatsApp atau Gmail.
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { useAdminToast, useFail } from './common.jsx';

const INCAT = {
  career_applications: { label: 'Lamaran Kerja', icon: 'fa-user-tie', color: '#8b5cf6', empty: 'Belum ada lamaran kerja.' },
  reviews: { label: 'Review Masuk', icon: 'fa-star', color: '#f59e0b', empty: 'Belum ada review. Review dari pengunjung akan muncul di sini.' },
};
const SIGN = 'Salam hormat,\nPT. Candi Oxygen\nTelp. (031) 990103 15 / 16 | WhatsApp +62 811-3739-800';
const stars = (n) => { n = Math.max(0, Math.min(5, parseInt(n, 10) || 0)); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); };
const subsOf = (t, m) => (t === 'reviews' ? [stars(m.rating) + ' (' + (m.rating || 0) + ')'] : [m.position || 'Tanpa posisi']);
const waLink = (p) => 'https://wa.me/' + String(p).replace(/\D/g, '').replace(/^0/, '62');
function relTime(d) {
  const s = Math.round((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'baru saja'; if (s < 3600) return Math.round(s / 60) + ' menit lalu'; if (s < 86400) return Math.round(s / 3600) + ' jam lalu'; if (s < 7 * 86400) return Math.round(s / 86400) + ' hari lalu';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
const gmAcct = () => { try { return localStorage.getItem('candiGmailAcct') || ''; } catch { return ''; } };
function gmailLink(t, m) {
  const nm = m.full_name || '';
  const [subj, body] = t === 'reviews'
    ? ['Terima kasih atas review Anda - PT. Candi Oxygen', 'Yth. ' + nm + ',\n\nTerima kasih telah meluangkan waktu memberikan review untuk PT. Candi Oxygen.\n\n\n']
    : ['Lamaran Posisi ' + (m.position || '') + ' - PT. Candi Oxygen', 'Yth. ' + nm + ',\n\nTerima kasih telah melamar di PT. Candi Oxygen.\n\n\n'];
  const a = gmAcct();
  return 'https://mail.google.com/mail/?view=cm&fs=1&tf=1' + (a ? '&authuser=' + encodeURIComponent(a) : '') + '&to=' + encodeURIComponent(m.email) + '&su=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body + SIGN);
}
const Field = ({ label, children }) => (children ? <div><div className="lbl !mb-0">{label}</div><div className="text-sm text-slate-800 break-words">{children}</div></div> : null);
const Box = ({ label, text }) => (text ? <div><div className="lbl">{label}</div><div className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap break-words">{text}</div></div> : null);

export default function Inbox({ onBadge }) {
  const toast = useAdminToast(), fail = useFail();
  const [inb, setInb] = useState(null);
  const [cat, setCat] = useState('career_applications');
  const [sub, setSub] = useState('');
  const [open, setOpen] = useState({});
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [q, setQ] = useState('');
  const [gm, setGm] = useState(gmAcct);

  useEffect(() => {
    Promise.all(Object.keys(INCAT).map((t) => adminApi('/inbox/' + t))).then((r) => setInb({ career_applications: r[0] || [], reviews: r[1] || [] })).catch(fail);
  }, [fail]);
  const unread = useCallback((t) => (inb ? inb[t].filter((m) => !m.is_read).length : 0), [inb]);
  useEffect(() => { if (inb) onBadge(unread('career_applications') + unread('reviews')); }, [inb, unread, onBadge]);

  const setRead = (t, ids, val) => adminApi('/inbox/' + t + '/read', { method: 'POST', body: { ids, is_read: val } })
    .then(() => setInb((x) => ({ ...x, [t]: x[t].map((m) => (ids.includes(m.id) ? { ...m, is_read: val } : m)) })));
  const del = (t, m) => {
    if (!window.confirm('Hapus pesan ini permanen?')) return;
    adminApi('/inbox/' + t + '/' + m.id, { method: 'DELETE' }).then(() => { setInb((x) => ({ ...x, [t]: x[t].filter((y) => y.id !== m.id) })); toast('Pesan dihapus'); }).catch(fail);
  };

  if (!inb) return <p className="text-sm text-slate-500">Memuat…</p>;
  const data = inb[cat], ql = q.trim().toLowerCase();
  const counts = {}, order = [];
  data.forEach((m) => subsOf(cat, m).forEach((s) => { if (!(s in counts)) { counts[s] = 0; order.push(s); } counts[s]++; }));
  order.sort((a, b) => counts[b] - counts[a]);
  const curSub = sub && sub in counts ? sub : '';
  const rows = data.filter((m) => {
    if (unreadOnly && m.is_read) return false;
    if (curSub && subsOf(cat, m).indexOf(curSub) < 0) return false;
    if (ql) { const hay = [m.full_name, m.email, m.phone, m.company, m.message, m.position, m.cover_letter].join(' ').toLowerCase(); if (hay.indexOf(ql) < 0) return false; }
    return true;
  });
  const groups = {}, gorder = [];
  rows.forEach((m) => { const g = curSub || subsOf(cat, m)[0]; if (!(g in groups)) { groups[g] = []; gorder.push(g); } groups[g].push(m); });
  gorder.sort((a, b) => groups[b].length - groups[a].length);

  const card = (m) => {
    const k = cat + m.id, isOpen = !!open[k];
    const preview = cat === 'reviews' ? String(m.message || '').replace(/\s+/g, ' ').slice(0, 110) : 'Melamar sebagai ' + (m.position || '-');
    const toggle = () => { setOpen((o) => ({ ...o, [k]: !o[k] })); if (!isOpen && !m.is_read) setRead(cat, [m.id], true).catch(fail); };
    return (
      <div key={m.id} className={'card ' + (m.is_read ? '' : 'border-sky-300')}>
        <button type="button" className="w-full text-left p-3.5 flex items-start gap-3" onClick={toggle}>
          <span className={'mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ' + (m.is_read ? 'bg-slate-300' : 'bg-sky-500')} />
          <span className="flex-1 min-w-0">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className={'text-sm ' + (m.is_read ? 'font-semibold' : 'font-bold') + ' text-slate-900'}>{m.full_name || '(tanpa nama)'}</span>
              {m.company && <span className="text-xs text-slate-500">{m.company}</span>}
              {cat === 'reviews' && <span className="text-[11px] font-bold text-amber-500 tracking-wider">{stars(m.rating)}</span>}
            </span>
            <span className="block text-xs text-slate-500 truncate mt-0.5">{preview}</span>
          </span>
          <span className="text-[11px] text-slate-400 whitespace-nowrap">{relTime(m.created_at)} <i className={'fa-solid fa-chevron-' + (isOpen ? 'up' : 'down') + ' ml-1'} /></span>
        </button>
        {isOpen && (
          <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50/50">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nama">{m.full_name}</Field><Field label="Perusahaan / instansi">{m.company}</Field>
              <Field label="Email">{m.email && <a className="text-sky-700 underline" target="_blank" rel="noopener noreferrer" href={gmailLink(cat, m)}>{m.email}</a>}</Field>
              <Field label="Telepon / WhatsApp">{m.phone && <a className="text-sky-700 underline" target="_blank" rel="noopener noreferrer" href={waLink(m.phone)}>{m.phone}</a>}</Field>
              <Field label="Diterima">{new Date(m.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</Field>
            </div>
            {cat === 'reviews' ? (
              <><Field label="Penilaian"><span className="text-amber-500 text-base tracking-wider">{stars(m.rating)}</span> <b>{parseInt(m.rating, 10) || 0} / 5</b></Field><Box label="Isi review" text={m.message} /></>
            ) : (
              <>
                <Field label="Posisi dilamar"><b>{m.position || '-'}</b></Field>
                <div className="flex flex-wrap gap-2">
                  {m.linkedin_url && <a className="btn btn-ghost !py-1" target="_blank" rel="noopener noreferrer" href={m.linkedin_url}><i className="fa-brands fa-linkedin-in" /> LinkedIn</a>}
                  {m.portfolio_url && <a className="btn btn-ghost !py-1" target="_blank" rel="noopener noreferrer" href={m.portfolio_url}><i className="fa-solid fa-folder-open" /> CV / Portofolio</a>}
                </div>
                <Box label="Surat lamaran / pengalaman" text={m.cover_letter} />
              </>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {m.phone && <a className="btn btn-primary !py-1.5" style={{ background: '#16a34a' }} target="_blank" rel="noopener noreferrer" href={waLink(m.phone)}><i className="fa-brands fa-whatsapp" /> Balas WhatsApp</a>}
              {m.email && <><a className="btn btn-ghost !py-1.5" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }} target="_blank" rel="noopener noreferrer" href={gmailLink(cat, m)} title="Membuka Gmail dengan penerima sudah terisi"><i className="fa-brands fa-google" /> Balas via Gmail</a><a className="text-[11px] text-slate-400 underline self-center" href={'mailto:' + m.email}>pakai aplikasi email lain</a></>}
              <button type="button" className="btn btn-ghost !py-1.5" onClick={() => setRead(cat, [m.id], !m.is_read).catch(fail)}>{m.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca'}</button>
              <button type="button" className="btn btn-danger !py-1.5 ml-auto" onClick={() => del(cat, m)}><i className="fa-solid fa-trash" /> Hapus</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Pesan Masuk</h2><p className="text-xs text-slate-500">Lamaran kerja dan review dari pengunjung. Klik salah satu untuk membuka detailnya.</p></div>
        <button type="button" className="btn btn-ghost" onClick={() => {
          const ids = data.filter((m) => !m.is_read).map((m) => m.id);
          if (!ids.length) { toast('Semua sudah dibaca'); return; }
          setRead(cat, ids, true).then(() => toast('Ditandai dibaca')).catch(fail);
        }}><i className="fa-solid fa-check-double" /> Tandai semua dibaca</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {Object.entries(INCAT).map(([t, c]) => (
          <button key={t} type="button" onClick={() => { setCat(t); setSub(''); }} className={'card p-4 text-left transition ' + (t === cat ? 'ring-2 ring-sky-500' : 'hover:bg-slate-50')}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: c.color }}><i className={'fa-solid ' + c.icon} /></span>
              <div className="flex-1"><div className="text-sm font-bold text-slate-900">{c.label}</div><div className="text-[11px] text-slate-500">{inb[t].length} pesan</div></div>
              {unread(t) > 0 && <span className="text-[11px] font-bold bg-red-500 text-white rounded-full px-2 py-0.5">{unread(t)} baru</span>}
            </div>
          </button>
        ))}
      </div>
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-[200px]">
          <button type="button" className={'btn ' + (!curSub ? 'btn-primary' : 'btn-ghost') + ' !py-1 !text-[11px]'} onClick={() => setSub('')}>Semua ({data.length})</button>
          {order.map((s) => <button key={s} type="button" className={'btn ' + (curSub === s ? 'btn-primary' : 'btn-ghost') + ' !py-1 !text-[11px]'} onClick={() => setSub(s)}>{s} ({counts[s]})</button>)}
        </div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer"><input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} /> Hanya belum dibaca</label>
        <input className="inp !w-52" placeholder="Cari nama / isi pesan…" value={q} onChange={(e) => setQ(e.target.value)} />
        <input type="email" className="inp !w-56" title="Dipakai bila di browser ini login ke beberapa akun Google" placeholder="Gmail pengirim (opsional)" value={gm}
          onChange={(e) => setGm(e.target.value)} onBlur={() => { try { localStorage.setItem('candiGmailAcct', gm.trim()); } catch { /* ignore */ } toast('Akun Gmail disimpan di browser ini'); }} />
      </div>
      <div className="space-y-5">
        {!rows.length ? <div className="card p-6 text-sm text-slate-500">{data.length ? 'Tidak ada pesan yang cocok dengan filter.' : INCAT[cat].empty}</div> : gorder.map((g) => {
          const un = groups[g].filter((m) => !m.is_read).length;
          return (
            <div key={g}>
              <div className="flex items-center gap-2 mb-2"><h3 className="text-sm font-bold text-slate-800">{g}</h3><span className="text-[11px] text-slate-500">{groups[g].length} pesan</span>{un > 0 && <span className="text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5">{un} baru</span>}<div className="flex-1 border-t border-slate-200" /></div>
              <div className="space-y-2">{groups[g].map(card)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
