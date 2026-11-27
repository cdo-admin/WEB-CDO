// Context keranjang + helper (dipakai Cart.jsx dan komponen lain).
import { createContext, useContext } from 'react';
import { useCms } from '../cms/cms.js';
import { PRODUCT_SPECS } from '../data/productSpecs.js';
import { WA_FALLBACK, MAIL_FALLBACK } from '../lib/order.js';

export const CART_KEY = 'candiCart1';
export const loadCart = () => { try { const a = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };
export const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);
export const specFor = (idTitle) => PRODUCT_SPECS[idTitle];

/** Nomor WhatsApp & email tujuan pesanan, ikut perubahan link dari admin. */
export function useContactTargets() {
  const { pick } = useCms();
  const wa = pick('href', '', 'https://wa.me/' + WA_FALLBACK);
  const m = wa && /wa\.me\/(\d+)/.exec(wa.id || '');
  const mail = pick('href', '', 'mailto:' + MAIL_FALLBACK);
  const mm = mail && /^mailto:([^?]+)/.exec(mail.id || '');
  return { waNumber: m ? m[1] : WA_FALLBACK, email: mm ? mm[1] : MAIL_FALLBACK };
}

