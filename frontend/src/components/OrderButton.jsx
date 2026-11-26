// Tombol "Pesan" (+ "Spesifikasi" bila ada datanya) pada kartu di halaman Produk & Layanan.
import { useCmsText } from '../cms/components.jsx';
import { useCms, useScope } from '../cms/CmsProvider.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import { useCart, specFor } from './Cart.jsx';
import { NAME_MAP, CAT_LABEL } from '../data/cartNames.js';

export function useProduct(title, cat, img) {
  const text = useCmsText();
  const { pick } = useCms();
  const scope = useScope();
  const idTitle = text(title, { translate: false });
  const ov = img ? pick('img', scope, img) : null;
  return {
    idTitle, title: text(title), name: NAME_MAP[idTitle] || idTitle,
    category: cat, categoryLabel: CAT_LABEL[cat], img: ov && ov.id ? ov.id : img || '',
  };
}

export default function OrderButton({ title, cat = 'gas', img, big, className, children }) {
  const t = useT();
  const cart = useCart();
  const p = useProduct(title, cat, img);
  const hasSpec = !!specFor(p.idTitle);
  const spec = hasSpec && (
    <button type="button" onClick={(e) => { e.preventDefault(); cart.openInfo(p); }}
      className={'cart-spec-btn ' + (big ? 'px-8 py-3.5 text-xs uppercase tracking-widest rounded-full border border-slate-400 text-navy-900 hover:bg-slate-100 w-full sm:w-auto text-center font-semibold' : 'text-xs font-bold uppercase text-slate-500 hover:text-sky-600 mr-4')}>
      <i className="fa-solid fa-circle-info mr-1" /><span>{t('Spesifikasi')}</span>
    </button>
  );
  const link = <a href="/quote" className={className} onClick={(e) => { e.preventDefault(); cart.openOrder(p); }}>{children}</a>;
  return big ? <>{link}{spec}</> : <>{spec}{link}</>;
}
