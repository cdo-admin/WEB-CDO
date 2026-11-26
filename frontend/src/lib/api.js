// Klien API Laravel. Alamat diambil dari VITE_API_URL (kosong = domain yang sama).
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';
const TOKEN_KEY = 'candiAdminToken';

export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

export class ApiError extends Error {
  constructor(message, status, data) { super(message); this.status = status; this.data = data; }
}

export async function api(path, { method = 'GET', body, query, auth = false, signal } = {}) {
  let url = BASE + path;
  if (query) {
    const qs = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null));
    url += (url.includes('?') ? '&' : '?') + qs;
  }
  const headers = { Accept: 'application/json' };
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (auth) { const t = getToken(); if (t) headers.Authorization = 'Bearer ' + t; }
  const res = await fetch(url, { method, headers, signal, body: body === undefined ? undefined : isForm ? body : JSON.stringify(body) });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const msg = (data && (data.message || (data.errors && Object.values(data.errors)[0]?.[0]))) || ('HTTP ' + res.status);
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

/** Panggilan admin (dengan token login). */
export const adminApi = (path, opts = {}) => api('/admin' + path, { ...opts, auth: true });
