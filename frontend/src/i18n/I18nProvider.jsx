/*
 * Mesin dua bahasa (ID <-> EN). Halaman ditulis dalam bahasa Indonesia; mode English mencari
 * terjemahan teks Indonesia di kamus (dictionary.js), sama seperti assets/js/i18n.js versi lama.
 * Pilihan bahasa disimpan di localStorage.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import DICT from './dictionary.js';

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const LOWER = {};
Object.keys(DICT).forEach((k) => { LOWER[k.toLowerCase()] = k; });
const strip = (s) => String(s).replace(/<[^>]+>/g, '');

const STORE_KEY = 'candiLang';
const LEGACY_KEYS = ['candi_lang', 'candiOxygenLang', 'lang', 'language', 'preferredLanguage', 'site_lang'];
function saved() {
  try {
    let v = localStorage.getItem(STORE_KEY);
    for (let i = 0; !v && i < LEGACY_KEYS.length; i++) v = localStorage.getItem(LEGACY_KEYS[i]);
    return v === 'en' ? 'en' : 'id';
  } catch { return 'id'; }
}

/** Buat fungsi pencari terjemahan. `extra` = terjemahan tambahan dari admin (CMS, lowongan, portofolio). */
export function makeLookup(extra) {
  const base = (x) => {
    if (has(extra, x)) return extra[x];
    if (has(DICT, x)) return DICT[x];
    return null;
  };
  const tr = (x) => { const v = base(x); return v === null ? x : strip(v); };
  const RULES = [
    [/^1 Item Terdaftar$/i, '1 Item Added'],
    [/^(\d+) Item Terdaftar$/i, '$1 Items Added'],
    [/^1 Item$/i, '1 Item'],
    [/^(\d+) Item$/i, '$1 Items'],
    [/^(\d+) Tabung$/i, '$1 Cylinders'],
    [/^(.+) \((.+)\) berhasil masuk ke daftar pesanan\.$/, (m, a, b) => tr(a) + ' (' + tr(b) + ') was added to your order list.'],
    [/^(.+) ditambahkan ke tabel pesanan\.$/, (m, a) => tr(a) + ' added to the order table.'],
  ];
  return function lookup(n) {
    const v = base(n);
    if (v !== null) return v;
    for (const [re, rep] of RULES) if (re.test(n)) return n.replace(re, rep);
    const key = LOWER[n.toLowerCase()];
    if (key !== undefined) {
      const en = DICT[key];
      return n === n.toUpperCase() && /[A-Za-z]/.test(n) && en.indexOf('<') === -1 ? en.toUpperCase() : en;
    }
    return null;
  };
}

const I18nCtx = createContext(null);

export function I18nProvider({ children, forceLang }) {
  const [lang, setLangState] = useState(() => forceLang || saved());
  const [extra, setExtra] = useState({});
  const lookup = useMemo(() => makeLookup(extra), [extra]);
  const effective = forceLang || lang;

  const setLanguage = useCallback((l) => {
    const v = l === 'en' ? 'en' : 'id';
    setLangState(v);
    try { localStorage.setItem(STORE_KEY, v); } catch { /* ignore */ }
  }, []);

  /** Terjemahkan teks biasa (tanpa HTML). Bahasa Indonesia: teks apa adanya. */
  const t = useCallback((s) => {
    if (s == null) return s;
    if (effective !== 'en') return s;
    const v = lookup(norm(s));
    return v === null ? s : strip(v);
  }, [effective, lookup]);

  /** Seperti t(), tetapi mengembalikan HTML bila terjemahan berisi tag (<em> dsb), atau null. */
  const tHtml = useCallback((s) => (effective === 'en' ? lookup(norm(s)) : null), [effective, lookup]);

  const registerExtra = useCallback((map) => {
    setExtra((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [k, v] of Object.entries(map)) {
        const nk = norm(k), nv = v == null ? '' : String(v).trim();
        if (nk && nv && next[nk] !== nv) { next[nk] = nv; changed = true; }
      }
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => { document.documentElement.setAttribute('lang', effective); }, [effective]);

  const value = useMemo(() => ({ lang: effective, setLanguage, t, tHtml, lookup, registerExtra }), [effective, setLanguage, t, tHtml, lookup, registerExtra]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
export const useT = () => useContext(I18nCtx).t;
export const useLang = () => useContext(I18nCtx).lang;
export { norm };
