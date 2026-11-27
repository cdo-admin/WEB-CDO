// Statistik pengunjung: dari mana pengunjung datang dan halaman apa yang mereka buka.
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { useFail } from './adminLib.js';
import { SRC } from './sources.js';

const srcMeta = (k) => SRC[k] || [k, '#94a3b8', 'fa-solid fa-globe'];
const PAGE_NAME = { 'index.html': 'Beranda', 'about.html': 'Tentang Kami', 'products.html': 'Produk & Layanan', 'portfolio.html': 'Portofolio', 'gallery.html': 'Galeri Kegiatan', 'career.html': 'Karir', 'contact.html': 'Kontak', 'quote.html': 'Ajukan Penawaran' };
const day = (d) => d.toLocaleDateString('en-CA');
const tally = (list, fn) => { const m = {}; list.forEach((x) => { const k = fn(x) || '-'; m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };

function Bars({ entries, total, color, label }) {
  if (!entries.length) return <p className="text-xs text-slate-400">Belum ada data.</p>;
  return entries.map(([k, n]) => {
    const pct = total ? Math.round(n * 1000 / total) / 10 : 0;
    return (
      <div key={k}>
        <div className="flex justify-between text-xs mb-1"><span className="font-semibold">{label(k)}</span><span className="text-slate-500">{n} · {pct}%</span></div>
        <div className="bar"><i style={{ width: Math.max(pct, 2) + '%', background: color ? color(k) : '#0284c7' }} /></div>
      </div>
    );
  });
}

function Chart({ data }) {
  const W = 800, H = 220, pl = 34, pb = 26, pt = 10, pr = 8;
  const max = Math.max(4, ...data.map((x) => x.v)), n = data.length, step = n > 1 ? (W - pl - pr) / (n - 1) : 0;
  const X = (i) => pl + (n > 1 ? i * step : (W - pl - pr) / 2), Y = (v) => pt + (H - pt - pb) * (1 - v / max);
  const path = (k) => data.map((x, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(x[k])).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Grafik kunjungan per hari">
      {[0, 1, 2, 3, 4].map((g) => <g key={g}><line x1={pl} x2={W - pr} y1={Y(max * g / 4)} y2={Y(max * g / 4)} stroke="#e2e8f0" /><text x={pl - 6} y={Y(max * g / 4) + 3} fontSize="10" textAnchor="end" fill="#94a3b8">{Math.round(max * g / 4)}</text></g>)}
      {data.map((x, i) => (n > 12 && i % Math.ceil(n / 8) !== 0 && i !== n - 1) ? null : <text key={x.d} x={X(i)} y={H - 8} fontSize="10" textAnchor="middle" fill="#94a3b8">{x.d.split('-')[2]}/{x.d.split('-')[1]}</text>)}
      <path d={path('v')} fill="none" stroke="#0284c7" strokeWidth="2.5" /><path d={path('u')} fill="none" stroke="#10b981" strokeWidth="2.5" />
      {data.map((x, i) => <circle key={x.d} cx={X(i)} cy={Y(x.v)} r="3" fill="#0284c7"><title>{x.d}: {x.v} tampilan, {x.u} pengunjung</title></circle>)}
    </svg>
  );
}

export default function Dashboard() {
  const fail = useFail();
  const [days, setDays] = useState(7);
  const [d, setD] = useState(null);
  const load = useCallback(() => {
    const since = new Date(); since.setHours(0, 0, 0, 0); since.setDate(since.getDate() - (days - 1));
    adminApi('/stats', { query: { since: since.toISOString() } }).then((r) => {
      const v = r.views || [], visitors = {}, sessions = {};
      v.forEach((x) => { visitors[x.visitor_id] = 1; if (!sessions[x.session_id]) sessions[x.session_id] = x; });
      const perDay = {}, dd = new Date(since);
      for (let i = 0; i < days; i++) { perDay[day(dd)] = { v: 0, u: {} }; dd.setDate(dd.getDate() + 1); }
      v.forEach((x) => { const k = day(new Date(x.created_at)); if (perDay[k]) { perDay[k].v++; perDay[k].u[x.visitor_id] = 1; } });
      setD({ v, nV: Object.keys(visitors).length, ss: Object.values(sessions), apps: r.applications, revs: r.reviews,
        chart: Object.entries(perDay).map(([k, x]) => ({ d: k, v: x.v, u: Object.keys(x.u).length })) });
    }).catch(fail);
  }, [days, fail]);
  useEffect(() => { load(); }, [load]);

  const kpi = (label, val, icon, col) => (
    <div className="card p-4" key={label}><div className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500"><i className={'fa-solid ' + icon} style={{ color: col }} />{label}</div><div className="text-2xl font-bold mt-1">{val}</div></div>
  );
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div><h2 className="text-xl font-bold text-slate-900">Statistik Pengunjung</h2><p className="text-xs text-slate-500">Dari mana pengunjung datang dan halaman apa yang mereka buka.</p></div>
        <div className="flex gap-2">
          <select className="inp !w-auto" value={days} onChange={(e) => { setD(null); setDays(+e.target.value); }}>
            <option value="1">Hari ini</option><option value="7">7 hari terakhir</option><option value="30">30 hari terakhir</option><option value="90">90 hari terakhir</option>
          </select>
          <button type="button" className="btn btn-ghost" onClick={() => { setD(null); load(); }}><i className="fa-solid fa-rotate" /> Muat ulang</button>
        </div>
      </div>
      {!d ? <div className="text-sm text-slate-500">Memuat…</div> : (
        <>
          {!d.v.length && <div className="card p-4 text-sm text-slate-600 mb-4">Belum ada kunjungan tercatat pada periode ini. Kunjungan Anda sendiri (browser yang dipakai login admin) tidak dihitung.</div>}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {kpi('Tampilan halaman', d.v.length, 'fa-eye', '#0284c7')}{kpi('Pengunjung unik', d.nV, 'fa-user', '#10b981')}{kpi('Sesi', d.ss.length, 'fa-door-open', '#8b5cf6')}
            {kpi('Lamaran masuk', d.apps, 'fa-user-tie', '#8b5cf6')}{kpi('Review masuk', d.revs, 'fa-star', '#f59e0b')}
          </div>
          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-sm">Kunjungan per hari</h3>
              <div className="flex gap-3 text-[11px] text-slate-500"><span><i className="fa-solid fa-circle text-sky-600 text-[8px]" /> Tampilan halaman</span><span><i className="fa-solid fa-circle text-emerald-500 text-[8px]" /> Pengunjung unik</span></div></div>
            <Chart data={d.chart} />
          </div>
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="card p-4"><h3 className="font-bold text-sm mb-3">Pengunjung datang dari (per sesi)</h3><div className="space-y-3">
              <Bars entries={tally(d.ss, (x) => x.source)} total={d.ss.length} color={(k) => srcMeta(k)[1]} label={(k) => { const m = srcMeta(k); return <><i className={m[2] + ' mr-1.5'} style={{ color: m[1] }} />{m[0]}</>; }} /></div></div>
            <div className="card p-4"><h3 className="font-bold text-sm mb-3">Halaman terpopuler</h3><div className="space-y-3">
              <Bars entries={tally(d.v, (x) => x.path).slice(0, 7)} total={d.v.length} label={(k) => PAGE_NAME[k] || k} /></div></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-4 mb-4">
            <div className="card p-4"><h3 className="font-bold text-sm mb-3">Jenis perangkat</h3><div className="space-y-3"><Bars entries={tally(d.ss, (x) => x.device)} total={d.ss.length} label={(k) => ({ mobile: 'HP', desktop: 'Komputer', tablet: 'Tablet' }[k] || k)} /></div></div>
            <div className="card p-4"><h3 className="font-bold text-sm mb-3">Bahasa</h3><div className="space-y-3"><Bars entries={tally(d.ss, (x) => x.lang)} total={d.ss.length} label={(k) => ({ id: 'Indonesia', en: 'English' }[k] || k)} /></div></div>
            <div className="card p-4"><h3 className="font-bold text-sm mb-3">Jenis sumber</h3><div className="space-y-3"><Bars entries={tally(d.ss, (x) => x.medium)} total={d.ss.length} label={(k) => ({ social: 'Media sosial', search: 'Mesin pencari', direct: 'Langsung', messaging: 'Aplikasi chat', referral: 'Website lain', email: 'Email', offline: 'Offline (brosur/QR)', campaign: 'Kampanye' }[k] || k)} /></div></div>
          </div>
          <div className="card p-4 overflow-x-auto"><h3 className="font-bold text-sm mb-3">Kunjungan terbaru</h3>
            <table className="w-full text-xs"><thead><tr className="text-left text-slate-500"><th className="py-1">Waktu</th><th>Halaman</th><th>Sumber</th><th>Perangkat</th></tr></thead>
              <tbody>
                {d.v.length ? d.v.slice(-20).reverse().map((x, i) => { const m = srcMeta(x.source); return (
                  <tr key={i} className="border-t border-slate-100"><td className="py-1.5 whitespace-nowrap">{new Date(x.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{PAGE_NAME[x.path] || x.path}</td><td><i className={m[2] + ' mr-1'} style={{ color: m[1] }} />{m[0]}</td><td>{x.device || '-'}</td></tr>); })
                  : <tr><td colSpan="4" className="py-3 text-slate-400">Belum ada.</td></tr>}
              </tbody></table></div>
        </>
      )}
    </>
  );
}
