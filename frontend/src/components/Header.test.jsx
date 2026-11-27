import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import { renderSite } from '../test/renderSite.jsx';

const drawer = () => document.getElementById('mobile-menu');

/** Navigasi yang tidak lewat link di laci (setara tombol Back/Forward browser). */
function GoTo({ to }) {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate(to)}>navigasi luar</button>;
}

describe('menu HP di header', () => {
  it('membuka laci dan mengunci scroll halaman', async () => {
    const user = userEvent.setup();
    renderSite(<Header />);

    expect(drawer()).toHaveClass('hidden');
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    expect(drawer()).not.toHaveClass('hidden');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('menutup laci dan membuka kunci scroll setelah pindah halaman', async () => {
    const user = userEvent.setup();
    renderSite(<Header />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    await user.click(within(drawer()).getByRole('link', { name: 'Galeri' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/gallery');
    await waitFor(() => expect(drawer()).toHaveClass('hidden'));
    expect(document.body.style.overflow).toBe('');
  });

  it('menutup laci bila halaman berganti dari luar laci (mis. tombol Back browser)', async () => {
    const user = userEvent.setup();
    renderSite(<><Header /><GoTo to="/contact" /></>);
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    await user.click(screen.getByRole('button', { name: 'navigasi luar' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/contact');
    await waitFor(() => expect(drawer()).toHaveClass('hidden'));
    expect(document.body.style.overflow).toBe('');
  });

  it('tombol tutup menutup laci tanpa pindah halaman', async () => {
    const user = userEvent.setup();
    renderSite(<Header />, { route: '/about' });
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    await user.click(within(drawer()).getByRole('button', { name: 'Tutup' }));

    await waitFor(() => expect(drawer()).toHaveClass('hidden'));
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByTestId('location')).toHaveTextContent('/about');
  });
});
