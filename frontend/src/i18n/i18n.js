// Kamus, pencari terjemahan & hook bahasa (dipakai bersama I18nProvider.jsx).
import { createContext, useContext } from 'react';
import DICT from './dictionary.js';

export const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const LOWER = {};
Object.keys(DICT).forEach((k) => { LOWER[k.toLowerCase()] = k; });
export const strip = (s) => String(s).replace(/<[^>]+>/g, '');

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

export const I18nCtx = createContext(null);
export const useI18n = () => useContext(I18nCtx);
export const useT = () => useContext(I18nCtx).t;
export const useLang = () => useContext(I18nCtx).lang;
