import { vi } from 'vitest';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/**
 * Mock `fetch` untuk API Laravel. `routes` memetakan path setelah `/api` (tanpa query) ke body respons.
 * Path yang tidak terdaftar -> [] (sama seperti backend tanpa isi).
 */
export function mockApi(routes) {
  const fetchMock = vi.fn(async (url) => {
    const path = new URL(String(url), 'http://localhost').pathname.replace(/^\/api/, '');
    return json(Object.prototype.hasOwnProperty.call(routes, path) ? routes[path] : []);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
