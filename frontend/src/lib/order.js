// Template pesan pesanan (Purchase Order) untuk WhatsApp / Gmail (dulu bagian cart.js).
export const WA_FALLBACK = '628113739800';
export const MAIL_FALLBACK = 'cdosidoarjo@gmail.com';

export function makeRef() {
  const d = new Date(), p = (n) => (n < 10 ? '0' : '') + n, r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return 'PO-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
}

export function waText(d) {
  const L = [];
  L.push('Halo PT. Candi Oxygen, saya ingin mengajukan pesanan (Purchase Order).', '');
  L.push('*No. Referensi:* ' + d.ref, '');
  L.push('*DATA PEMESAN*');
  L.push('Nama / PIC: ' + (d.name || '-'));
  L.push('Perusahaan: ' + (d.company || '-'));
  L.push('Bidang: ' + (d.clientType || '-'));
  L.push('Email: ' + (d.email || '-'));
  L.push('WhatsApp / Telp: ' + (d.phone || '-'), '');
  L.push('*RINCIAN PESANAN (' + d.items.length + ' item)*');
  d.items.forEach((it, i) => {
    L.push((i + 1) + '. ' + it.name);
    L.push('    Spesifikasi: ' + it.spec);
    L.push('    Jumlah: ' + it.qty);
    if (it.notes && it.notes !== 'Preset Langsung') L.push('    Catatan: ' + it.notes);
  });
  L.push('', '*PENGIRIMAN*');
  L.push('PIC Lapangan: ' + (d.pic || '-') + (d.picPhone ? ' (' + d.picPhone + ')' : ''));
  L.push('Alamat: ' + (d.address || '-'));
  L.push('Kab / Kota: ' + (d.city || '-'));
  if (d.schedule) L.push('Frekuensi / Jadwal: ' + d.schedule);
  if (d.notes) L.push('Catatan: ' + d.notes);
  L.push('', 'Mohon konfirmasi ketersediaan dan penawaran harganya. Terima kasih.');
  return L.join('\n');
}

export const waLink = (d, number) => 'https://wa.me/' + (number || WA_FALLBACK) + '?text=' + encodeURIComponent(waText(d));

/** Buka jendela tulis Gmail (penerima, subjek, isi sudah terisi). */
export function gmailLink(d, to) {
  const body = waText(d).replace(/\*/g, '')
    .replace('Halo PT. Candi Oxygen, saya ingin mengajukan pesanan (Purchase Order).', 'Yth. PT. Candi Oxygen,\nBerikut pengajuan pesanan (Purchase Order) dari kami:') +
    '\n\nHormat kami,\n' + (d.name || '') + (d.company ? '\n' + d.company : '');
  const subject = 'Pesanan (PO) ' + d.ref + (d.company ? ' - ' + d.company : '');
  return gmailCompose(to || MAIL_FALLBACK, subject, body);
}

export const gmailCompose = (to, subject, body) => 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
  '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(String(body).replace(/\n/g, '\r\n'));

/** Buka jendela kosong saat klik (agar tidak diblokir), lalu arahkan setelah data siap. */
export const preOpen = () => { try { return window.open('', '_blank'); } catch { return null; } };
export const openIn = (win, url) => { if (win && !win.closed) win.location.href = url; else window.location.href = url; };
