// Peta halaman: nama file lama (dipakai sebagai kunci data CMS & statistik) <-> alamat React Router.
export const PAGE_ROUTES = {
  'index.html': '/',
  'about.html': '/about',
  'products.html': '/products',
  'portfolio.html': '/portfolio',
  'gallery.html': '/gallery',
  'career.html': '/career',
  'contact.html': '/contact',
  'quote.html': '/quote',
};
const ROUTE_PAGES = Object.fromEntries(Object.entries(PAGE_ROUTES).map(([f, r]) => [r, f]));

export const PAGE_LABELS = [
  ['index.html', 'Beranda'], ['about.html', 'Tentang Kami'], ['products.html', 'Produk & Layanan'], ['portfolio.html', 'Portofolio'],
  ['gallery.html', 'Galeri Kegiatan'], ['career.html', 'Karir'], ['contact.html', 'Kontak'], ['quote.html', 'Ajukan Penawaran'],
];

/** "/products" -> "products.html" */
export function pageFileOf(pathname) {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  if (ROUTE_PAGES[p]) return ROUTE_PAGES[p];
  const last = p.split('/').pop();
  return /\.html$/.test(last) ? last : (last || 'index') + '.html';
}

/** "products.html#section-gases" -> "/products#section-gases"; null bila bukan halaman internal. */
export function internalRoute(href) {
  const m = /^(?:\.\/|\/)?([a-z0-9-]+)(?:\.html)?(\?[^#]*)?(#.*)?$/i.exec(String(href || '').trim());
  if (!m) return null;
  const file = m[1].toLowerCase() + '.html';
  if (!PAGE_ROUTES[file]) return null;
  return PAGE_ROUTES[file] + (m[2] || '') + (m[3] || '');
}

/** Alamat gambar statis dari folder public (mendukung build di sub-folder /app/). */
export function assetUrl(src) {
  if (!src || /^(https?:|data:|blob:|\/\/)/i.test(src)) return src;
  if (src.startsWith('/')) return src;
  return import.meta.env.BASE_URL + src.replace(/^\.\//, '');
}
