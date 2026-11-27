/*
 * CMS ringan (pengganti assets/js/cms.js).
 *  1. Mengambil perubahan dari admin (GET /api/site-content): teks ID/EN, gambar, link,
 *     kartu yang disembunyikan / diduplikasi, serta pengaturan (form penawaran, karir, portofolio).
 *  2. Mode edit visual: halaman dibuka di iframe panel admin dengan ?cms_edit=1.
 *     Klik elemen -> data elemen dikirim ke admin lewat postMessage (protokol sama dengan versi lama).
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { CmsCtx, EDIT_MODE, parseRows, useCms, usePageFile } from './cms.js';
import { useI18n, norm } from '../i18n/i18n.js';

const CACHE_KEY = 'candiCmsCache2';

function readCache() { try { return localStorage.getItem(CACHE_KEY) || ''; } catch { return ''; } }

export function CmsProvider({ children }) {
  const { registerExtra } = useI18n();
  const [rows, setRows] = useState(() => {
    if (EDIT_MODE) return [];
    try { return JSON.parse(readCache() || '[]'); } catch { return []; }
  });
  const [ready, setReady] = useState(false);
  const model = useMemo(() => parseRows(rows), [rows]);

  const reload = useCallback(() => api('/site-content').then((r) => {
    const s = JSON.stringify(r || []);
    setRows(r || []);
    if (!EDIT_MODE) { try { localStorage.setItem(CACHE_KEY, s); } catch { /* ignore */ } }
    return r;
  }), []);

  useEffect(() => { reload().catch(() => {}).finally(() => setReady(true)); }, [reload]);

  // terjemahan English dari admin ikut terdaftar di kamus
  useEffect(() => {
    const map = {};
    const reg = (o) => Object.values(o).forEach((v) => { if (v && v.id != null && v.en) map[norm(v.id)] = v.en; });
    reg(model.text);
    Object.values(model.scoped).forEach((s) => reg(s.text));
    registerExtra(map);
  }, [model, registerExtra]);

  const pick = useCallback((map, scope, key) => {
    if (scope && model.scoped[scope] && model.scoped[scope][map][key]) return model.scoped[scope][map][key];
    return model[map][key] || null;
  }, [model]);

  const value = useMemo(() => ({ model, pick, reload, ready, edit: EDIT_MODE }), [model, pick, reload, ready]);
  return (
    <CmsCtx.Provider value={value}>
      {children}
      {EDIT_MODE && <EditBridge />}
    </CmsCtx.Provider>
  );
}

/* ------------------------------ Mode edit visual ------------------------- */
function post(msg) { try { window.parent.postMessage(msg, window.location.origin); } catch { /* ignore */ } }

function EditBridge() {
  const { model, pick, reload, ready } = useCms();
  const { lookup } = useI18n();
  const page = usePageFile();
  const st = useRef({ model, pick, lookup, page });
  useLayoutEffect(() => { st.current = { model, pick, lookup, page }; });

  useEffect(() => {
    document.documentElement.classList.add('cms-editing');
    let prev = null, sel = null;
    const current = (orig, scope) => {
      const { pick: pk, lookup: lk } = st.current;
      const ov = pk('text', scope, orig);
      const id = ov && ov.id != null ? ov.id : orig;
      const en = (ov && ov.en) ? ov.en : (lk(norm(id)) || '');
      return { orig, id, en: String(en).replace(/<[^>]+>/g, '') };
    };
    const inspect = (t) => {
      const out = { page: st.current.page, texts: [], img: null, href: null, card: null, scope: '' };
      const cl = t.closest('[data-cms-clone]');
      out.scope = cl ? cl.getAttribute('data-cms-clone') : '';
      let nodes = t.hasAttribute('data-cms-t') ? [t] : [...t.children].filter((c) => c.hasAttribute('data-cms-t'));
      if (!nodes.length) nodes = [...t.querySelectorAll('[data-cms-t]')].slice(0, 6);
      const seen = {};
      nodes.forEach((n) => { const o = n.getAttribute('data-cms-t'); if (!seen[o]) { seen[o] = 1; out.texts.push(current(o, out.scope)); } });
      const img = t.tagName === 'IMG' ? t : (!out.texts.length ? t.querySelector('img') : null);
      if (img && img.getAttribute('data-cms-orig-src') != null) {
        const o = img.getAttribute('data-cms-orig-src'), ov = st.current.pick('img', out.scope, o);
        out.img = { orig: o, cur: ov && ov.id ? ov.id : o, src: img.currentSrc || img.src };
      }
      const a = t.closest('[data-cms-orig-href]');
      if (a) { const ho = a.getAttribute('data-cms-orig-href'), hv = st.current.pick('href', out.scope, ho); out.href = { orig: ho, cur: hv && hv.id ? hv.id : ho }; }
      const card = t.closest('[data-cms-sig]');
      if (card) {
        const h = card.querySelector('h1,h2,h3,h4,h5,h6'), sec = card.closest('[data-category]');
        out.card = {
          sig: card.getAttribute('data-cms-sig'), isClone: card.hasAttribute('data-cms-clone'), scope: card.getAttribute('data-cms-clone') || '',
          hidden: card.hasAttribute('data-cms-hidden'), title: h ? norm(h.textContent) : '', section: sec ? sec.getAttribute('data-category') : '',
        };
      }
      return out;
    };
    const over = (e) => { if (prev) prev.classList.remove('cms-hover'); prev = e.target; if (prev && prev.classList) prev.classList.add('cms-hover'); };
    const out = () => { if (prev) { prev.classList.remove('cms-hover'); prev = null; } };
    const click = (e) => {
      if (e.target.closest && e.target.closest('.lang-btn')) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (sel) sel.classList.remove('cms-sel');
      sel = e.target; sel.classList.add('cms-sel');
      post({ cms: 'select', data: inspect(e.target) });
    };
    const submit = (e) => e.preventDefault();
    const msg = (e) => {
      if (e.origin !== window.location.origin || !e.data) return;
      if (e.data.cms === 'reload') {
        const y = window.scrollY;
        reload().catch(() => {}).finally(() => {
          requestAnimationFrame(() => window.scrollTo(0, y));
          if (sel) sel.classList.remove('cms-sel'); sel = null;
          post({ cms: 'reloaded' });
        });
      }
    };
    document.addEventListener('mouseover', over, true);
    document.addEventListener('mouseout', out, true);
    document.addEventListener('click', click, true);
    document.addEventListener('submit', submit, true);
    window.addEventListener('message', msg);
    return () => {
      document.removeEventListener('mouseover', over, true);
      document.removeEventListener('mouseout', out, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('submit', submit, true);
      window.removeEventListener('message', msg);
    };
  }, [reload]);

  useEffect(() => { if (ready) post({ cms: 'ready', page }); }, [ready, page]);
  return null;
}
