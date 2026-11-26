// Panel admin PT. Candi Oxygen (/admin). Login memakai akun Laravel (php artisan admin:create email).
import { useCallback, useEffect, useState } from 'react';
import './admin.css';
import { adminApi, api, getToken, setToken } from '../lib/api.js';
import { AdminToastProvider } from './common.jsx';
import Dashboard from './Dashboard.jsx';
import Editor from './Editor.jsx';
import ImageGallery from './ImageGallery.jsx';
import QuoteSettings from './QuoteSettings.jsx';
import Jobs from './Jobs.jsx';
import PortfolioAdmin from './PortfolioAdmin.jsx';
import Activity from './Activity.jsx';
import Inbox from './Inbox.jsx';
import Links from './Links.jsx';
import Help from './Help.jsx';

const TABS = [
  ['dashboard', 'fa-chart-line', 'Statistik', Dashboard], ['editor', 'fa-pen-to-square', 'Edit Website', Editor],
  ['gallery', 'fa-images', 'Galeri Gambar', ImageGallery], ['quote', 'fa-boxes-stacked', 'Form Penawaran', QuoteSettings],
  ['portfolio', 'fa-layer-group', 'Portofolio', PortfolioAdmin], ['activity', 'fa-camera-retro', 'Galeri Kegiatan', Activity],
  ['jobs', 'fa-briefcase', 'Lowongan Karir', Jobs], ['inbox', 'fa-inbox', 'Pesan Masuk', Inbox],
  ['links', 'fa-link', 'Link Pelacak', Links], ['help', 'fa-circle-question', 'Bantuan', Help],
];

function Login({ onIn }) {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    setErr(''); setBusy(true);
    try {
      const r = await api('/admin/login', { method: 'POST', body: { email: f.email.value.trim(), password: f.password.value } });
      setToken(r.token); onIn(r.user);
    } catch (x) {
      setErr(x.status === 422 ? 'Email atau kata sandi salah.' : x.status === 429 ? 'Terlalu banyak percobaan. Tunggu sebentar.' : 'Tidak bisa terhubung ke server (' + x.message + ').');
    } finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-sky-700 text-white flex items-center justify-center text-xl mb-3"><i className="fa-solid fa-lock" /></div>
          <h1 className="text-xl font-bold text-slate-900">Admin PT. Candi Oxygen</h1>
          <p className="text-xs text-slate-500 mt-1">Masuk untuk mengelola website</p>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div><label className="lbl">Email</label><input name="email" type="email" required className="inp" autoComplete="username" /></div>
          <div><label className="lbl">Kata sandi</label><input name="password" type="password" required className="inp" autoComplete="current-password" /></div>
          {err && <p className="text-xs font-semibold text-red-600">{err}</p>}
          <button className="btn btn-primary w-full justify-center" type="submit" disabled={busy}>Masuk</button>
        </form>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(!!getToken());
  const [tab, setTab] = useState(() => (window.location.hash || '').slice(1) || 'dashboard');
  const [opened, setOpened] = useState({});
  const [badge, setBadge] = useState(0);

  useEffect(() => {
    document.title = 'Admin PT. Candi Oxygen';
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, nofollow'; document.head.appendChild(m);
    if (getToken()) adminApi('/me').then(setUser, () => setToken('')).finally(() => setChecking(false));
    return () => m.remove();
  }, []);
  useEffect(() => { if (user) { try { localStorage.setItem('candiNoTrack', '1'); } catch { /* ignore */ } } }, [user]);
  useEffect(() => { setOpened((o) => ({ ...o, [tab]: true })); window.history.replaceState(null, '', '#' + tab); }, [tab]);

  const refreshBadge = useCallback(() => {
    adminApi('/inbox/unread').then((r) => setBadge(Object.values(r || {}).reduce((a, b) => a + b, 0)), () => {});
  }, []);
  useEffect(() => { if (user) refreshBadge(); }, [user, refreshBadge]);

  const logout = () => { adminApi('/logout', { method: 'POST' }).catch(() => {}).finally(() => { setToken(''); setUser(null); }); };

  return (
    <div className="admin-root text-slate-800">
      <AdminToastProvider>
        {checking ? null : !user ? <Login onIn={setUser} /> : (
          <div className="min-h-screen lg:flex">
            <aside className="bg-slate-900 lg:w-60 lg:min-h-screen p-4 lg:fixed lg:inset-y-0 flex lg:block flex-wrap gap-1 items-center z-40">
              <div className="hidden lg:block px-2 pb-4 mb-3 border-b border-white/10">
                <div className="text-white font-bold">PT. Candi Oxygen</div>
                <div className="text-[11px] text-slate-400">Panel Admin</div>
              </div>
              <nav className="flex lg:block gap-1 flex-wrap flex-1 lg:space-y-1">
                {TABS.map(([k, icon, label]) => (
                  <button key={k} type="button" className={'tab-btn' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>
                    <i className={'fa-solid ' + icon + ' w-4'} /><span>{label}</span>
                    {k === 'inbox' && badge > 0 && <b className="ml-auto text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5">{badge}</b>}
                  </button>
                ))}
              </nav>
              <div className="lg:absolute lg:bottom-4 lg:left-4 lg:right-4">
                <div className="hidden lg:block text-[11px] text-slate-400 truncate mb-2">{user.email}</div>
                <button type="button" className="tab-btn !text-slate-300" onClick={logout}><i className="fa-solid fa-right-from-bracket w-4" /><span>Keluar</span></button>
              </div>
            </aside>
            <main className="flex-1 lg:ml-60 p-4 sm:p-6 min-w-0">
              {TABS.map(([k, , , Comp]) => (opened[k] ? (
                <section key={k} style={{ display: tab === k ? '' : 'none' }}>
                  <Comp active={tab === k} onBadge={setBadge} refreshBadge={refreshBadge} />
                </section>
              ) : null))}
            </main>
          </div>
        )}
      </AdminToastProvider>
    </div>
  );
}
