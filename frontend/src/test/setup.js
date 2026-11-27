// Setup global Vitest: matcher jest-dom, bersihkan DOM & storage, dan jaringan dimock di batas fetch.
// Test dengan `@vitest-environment node` (tanpa DOM) melewati bagian khusus browser.
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { mockApi } from './mockApi.js';

const HAS_DOM = typeof window !== 'undefined';

beforeEach(() => {
  mockApi({}); // default: semua endpoint API -> 200 dengan body kosong
  if (HAS_DOM) window.scrollTo = vi.fn(); // jsdom tidak mengimplementasikan scrollTo
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (!HAS_DOM) return;
  cleanup();
  localStorage.clear();
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
});
