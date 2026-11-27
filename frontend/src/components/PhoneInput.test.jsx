import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneInput from './PhoneInput.jsx';
import { renderSite } from '../test/renderSite.jsx';

const renderPhone = () => renderSite(<form><label htmlFor="tel">Telepon</label><PhoneInput id="tel" /><button type="button">lain</button></form>);

describe('input nomor telepon', () => {
  it('merapikan nomor Indonesia ke format internasional saat keluar dari kolom', async () => {
    const user = userEvent.setup();
    renderPhone();
    const input = screen.getByLabelText('Telepon');

    await user.type(input, '081234567890');
    await user.tab();

    expect(input).toHaveValue('+62 812 3456 7890');
    expect(screen.queryByText(/tidak valid/)).not.toBeInTheDocument();
  });

  it('menampilkan pesan bila nomor terlalu pendek', async () => {
    const user = userEvent.setup();
    renderPhone();

    await user.type(screen.getByLabelText('Telepon'), '0812');
    await user.tab();

    expect(screen.getByText(/Nomor telepon tidak valid untuk/)).toBeInTheDocument();
  });

  it('memilih negara otomatis dari kode +65 lalu memvalidasi dengan aturan negara itu', async () => {
    const user = userEvent.setup();
    renderPhone();
    const input = screen.getByLabelText('Telepon');

    await user.type(input, '+6591234567');
    await user.tab();

    expect(screen.getByRole('combobox', { name: /Kode negara/ })).toHaveValue('SG');
    expect(input).toHaveValue('+65 9123 4567');
  });

  it('negara yang terdeteksi tetap dipakai untuk nomor lokal yang diketik ulang', async () => {
    const user = userEvent.setup();
    renderPhone();
    const input = screen.getByLabelText('Telepon');

    await user.type(input, '+65');
    await user.clear(input);
    await user.type(input, '91234567');
    await user.tab();

    expect(input).toHaveValue('+65 9123 4567');
  });
});
