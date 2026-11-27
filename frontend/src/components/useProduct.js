import { useCmsText } from '../cms/useCmsText.js';
import { useCms, useScope } from '../cms/cms.js';
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

