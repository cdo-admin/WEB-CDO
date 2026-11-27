/*
 * Komponen yang bisa diedit dari admin:
 *   <T>teks asli</T>        teks (ID/EN, bisa diubah admin)
 *   <TH k="...">...</TH>    blok yang terjemahan English-nya berisi HTML sederhana
 *   <CImg src="..."/>       gambar (bisa diganti admin)
 *   <CLink href="...">      link / tombol (tujuan bisa diubah admin; halaman internal memakai React Router)
 *   <Card sig="...">        kartu yang bisa disembunyikan / diduplikasi dari admin
 * Kunci data = teks / alamat asli, sama seperti website versi HTML, sehingga data lama tetap cocok.
 */
import { Children, cloneElement, isValidElement } from 'react';
import { Link } from 'react-router-dom';
import { useCms, useScope, ScopeProvider, usePageFile } from './cms.js';
import { useI18n, norm } from '../i18n/i18n.js';
import { assetUrl, internalRoute } from '../lib/pages.js';
import { useCmsText } from './useCmsText.js';

const textOf = (children) => Children.toArray(children).map((c) => (typeof c === 'string' || typeof c === 'number' ? c : '')).join('');

export function T({ children }) {
  const { edit } = useCms();
  const text = useCmsText();
  const key = norm(textOf(children));
  const out = text(key);
  if (edit) return <span data-cms-t={key}>{out}</span>;
  return out;
}

export function TH({ k, children }) {
  const { edit } = useCms();
  const { lang, lookup } = useI18n();
  if (lang === 'en' && !edit) {
    const html = lookup(norm(k));
    if (html) return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return children;
}

export function CImg({ src, removeOnError, ...rest }) {
  const { pick } = useCms();
  const scope = useScope();
  const ov = pick('img', scope, src);
  const useOv = ov && ov.id && !/^\s*javascript:/i.test(ov.id);
  const props = { ...rest };
  if (useOv) delete props.srcSet;
  if (removeOnError) props.onError = (e) => { e.currentTarget.style.display = 'none'; };
  return <img {...props} src={assetUrl(useOv ? ov.id : src)} data-cms-orig-src={src} />;
}

export function CLink({ href, children, ...rest }) {
  const { pick } = useCms();
  const scope = useScope();
  const ov = pick('href', scope, href);
  const target = ov && ov.id && !/^\s*javascript:/i.test(ov.id) ? ov.id : href;
  const route = internalRoute(target);
  if (route) return <Link to={route} {...rest} data-cms-orig-href={href}>{children}</Link>;
  if (/^#./.test(target)) {
    const onClick = (e) => {
      rest.onClick?.(e);
      const el = document.getElementById(target.slice(1));
      if (el && !e.defaultPrevented) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    };
    return <a href={target} {...rest} onClick={onClick} data-cms-orig-href={href}>{children}</a>;
  }
  return <a href={target} {...rest} data-cms-orig-href={href}>{children}</a>;
}

export function Card({ sig, children }) {
  const { model, edit } = useCms();
  const scope = useScope();
  const page = usePageFile();
  const child = Children.only(children);
  if (!isValidElement(child)) return children;
  const full = sig.startsWith('*|') ? page + sig.slice(1) : sig;
  const hidden = !scope && model.hide[full];
  const extra = { 'data-cms-sig': full };
  if (hidden) {
    if (edit) extra['data-cms-hidden'] = '1';
    else extra.style = { ...(child.props.style || {}), display: 'none' };
  }
  const main = cloneElement(child, extra);
  if (scope) return main; // kartu di dalam salinan tidak ikut disalin lagi
  const clones = model.clones.filter((r) => r.key === full);
  if (!clones.length) return main;
  return (
    <>
      {main}
      {clones.map((r) => (
        <ScopeProvider key={r.scope} value={r.scope}>
          {cloneElement(child, { 'data-cms-sig': full, 'data-cms-clone': r.scope, id: undefined })}
        </ScopeProvider>
      ))}
    </>
  );
}
