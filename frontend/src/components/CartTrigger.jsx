// Tombol bebas yang membuka jendela pesan / spesifikasi produk (mis. di Beranda).
import { createElement } from 'react';
import { useT } from '../i18n/I18nProvider.jsx';
import { useCart } from './Cart.jsx';
import { productByTitle } from '../data/cartNames.js';

export default function CartTrigger({ as = 'button', order, spec, img, children, ...rest }) {
  const t = useT();
  const cart = useCart();
  const onClick = (e) => {
    e.preventDefault();
    const idTitle = order || spec;
    const p = { ...productByTitle(idTitle, img), title: t(idTitle) };
    if (spec) cart.openInfo(p); else cart.openOrder(p);
  };
  return createElement(as, { ...rest, type: as === 'button' ? 'button' : undefined, onClick }, children);
}
