// Render komponen dengan provider yang sama seperti situs publik di main.jsx.
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nProvider.jsx';
import { CmsProvider } from '../cms/CmsProvider.jsx';
import { ToastProvider } from '../components/Toast.jsx';
import { CartProvider } from '../components/Cart.jsx';

function LocationProbe() {
  const loc = useLocation();
  return <output data-testid="location">{loc.pathname}</output>;
}

export function renderSite(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <I18nProvider>
        <CmsProvider>
          <ToastProvider>
            <CartProvider>
              <Routes><Route path="*" element={ui} /></Routes>
              <LocationProbe />
            </CartProvider>
          </ToastProvider>
        </CmsProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}
