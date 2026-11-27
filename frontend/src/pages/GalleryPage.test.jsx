import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import GalleryPage from './GalleryPage.jsx';
import { renderSite } from '../test/renderSite.jsx';
import { mockApi } from '../test/mockApi.js';

describe('Halaman Galeri Kegiatan', () => {
  // Regresi: GalleryPage memakai <ActivityGallery /> tanpa import -> "ActivityGallery is not defined".
  it('tampil dengan pesan kosong bila belum ada kegiatan', async () => {
    renderSite(<GalleryPage />, { route: '/gallery' });

    expect(screen.getByRole('heading', { level: 1, name: 'Galeri Kegiatan' })).toBeInTheDocument();
    expect(await screen.findByText('Oops, sepertinya belum ada kegiatan yang dipost di sini')).toBeInTheDocument();
  });

  it('menampilkan kegiatan dari admin', async () => {
    mockApi({ '/gallery': [{ id: 1, title: 'Outing Batu 2026', description: 'Jalan-jalan tim', image_url: '/storage/a.jpg', event_date: '2026-08-17' }] });

    renderSite(<GalleryPage />, { route: '/gallery' });

    expect(await screen.findByText('Outing Batu 2026')).toBeInTheDocument();
  });
});
