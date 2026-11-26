// Header (logo, menu, pencarian, pilihan bahasa) + menu laci HP. Dulu initNavbar/initActiveNavLink di main.js.
import { useEffect, useState } from 'react';
import { T, CImg, CLink } from '../cms/components.jsx';
import { usePageFile } from '../cms/CmsProvider.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import HeaderSearch from './HeaderSearch.jsx';

const NAV = [
  ['index.html', 'BERANDA', 'Beranda'], ['about.html', 'TENTANG KAMI', 'Tentang Kami'], ['products.html', 'PRODUK & LAYANAN', 'Produk & Layanan'],
  ['portfolio.html', 'PORTOFOLIO', 'Portofolio'], ['gallery.html', 'GALERI', 'Galeri'], ['career.html', 'KARIR', 'Karir'], ['contact.html', 'KONTAK & LOKASI', 'Kontak & Lokasi'],
];
const SOLID = 'bg-white/95 backdrop-blur-md shadow-luxury-sm border-b border-slate-200/90';

function LangSwitch({ className = '' }) {
  const { lang, setLanguage, t } = useI18n();
  return (
    <div className={'lang-switcher-pill ' + className} title={t('Pilih Bahasa / Choose Language')}>
      {['id', 'en'].map((l) => (
        <button key={l} type="button" className={'lang-btn' + (lang === l ? ' active' : '')} data-lang={l} aria-pressed={lang === l}
          title={l === 'id' ? t('Bahasa Indonesia') : t('English')} onClick={() => setLanguage(l)}>
          <span>{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useI18n();
  const page = usePageFile();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);   // laci HP terpasang
  const [slide, setSlide] = useState(false); // animasi laci masuk

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const openMenu = () => { setMenu(true); document.body.style.overflow = 'hidden'; setTimeout(() => setSlide(true), 10); };
  const closeMenu = () => { setSlide(false); document.body.style.overflow = ''; setTimeout(() => setMenu(false), 350); };
  useEffect(() => { if (menu) closeMenu(); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <header id="main-header" className={'sticky top-0 z-50 w-full transition-all duration-300 ' + (scrolled ? SOLID : 'bg-transparent')}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between xl:justify-center">
          <div className="hidden xl:flex items-center justify-center gap-x-3 2xl:gap-x-6 w-full">
            <CLink href="index.html" className="flex items-center gap-2.5 shrink-0 group mr-2">
              <CImg src="assets/images/logo.png" alt={t('PT. Candi Oxygen Logo')} className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
              <span className="font-candi-title text-sm 2xl:text-lg text-navy-900 group-hover:text-sky-600 transition-colors uppercase tracking-[0.14em]"><T>CANDI OXYGEN</T></span>
            </CLink>
            {NAV.map(([href, label]) => {
              const here = href === page;
              return (
                <CLink key={href} href={href} aria-current={here ? 'page' : undefined}
                  className={'nav-omega-link shrink-0 text-[11px] 2xl:text-xs font-semibold tracking-wide 2xl:tracking-wider text-slate-700 hover:text-sky-600 transition-colors' + (here ? ' active active-omega nav-here' : '')}>
                  <T>{label}</T>
                </CLink>
              );
            })}
            <HeaderSearch wrapClass="header-search-wrap relative shrink-0" placeholder="Cari gas, layanan..."
              inputClass="header-search-input w-32 2xl:w-44 focus:w-52 text-xs py-1.5 pl-8 pr-3 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:border-sky-500 transition-all" />
            <LangSwitch className="shrink-0" />
            <CLink href="quote.html" className="bg-navy-950 hover:bg-sky-600 text-white shrink-0 px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-full transition-colors shadow-sm ml-1"><span><T>AJUKAN PENAWARAN</T></span></CLink>
          </div>
          <div className="flex xl:hidden items-center justify-between w-full">
            <CLink href="index.html" className="flex items-center gap-2 group">
              <CImg src="assets/images/logo.png" alt={t('PT. Candi Oxygen Logo')} className="w-8 h-8 object-contain" />
              <span className="font-candi-title text-base text-navy-900 uppercase tracking-[0.14em]"><T>CANDI OXYGEN</T></span>
            </CLink>
            <div className="flex items-center gap-2">
              <LangSwitch className="scale-90" />
              <button id="mobile-menu-toggle" type="button" className="p-2 text-navy-900 focus:outline-none" aria-label={t('Menu')} onClick={openMenu}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className={'fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-300' + (menu ? '' : ' hidden') + (slide ? ' opacity-100' : '')}
        onClick={(e) => { if (e.target === e.currentTarget) closeMenu(); }}>
        <div className={'mobile-drawer-content fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl p-6 sm:p-8 flex flex-col justify-between transform transition-transform duration-300 overflow-y-auto' + (slide ? '' : ' -translate-x-full')}>
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <CImg src="assets/images/logo.png" alt={t('Logo')} className="w-9 h-9 object-contain" />
                <span className="font-candi-title text-base sm:text-lg uppercase text-navy-900"><T>CANDI OXYGEN</T></span>
              </div>
              <button id="mobile-menu-close" type="button" className="p-2 text-slate-400 hover:text-navy-900" aria-label={t('Tutup')} onClick={closeMenu}><i className="fa-solid fa-xmark text-xl" /></button>
            </div>
            <HeaderSearch wrapClass="mt-6 header-search-wrap relative" inputClass="header-search-input !w-full !py-2.5 !pl-9" dropClass="!w-full !left-0" placeholder="Cari produk gas, layanan, alat..." />
            <nav className="mt-6 flex flex-col space-y-3">
              {NAV.concat([['quote.html', '', 'Ajukan Penawaran (RFQ)']]).map(([href, , label]) => (
                <CLink key={href} href={href} onClick={closeMenu}
                  className={'text-xs font-bold uppercase tracking-widest py-2 border-b border-slate-100 ' + (href === page ? 'text-sky-600' : 'text-slate-700 hover:text-sky-600')}>
                  <T>{label}</T>
                </CLink>
              ))}
            </nav>
          </div>
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <CLink href="quote.html" onClick={closeMenu} className="w-full text-center block py-3 bg-navy-900 text-white font-medium text-xs tracking-[0.2em] uppercase rounded-full shadow-md"><T>Ajukan Penawaran</T></CLink>
          </div>
        </div>
      </div>
    </>
  );
}
