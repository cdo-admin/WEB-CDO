import { T, CImg, CLink, Card } from '../cms/components.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-navy-950 text-white pt-20 pb-12 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-4 space-y-6">
            <CLink href="index.html" className="flex items-center gap-3">
              <CImg src="assets/images/logo.png" alt={t("Logo")} className="w-10 h-10 object-contain" />
              {" "}
              <span className="font-candi-title text-xl text-white uppercase tracking-[0.16em]"><T>CANDI OXYGEN</T></span>
            </CLink>
            <p className="text-xs text-slate-400 leading-relaxed">
              <T>Industri yang bergerak di bidang Supplier Gas. Melayani pasokan gas dan layanan servis berkualitas tinggi ke industri bisnis dan ke rumah Anda sejak tahun 1980.</T>
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p><strong className="text-white"><T>Alamat:</T></strong></p>
              <p>
                <span className="text-slate-200 font-semibold"><T>PT. Candi Oxygen Gases:</T></span>
                {" "}
                <span>
                  <T>{"Pergudangan & Industri \"Safe N Lock\" Blok K No. 1726-1729, Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul, Sidoarjo, Jawa Timur 61232"}</T>
                </span>
              </p>
              <p>
                <span className="text-slate-200 font-semibold"><T>PT. Candi Sukses Abadi:</T></span>
                {" "}
                <span>
                  <T>Jl. Bypass Krian, Semawut, Balongbendo, Kec. Balongbendo, Kabupaten Sidoarjo, Jawa Timur 61263</T>
                </span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300 font-luxury-serif"><T>Navigasi</T></h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <CLink href="index.html" className="hover:text-white transition-colors"><T>Beranda</T></CLink>
              </li>
              <li>
                <CLink href="about.html" className="hover:text-white transition-colors"><T>Tentang Kami</T></CLink>
              </li>
              <li>
                <CLink href="products.html" className="hover:text-white transition-colors"><T>{"Produk & Layanan"}</T></CLink>
              </li>
              <li>
                <CLink href="portfolio.html" className="hover:text-white transition-colors"><T>Portofolio</T></CLink>
              </li>
              <li>
                <CLink href="gallery.html" className="hover:text-white transition-colors"><T>Galeri</T></CLink>
              </li>
              <li>
                <CLink href="career.html" className="hover:text-white transition-colors"><T>Karir</T></CLink>
              </li>
              <li>
                <CLink href="contact.html" className="hover:text-white transition-colors"><T>{"Kontak & Lokasi"}</T></CLink>
              </li>
              <li>
                <CLink href="quote.html" className="hover:text-white transition-colors"><T>Ajukan Penawaran</T></CLink>
              </li>
            </ul>
          </div>
          <Card sig="*|Lini Utama"><div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300 font-luxury-serif"><T>Lini Utama</T></h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <CLink href="products.html" className="hover:text-white transition-colors"><T>{"Industrial & Medical Gases"}</T></CLink>
              </li>
              <li>
                <CLink href="products.html" className="hover:text-white transition-colors"><T>{"Filling Station & Delivery Service"}</T></CLink>
              </li>
              <li>
                <CLink href="products.html" className="hover:text-white transition-colors"><T>{"Gas Piping System & Purging"}</T></CLink>
              </li>
              <li>
                <CLink href="products.html" className="hover:text-white transition-colors"><T>{"Spare Parts & Maintenance"}</T></CLink>
              </li>
              <li>
                <CLink href="products.html" className="hover:text-white transition-colors"><T>{"Cylinder, Dewars, Valve & Regulator"}</T></CLink>
              </li>
            </ul>
          </div></Card>
          <Card sig={"*|Hubungi & Ikuti Kami"}><div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300 font-luxury-serif"><T>{"Hubungi & Ikuti Kami"}</T></h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p>
                <i className="fa-solid fa-phone text-sky-400 mr-2 w-4" />
                {" "}
                <CLink href="tel:+623199010315" className="hover:text-white"><T>(031) 990103 15 / 16</T></CLink>
              </p>
              <p>
                <i className="fa-brands fa-whatsapp text-emerald-400 mr-2 w-4" />
                {" "}
                <CLink href="https://wa.me/628113739800" target="_blank" rel="noopener noreferrer" className="hover:text-white"><T>+62 811-3739-800</T></CLink>
              </p>
              <p>
                <i className="fa-solid fa-envelope text-sky-400 mr-2 w-4" />
                {" "}
                <CLink href="mailto:cdosidoarjo@gmail.com" className="hover:text-white"><T>cdosidoarjo@gmail.com</T></CLink>
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-medium"><T>Akun Media Sosial Resmi:</T></span>
              <div className="flex items-center gap-3">
                <CLink href="https://www.instagram.com/candioxygengases" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 text-white flex items-center justify-center transition-all duration-300 group" title={t("Instagram @candioxygengases")}><i className="fa-brands fa-instagram text-sm" /></CLink>
                {" "}
                <CLink href="https://www.tiktok.com/@candioxygengases" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-black text-white flex items-center justify-center transition-all duration-300 group" title={t("TikTok @candioxygengases")}><i className="fa-brands fa-tiktok text-sm" /></CLink>
                {" "}
                <CLink href="https://www.linkedin.com/company/pt-candi-oxygen-gases" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all duration-300 group" title={t("LinkedIn PT. Candi Oxygen")}><i className="fa-brands fa-linkedin-in text-sm" /></CLink>
                {" "}
                <CLink href="https://wa.me/628113739800" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-300 group" title={t("WhatsApp +62 811-3739-800")}><i className="fa-brands fa-whatsapp text-sm" /></CLink>
              </div>
            </div>
          </div></Card>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div><T>© 2026 PT. Candi Oxygen. Seluruh Hak Cipta Dilindungi Undang-Undang.</T></div>
          <div className="flex items-center space-x-6 text-[11px]">
            <CLink href="#" className="hover:text-slate-400 transition-colors"><T>Kebijakan Privasi</T></CLink>
            {" "}
            <CLink href="#" className="hover:text-slate-400 transition-colors"><T>Ketentuan Layanan</T></CLink>
            {" "}
            <CLink href="#" className="hover:text-slate-400 transition-colors"><T>{"Sertifikasi & K3"}</T></CLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
