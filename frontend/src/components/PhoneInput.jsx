/* Input nomor telepon dengan pilihan negara + validasi format (pengganti assets/js/phone.js).
   - Hanya angka (spasi, -, (, ), titik, dan + di awal) yang bisa diketik.
   - Pilih negara (default Indonesia +62). Mengetik +65... otomatis memilih Singapura, dst.
   - 0812... otomatis menjadi +62 812... ; nomor yang tersimpan berformat internasional.
   Yang diperiksa adalah FORMAT & PANJANG nomor, bukan apakah nomornya aktif.
   Pemakaian: <PhoneInput id="phone" name="phone" className="..." required />
   Saat submit formulir panggil validatePhones(formElement) -> false bila ada nomor salah. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '../i18n/i18n.js';
import { C, PRIORITY, TXT, cname, parsePhone, registry } from './phone.js';

export default function PhoneInput({ className, style, ...rest }) {
  const lang = useLang();
  const [iso, setIso] = useState('ID');
  const [err, setErr] = useState('');
  const [long, setLong] = useState(false);
  const ref = useRef(null), timer = useRef(0), isoRef = useRef(iso);
  useLayoutEffect(() => { isoRef.current = iso; }, [iso]);

  const options = useMemo(() => {
    const isos = Object.keys(C).sort((a, b) => cname(a, lang).localeCompare(cname(b, lang), lang));
    const top = PRIORITY.filter((i) => C[i]);
    return { top, rest: isos.filter((i) => top.indexOf(i) < 0) };
  }, [lang]);

  const check = (normalize) => {
    const inp = ref.current; if (!inp) return true;
    const p = parsePhone(inp.value, isoRef.current);
    clearTimeout(timer.current);
    if (p.empty) { setErr(''); return true; }
    if (!p.ok) { const c = p.c || C[isoRef.current]; setErr(TXT[lang].bad(cname(c.iso, lang), c.iso)); return false; }
    setErr(''); setIso(p.c.iso); isoRef.current = p.c.iso;
    if (normalize) inp.value = p.text;
    return true;
  };
  const checkRef = useRef(check);
  useLayoutEffect(() => { checkRef.current = check; });
  useEffect(() => {
    const w = { input: () => ref.current, check: (n) => checkRef.current(n) };
    registry.add(w);
    return () => registry.delete(w);
  }, []);

  const onInput = (e) => {
    const inp = e.target, v = inp.value, c = v.replace(/[^\d\s\-().+]/g, '').replace(/(?!^)\+/g, '');
    if (c !== v) {
      inp.value = c; setErr(TXT[lang].only);
      clearTimeout(timer.current); timer.current = setTimeout(() => setErr(''), 2200);
    } else setErr('');
    if (/^\s*(\+|00)\s*\d/.test(c)) { const pr = parsePhone(c, iso); if (pr.c && pr.c.iso !== iso) setIso(pr.c.iso); }
  };
  const label = (i) => (long ? cname(i, lang).replace(/"/g, '') + ' (+' + C[i].dial + ')' : i + ' +' + C[i].dial);

  return (
    <>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'stretch' }}>
        <select className={className} aria-label="Kode negara / Country code" value={iso}
          style={{ flex: '0 0 auto', width: '6.6rem', paddingLeft: '.5rem', paddingRight: '.25rem' }}
          onFocus={() => setLong(true)} onMouseDown={() => setLong(true)} onBlur={() => setLong(false)}
          onChange={(e) => { setIso(e.target.value); isoRef.current = e.target.value; setLong(false); if (ref.current && ref.current.value.trim()) check(false); }}>
          {options.top.map((i) => <option key={i} value={i}>{label(i)}</option>)}
          <option disabled>──────────</option>
          {options.rest.map((i) => <option key={i} value={i}>{label(i)}</option>)}
        </select>
        <input ref={ref} type="tel" inputMode="tel" autoComplete="tel" maxLength={24} {...rest} className={className}
          placeholder={TXT[lang].ph(iso)} style={{ ...style, flex: '1 1 auto', minWidth: 0, borderColor: err ? '#dc2626' : undefined }}
          onInput={onInput} onBlur={() => { if (ref.current.value.trim()) check(true); }} />
      </div>
      {err && <p className="phone-err" style={{ marginTop: '.3rem', fontSize: 11, fontWeight: 600, color: '#dc2626' }}>{err}</p>}
    </>
  );
}
