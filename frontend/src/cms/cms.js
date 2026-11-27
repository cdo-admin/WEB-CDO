// Data CMS bersama: mode edit, pengurai baris isi website, context & hook (dipakai CmsProvider.jsx).
import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { pageFileOf } from '../lib/pages.js';

const Q = new URLSearchParams(window.location.search);
const IN_FRAME = window.parent !== window;
export const EDIT_MODE = Q.get('cms_edit') === '1' && IN_FRAME;

function emptyModel() { return { text: {}, img: {}, href: {}, hide: {}, clones: [], config: {}, scoped: {} }; }
export function parseRows(rows) {
  const m = emptyModel();
  (rows || []).forEach((r) => {
    const s = r.scope || '';
    if (r.kind === 'clone') { m.clones.push(r); return; }
    if (r.kind === 'config') { try { m.config[r.key] = JSON.parse(r.value_id); } catch { /* ignore */ } return; }
    if (r.kind === 'hide') { m.hide[r.key] = true; return; }
    if (r.kind !== 'text' && r.kind !== 'img' && r.kind !== 'href') return;
    let tgt = m;
    if (s) { m.scoped[s] = m.scoped[s] || { text: {}, img: {}, href: {} }; tgt = m.scoped[s]; }
    tgt[r.kind][r.key] = { id: r.value_id, en: r.value_en };
  });
  m.clones.sort((a, b) => (a.position || 0) - (b.position || 0));
  return m;
}

export const CmsCtx = createContext(null);
const ScopeCtx = createContext('');
export const ScopeProvider = ScopeCtx.Provider;
export const useScope = () => useContext(ScopeCtx);
export const useCms = () => useContext(CmsCtx);
export function usePageFile() { return pageFileOf(useLocation().pathname); }
