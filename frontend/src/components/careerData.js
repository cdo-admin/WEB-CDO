// Data & hook Karir: context tombol Lamar, daftar lowongan, kirim lamaran.
import { createContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../i18n/i18n.js';
import { useCms } from '../cms/cms.js';
import { useToast } from './toastContext.js';
import { validatePhones } from './phone.js';

const JOB_KEY = 'candiJobsCache2';

export const ApplyCtx = createContext(() => {});

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
