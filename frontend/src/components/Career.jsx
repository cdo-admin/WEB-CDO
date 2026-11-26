// Karir: daftar lowongan dari admin (GET /api/jobs), tombol "Lamar", dan pengiriman formulir lamaran.
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useCms } from '../cms/CmsProvider.jsx';
import { useToast } from './Toast.jsx';
import { validatePhones } from './PhoneInput.jsx';

const JOB_KEY = 'candiJobsCache2';
const JOB_COL = { sky: ['#e0f2fe', '#0369a1'], emerald: ['#d1fae5', '#047857'], purple: ['#f3e8ff', '#7e22ce'], amber: ['#fef3c7', '#b45309'], rose: ['#ffe4e6', '#be123c'], slate: ['#e2e8f0', '#334155'] };

export const ApplyCtx = createContext(() => {});

export function ApplyButton({ role, children, ...rest }) {
  const open = useContext(ApplyCtx);
  return <button type="button" {...rest} onClick={() => open(role || 'Posisi Spesialis')}>{children}</button>;
}

/** { managed, jobs } — managed=false berarti kartu bawaan di halaman yang dipakai. */
export function useJobs() {
  const { edit } = useCms();
  const [st, setSt] = useState(() => { if (edit) return null; try { return JSON.parse(localStorage.getItem(JOB_KEY) || 'null'); } catch { return null; } });
  useEffect(() => {
    if (edit) return;
    api('/jobs').then((r) => { setSt(r); try { localStorage.setItem(JOB_KEY, JSON.stringify(r)); } catch { /* ignore */ } }).catch(() => {});
  }, [edit]);
  return st && st.managed ? st : { managed: false, jobs: [] };
}

export function JobCard({ j }) {
  const { t, lang } = useI18n();
  const pick = (k) => { const en = j.en || {}; return lang === 'en' && en[k] && String(en[k]).trim() ? String(en[k]).trim() : (j[k] || ''); };
  const c = JOB_COL[j.color] || JOB_COL.sky;
  return (
    <div className="p-8 bg-slate-50 rounded-sm border border-slate-200 shadow-luxury-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-sky-500 transition-colors">
      <div className="space-y-3 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          {j.category && <span className="px-2.5 py-0.5 rounded font-mono text-[11px] font-bold" style={{ background: c[0], color: c[1] }}>{pick('category')}</span>}
          {j.location && <span className="text-xs text-slate-500"><i className="fa-solid fa-location-dot mr-1 text-sky-600" /> {pick('location')}</span>}
        </div>
        <h3 className="font-luxury-serif text-xl sm:text-2xl font-bold text-navy-900">{pick('title')}</h3>
        {j.description && <p className="text-slate-600 text-xs leading-relaxed">{pick('description')}</p>}
        {(j.detail1 || j.detail2) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono pt-1">
            {j.detail1 && <span>{pick('detail1')}</span>}{j.detail1 && j.detail2 && <span>&bull;</span>}{j.detail2 && <span>{pick('detail2')}</span>}
          </div>
        )}
      </div>
      <ApplyButton role={j.apply_role || j.title} className="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full shrink-0">{t('Lamar Posisi Ini')}</ApplyButton>
    </div>
  );
}

/** Kirim formulir lamaran -> POST /api/career-applications. */
export function useCareerSubmit(onDone) {
  const toast = useToast();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!validatePhones(f)) return;
    const v = (id) => (f.querySelector('#' + id)?.value || '').trim();
    setBusy(true);
    try {
      await api('/career-applications', { method: 'POST', body: {
        full_name: v('careerName'), email: v('careerEmail'), phone: v('careerPhone'), position: v('careerPosition'),
        linkedin_url: v('careerLinkedin') || null, portfolio_url: v('careerPortfolio') || null, cover_letter: v('careerLetter'),
      } });
      toast('Aplikasi Diterima', 'Tim Talent Acquisition PT. Candi Oxygen akan meninjau kualifikasi Anda dengan standar kerahasiaan tinggi.', 'success');
      f.reset();
      onDone();
    } catch {
      toast('Gagal Mengirim', 'Mohon periksa kembali isian Anda.', 'error');
    } finally { setBusy(false); }
  };
  return { submit, busy, label: busy ? t('Memproses Berkas...') : null };
}
