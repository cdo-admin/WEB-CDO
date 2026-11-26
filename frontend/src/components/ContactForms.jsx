// Formulir halaman Kontak: pesan (dibuka di Gmail) dan review bintang (POST /api/reviews).
import { useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { useToast } from './Toast.jsx';
import { validatePhones } from './PhoneInput.jsx';
import { gmailCompose, preOpen, openIn } from '../lib/order.js';
import { useContactTargets } from './Cart.jsx';

export function useContactForm() {
  const toast = useToast();
  const { email } = useContactTargets();
  return (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!validatePhones(f)) return;
    const win = preOpen();
    const v = (id) => (f.querySelector('#' + id)?.value || '').trim();
    const body = 'Pesan/Pertanyaan Pelanggan\n\n' + 'Nama: ' + v('fullName') + '\n' + 'Email: ' + v('email') + '\n' + 'WhatsApp / Telp: ' + v('phone') + '\n' +
      (v('company') ? 'Nama Usaha / Pribadi: ' + v('company') + '\n' : '') + 'Keperluan: ' + v('subject') + '\n\n' + 'Pesan:\n' + v('message') + '\n';
    openIn(win, gmailCompose(email, 'Pesan/Pertanyaan Pelanggan', body));
    toast('Pesan Siap Dikirim', 'Gmail terbuka dengan pesan Anda. Periksa kembali lalu tekan Kirim.', 'success');
    f.reset();
  };
}

export function useReviewForm() {
  const toast = useToast();
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!rating) { setErr(true); return; }
    const v = (id) => (f.querySelector('#' + id)?.value || '').trim();
    setBusy(true);
    try {
      await api('/reviews', { method: 'POST', body: { full_name: v('reviewName'), company: v('reviewCompany') || null, rating, message: v('reviewMessage') } });
      toast('Terima Kasih!', 'Review Anda sudah kami terima. Tim kami akan membacanya.', 'success');
      f.reset(); setRating(0);
    } catch {
      toast('Gagal Mengirim', 'Review belum terkirim. Silakan coba lagi nanti atau hubungi kami lewat WhatsApp.', 'error');
    } finally { setBusy(false); }
  };
  const Stars = () => [1, 2, 3, 4, 5].map((n) => (
    <button key={n} type="button" data-star={n} aria-label={t(n + ' bintang')} aria-pressed={rating === n}
      onClick={() => { setRating(n); setErr(false); }}
      className={'hover:scale-110 transition-transform ' + (n <= rating ? 'text-amber-400' : 'text-slate-300')}>
      <i className="fa-solid fa-star" />
    </button>
  ));
  return { submit, rating, err, busy, Stars, sending: t('Mengirim...') };
}
