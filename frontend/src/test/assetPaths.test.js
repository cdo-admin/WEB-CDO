// @vitest-environment node
// Regresi: ProductsPage memakai "AR Produk.jpg" padahal file bernama "AR produk.jpg". Windows tidak peduli
// huruf besar/kecil, tetapi server Linux & Vite peduli -> gambar 404 di produksi.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..', '..');
const SRC = join(ROOT, 'src');
const PUBLIC = join(ROOT, 'public');

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.(jsx?|css)$/.test(name) && !/\.test\./.test(name) ? [p] : [];
  });
}

/** true bila setiap segmen path ada di disk dengan ejaan huruf yang persis sama. */
function existsExactCase(base, relPath) {
  let dir = base;
  for (const seg of relPath.split('/')) {
    let names;
    try { names = readdirSync(dir); } catch { return false; }
    if (!names.includes(seg)) return false;
    dir = join(dir, seg);
  }
  return true;
}

const refs = sourceFiles(SRC).flatMap((file) => {
  const code = readFileSync(file, 'utf8');
  return [...code.matchAll(/["'(]\.?\/?(assets\/images\/[^"')?#]+\.(?:jpe?g|png|webp|avif|svg|gif))/gi)]
    .map((m) => ({ file: relative(ROOT, file).replace(/\\/g, '/'), path: m[1] }));
});

describe('gambar lokal yang dipakai kode', () => {
  it('ditemukan di kode (pemeriksaan tidak kosong)', () => {
    expect(refs.length).toBeGreaterThan(20);
  });

  it('semuanya ada di public/ dengan huruf besar/kecil yang sama', () => {
    const missing = refs.filter((r) => !existsExactCase(PUBLIC, r.path)).map((r) => `${r.file}: ${r.path}`);
    expect([...new Set(missing)]).toEqual([]);
  });
});
