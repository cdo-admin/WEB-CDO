// Kirim formulir Ajukan Penawaran: arsip ke database (POST /api/quote-requests), lalu buka WhatsApp / Gmail
// berisi template Purchase Order. Bila database gangguan, WhatsApp tetap dibuka.
import { useState } from 'react';
import { api } from '../lib/api.js';
import { useCart, useContactTargets } from './cartContext.js';
import { useToast } from './toastContext.js';
import { validatePhones } from './phone.js';
import { builderReset } from './orderBuilderReset.js';
import { makeRef, waLink, gmailLink, preOpen, openIn } from '../lib/order.js';

export function useQuoteSubmit() {
  const { items, clear } = useCart();
  const toast = useToast();
  const { waNumber, email } = useContactTargets();
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!items.length) {
      toast('Pesanan Masih Kosong', 'Tambahkan minimal satu produk atau layanan ke tabel pesanan sebelum mengirim permohonan.', 'error');
      document.getElementById('order-item-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!validatePhones(f)) return;
    const viaEmail = !!(e.nativeEvent && e.nativeEvent.submitter && e.nativeEvent.submitter.id === 'quoteEmailBtn');
    const win = preOpen(); // dibuka sekarang (masih dalam klik) agar tidak diblokir popup-blocker
    setBusy(true);
    const v = (id) => (f.querySelector('#' + id)?.value || '').trim();
    const ref = makeRef();
    const rows = items.map((it, i) => `${i + 1}. [${it.categoryLabel}] ${it.name} | Spek: ${it.spec} | Jml: ${it.qty} | Catatan: ${it.notes || '-'}`).join('\n');
    const order = {
      ref, name: v('quoteName'), company: v('quoteCompany'), clientType: v('quoteClientType'), email: v('quoteEmail'), phone: v('quotePhone'),
      items: items.map((x) => ({ ...x })), pic: v('shippingPIC'), picPhone: v('shippingPhone'), address: v('shippingAddress'),
      city: v('quoteLocation'), schedule: v('quoteVolume'), notes: v('quoteNotes'),
    };
    try {
      try {
        await api('/quote-requests', { method: 'POST', body: {
          full_name: order.name, email: order.email, phone: order.phone, company: order.company || null,
          client_type: order.clientType || 'Industri Bisnis', category: 'Industrial & Medical Gases',
          selected_items: items.map((it) => `${it.name} (${it.spec})`),
          estimated_volume: `=== DAFTAR PESANAN (${items.length} ITEM) ===\n${rows}\n\nKeterangan Tambahan: ${order.schedule || 'Sesuai rincian tabel'}`,
          delivery_location: order.address ? `${order.address} — ${order.city}` : order.city,
          notes: [`No. Referensi: ${ref}`, `PIC Lapangan: ${order.pic || '-'} (${order.picPhone || '-'})`, `Catatan Pengiriman: ${order.notes || '-'}`].join('\n'),
        } });
      } catch (err) { console.warn('Arsip pesanan gagal disimpan:', err); }
      openIn(win, viaEmail ? gmailLink(order, email) : waLink(order, waNumber));
      toast('Pesanan Siap Dikirim', (viaEmail ? 'Gmail terbuka dengan pesanan Anda. Periksa kembali lalu tekan Kirim. No. Referensi: ' : 'WhatsApp terbuka dengan template pesanan Anda. Tinggal tekan Kirim. No. Referensi: ') + ref, 'success');
      f.reset(); builderReset.current(); clear();
    } catch {
      if (win && !win.closed) { try { win.close(); } catch { /* ignore */ } }
      toast('Kendala Pengiriman', 'Silakan periksa kembali isian formulir Anda.', 'error');
    } finally { setBusy(false); }
  };
  return { submit, busy };
}
