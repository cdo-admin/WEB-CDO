import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import { CmsProvider } from './cms/CmsProvider.jsx';
import { EDIT_MODE } from './cms/cms.js';
import { ToastProvider } from './components/Toast.jsx';
import { CartProvider } from './components/Cart.jsx';
import Layout from './Layout.jsx';
import { PAGE_ROUTES } from './lib/pages.js';
import HomePage, { meta as homeMeta } from './pages/HomePage.jsx';
import AboutPage, { meta as aboutMeta } from './pages/AboutPage.jsx';
import ProductsPage, { meta as productsMeta } from './pages/ProductsPage.jsx';
import PortfolioPage, { meta as portfolioMeta } from './pages/PortfolioPage.jsx';
import GalleryPage, { meta as galleryMeta } from './pages/GalleryPage.jsx';
import CareerPage, { meta as careerMeta } from './pages/CareerPage.jsx';
import ContactPage, { meta as contactMeta } from './pages/ContactPage.jsx';
import QuotePage, { meta as quoteMeta } from './pages/QuotePage.jsx';

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const PAGES = [
  [HomePage, homeMeta], [AboutPage, aboutMeta], [ProductsPage, productsMeta], [PortfolioPage, portfolioMeta],
  [GalleryPage, galleryMeta], [CareerPage, careerMeta], [ContactPage, contactMeta], [QuotePage, quoteMeta],
];

/** Alamat lama (about.html, index.html, admin.html) tetap berfungsi -> diarahkan ke alamat baru. */
function LegacyRedirect({ to }) {
  const loc = useLocation();
  return <Navigate replace to={to + loc.search + loc.hash} />;
}

function Site() {
  return (
    <I18nProvider forceLang={EDIT_MODE ? 'id' : undefined}>
      <CmsProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>
              {PAGES.map(([Page, meta]) => (
                <Route key={meta.page} path={PAGE_ROUTES[meta.page]} element={<Layout meta={meta}><Page /></Layout>} />
              ))}
              {Object.entries(PAGE_ROUTES).map(([file, route]) => <Route key={file} path={'/' + file} element={<LegacyRedirect to={route} />} />)}
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </CmsProvider>
    </I18nProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin.html" element={<LegacyRedirect to="/admin" />} />
        <Route path="/admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
        <Route path="/*" element={<Site />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
