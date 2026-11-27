/*
 * Mesin dua bahasa (ID <-> EN). Halaman ditulis dalam bahasa Indonesia; mode English mencari
 * terjemahan teks Indonesia di kamus (dictionary.js), sama seperti assets/js/i18n.js versi lama.
 * Pilihan bahasa disimpan di localStorage.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nCtx, makeLookup, norm, strip } from './i18n.js';


const STORE_KEY = 'candiLang';
const LEGACY_KEYS = ['candi_lang', 'candiOxygenLang', 'lang', 'language', 'preferredLanguage', 'site_lang'];
function saved() {
  try {
    let v = localStorage.getItem(STORE_KEY);
    for (let i = 0; !v && i < LEGACY_KEYS.length; i++) v = localStorage.getItem(LEGACY_KEYS[i]);
    return v === 'en' ? 'en' : 'id';
  } catch { return 'id'; }
}

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
