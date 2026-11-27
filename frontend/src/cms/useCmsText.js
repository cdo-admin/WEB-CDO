import { useCms, useScope } from './cms.js';
import { useI18n, norm } from '../i18n/i18n.js';

/** Teks hasil CMS + terjemahan untuk kunci asli `orig` (dipakai juga oleh komponen lain). */
export function useCmsText() {
  const { pick } = useCms();
  const scope = useScope();
  const { lang, lookup } = useI18n();
  return (orig, { translate = true } = {}) => {
    const key = norm(orig);
    const ov = pick('text', scope, key);
    const idText = ov && ov.id != null ? ov.id : key;
    if (!translate || lang !== 'en') return idText;
    const en = (ov && ov.en) || lookup(norm(idText));
    return en != null && String(en).indexOf('<') === -1 ? en : idText;
  };
}
