import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderBuilder from './OrderBuilder.jsx';
import { renderSite } from '../test/renderSite.jsx';

const orderRows = () => within(screen.getByRole('table')).queryAllByRole('row').slice(1); // tanpa baris judul

describe('tabel pesanan di halaman penawaran', () => {
  it('menambah item produk terpilih ke tabel dan menyimpannya di keranjang', async () => {
    const user = userEvent.setup();
    renderSite(<OrderBuilder />, { route: '/quote' });
    const before = orderRows().filter((r) => r.textContent.includes('Oksigen Medis')).length;

    await user.click(screen.getByRole('button', { name: /Tambah Item/i }));

    expect(orderRows().filter((r) => r.textContent.includes('Oksigen Medis'))).toHaveLength(before + 1);
    expect(JSON.parse(localStorage.getItem('candiCart1'))).toEqual([expect.objectContaining({ name: 'Oksigen Medis', qty: '1' })]);
  });

  it('preset cepat langsung menambah item', async () => {
    const user = userEvent.setup();
    renderSite(<OrderBuilder />, { route: '/quote' });

    await user.click(screen.getByRole('button', { name: '+ 5 Tabung Nitrogen 6m³' }));

    expect(orderRows().some((r) => r.textContent.includes('Nitrogen') && r.textContent.includes('5'))).toBe(true);
  });
});
