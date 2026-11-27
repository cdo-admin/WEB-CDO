// Data negara, pengurai & validasi nomor telepon (dipakai PhoneInput.jsx dan formulir).
const RAW =
  'ID:62:8-12 MY:60:9-10 SG:65:8 TH:66:9 VN:84:9-10 PH:63:10 BN:673:7 KH:855:8-9 LA:856:8-10 MM:95:8-10 TL:670:7-8 ' +
  'AU:61:9 NZ:64:8-10 PG:675:7-8 FJ:679:7 CN:86:11 HK:852:8 MO:853:8 TW:886:9 JP:81:9-10 KR:82:9-10 MN:976:8 ' +
  'IN:91:10 PK:92:10 BD:880:10 LK:94:9 NP:977:10 MV:960:7 BT:975:7-8 AF:93:9 ' +
  'US:1:10 CA:1:10 DO:1:10 JM:1:10 PR:1:10 TT:1:10 BS:1:10 BB:1:10 ' +
  'GB:44:10 IE:353:8-9 FR:33:9 DE:49:10-11 NL:31:9 BE:32:8-9 LU:352:8-9 CH:41:9 AT:43:10-13 IT:39:9-11 ES:34:9 PT:351:9 GR:30:10 ' +
  'SE:46:7-9 NO:47:8 DK:45:8 FI:358:9-10 IS:354:7 PL:48:9 CZ:420:9 SK:421:9 HU:36:8-9 RO:40:9 BG:359:8-9 HR:385:8-9 SI:386:8 RS:381:8-9 ' +
  'UA:380:9 RU:7:10 KZ:7:10 TR:90:10 CY:357:8 MT:356:8 EE:372:7-8 LV:371:8 LT:370:8 BY:375:9 AL:355:8-9 BA:387:8 MK:389:8 ME:382:8 MD:373:8 ' +
  'SA:966:9 AE:971:8-9 QA:974:8 KW:965:8 BH:973:8 OM:968:8 JO:962:8-9 LB:961:7-8 IL:972:8-9 IQ:964:10 IR:98:10 YE:967:7-9 SY:963:8-9 PS:970:8-9 EG:20:9-10 ' +
  'ZA:27:9 NG:234:8-10 KE:254:9 GH:233:9 ET:251:9 TZ:255:9 UG:256:9 MA:212:9 DZ:213:8-9 TN:216:8 SN:221:9 CI:225:8-10 CM:237:8-9 AO:244:9 MZ:258:8-9 ' +
  'ZW:263:9 ZM:260:9 MG:261:9 SD:249:9 LY:218:9 NA:264:7-9 BW:267:7-8 MU:230:7-8 RW:250:9 SO:252:7-9 ' +
  'MX:52:10 BR:55:10-11 AR:54:10 CL:56:9 CO:57:10 PE:51:9 VE:58:10 EC:593:8-9 UY:598:8 PY:595:9 BO:591:8 CR:506:8 PA:507:7-8 GT:502:8 SV:503:8 HN:504:8 NI:505:8 CU:53:8 HT:509:8 ' +
  'UZ:998:9 AZ:994:9 GE:995:9 AM:374:8 KG:996:9 TJ:992:9 TM:993:8';
export const PRIORITY = ['ID', 'MY', 'SG', 'TH', 'VN', 'PH', 'AU', 'JP', 'KR', 'CN', 'HK', 'TW', 'IN', 'SA', 'AE', 'US', 'GB', 'DE', 'NL'];
export const C = {};
const BYDIAL = {};
RAW.split(/\s+/).forEach((tk) => {
  const p = tk.split(':'), r = (p[2] || '6-14').split('-');
  C[p[0]] = { iso: p[0], dial: p[1], min: +r[0], max: +(r[1] || r[0]) };
  (BYDIAL[p[1]] = BYDIAL[p[1]] || []).push(p[0]);
});
BYDIAL['1'] = ['US', 'CA', 'DO', 'JM', 'PR', 'TT', 'BS', 'BB'];
BYDIAL['7'] = ['RU', 'KZ'];

const dn = {};
export function cname(iso, l) { try { dn[l] = dn[l] || new Intl.DisplayNames([l], { type: 'region' }); return dn[l].of(iso) || iso; } catch { return iso; } }

function okNsn(c, n) {
  if (!n || n.length < c.min || n.length > c.max) return false;
  if (/^(\d)\1+$/.test(n)) return false;
  if (c.iso === 'ID') return /^8\d{8,11}$/.test(n) || /^[1-79]\d{7,10}$/.test(n);
  if (c.iso === 'SG') return /^[3689]\d{7}$/.test(n);
  if (c.dial === '1') return /^[2-9]\d{9}$/.test(n);
  return n.charAt(0) !== '0';
}
function group(n, c) {
  if (n.length === 8) return n.slice(0, 4) + ' ' + n.slice(4);
  if (c && c.iso === 'ID') return n.slice(0, 3) + ' ' + n.slice(3, 7) + (n.length > 7 ? ' ' + n.slice(7) : '');
  return n.slice(0, 3) + ' ' + n.slice(3, 6) + (n.length > 6 ? ' ' + n.slice(6) : '');
}
export function parsePhone(raw, isoSel) {
  const s = String(raw || '').trim(), cur = C[isoSel] || C.ID;
  let digits = s.replace(/\D/g, '');
  const fin = (c, n) => { n = n.replace(/^0(?=\d)/, ''); if (!okNsn(c, n)) return { ok: false, c }; return { ok: true, c, nsn: n, text: '+' + c.dial + ' ' + group(n, c) }; };
  if (!digits) return { empty: true };
  if (/^\+/.test(s) || /^00/.test(s)) {
    if (/^00/.test(s) && !/^\+/.test(s)) digits = digits.replace(/^00/, '');
    for (let i = 4; i >= 1; i--) {
      const pre = digits.slice(0, i);
      if (BYDIAL[pre]) return fin(C[BYDIAL[pre].indexOf(cur.iso) >= 0 ? cur.iso : BYDIAL[pre][0]], digits.slice(i));
    }
    return { ok: false, c: cur };
  }
  if (digits.charAt(0) !== '0' && digits.indexOf(cur.dial) === 0 && okNsn(cur, digits.slice(cur.dial.length))) return fin(cur, digits.slice(cur.dial.length));
  const nat = digits.replace(/^0/, '');
  if (okNsn(cur, nat)) return fin(cur, nat);
  return { ok: false, c: cur };
}

export const TXT = {
  id: { only: 'Hanya angka yang bisa diisi di kolom nomor telepon.', bad: (n, iso) => 'Nomor telepon tidak valid untuk ' + n + '.' + (iso === 'ID' ? ' Contoh: 0812 3456 7890' : ' Periksa kembali jumlah digitnya.'), ph: (iso) => (iso === 'ID' ? '0812 3456 7890' : 'Nomor telepon') },
  en: { only: 'Only digits are allowed in the phone number field.', bad: (n, iso) => 'This phone number is not valid for ' + n + '.' + (iso === 'ID' ? ' Example: 0812 3456 7890' : ' Please check the number of digits.'), ph: (iso) => (iso === 'ID' ? '0812 3456 7890' : 'Phone number') },
};

export const registry = new Set();
/** Periksa semua PhoneInput di dalam formulir; nomor valid dirapikan ke format internasional. */
export function validatePhones(form) {
  let bad = null;
  registry.forEach((w) => { if (w.input() && form.contains(w.input()) && !w.check(true) && !bad) bad = w.input(); });
  if (bad) { bad.focus(); try { bad.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch { /* ignore */ } return false; }
  return true;
}

