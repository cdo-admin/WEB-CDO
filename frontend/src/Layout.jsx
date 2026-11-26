// Kerangka semua halaman publik: header, isi halaman, footer, keranjang, judul tab, scroll & statistik.
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { usePageFile } from './cms/CmsProvider.jsx';
import { useI18n } from './i18n/I18nProvider.jsx';
import { trackPageView } from './lib/tracker.js';
import { usePageEffects } from './hooks/usePageEffects.js';

export default function Layout({ meta, children }) {
  const { t, lang } = useI18n();
  const loc = useLocation();
  const page = usePageFile();

  useEffect(() => {
    document.title = t(meta.title);
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', t(meta.description));
  }, [meta, t]);

  // pindah halaman -> ke atas, atau ke bagian #hash (mis. /products#section-services)
  useLayoutEffect(() => {
    const id = decodeURIComponent((loc.hash || '').slice(1));
    if (!id) { window.scrollTo(0, 0); return undefined; }
    const tm = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const header = document.getElementById('main-header'), bar = document.getElementById('products-tabbar');
      const off = (header ? header.offsetHeight : 80) + (bar ? bar.offsetHeight : 0) + 8;
      window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - off), behavior: 'auto' });
    }, 150);
    return () => clearTimeout(tm);
  }, [loc.pathname, loc.hash]);

  useEffect(() => { trackPageView(page, lang); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps
  usePageEffects([page]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
