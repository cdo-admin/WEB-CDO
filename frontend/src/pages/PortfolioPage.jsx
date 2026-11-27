import { T, CImg, CLink, Card } from '../cms/components.jsx';
import { PortfolioProvider, PortfolioFilters, PortfolioGrid } from '../components/Portfolio.jsx';
import { useT } from '../i18n/i18n.js';

export const meta = { page: "portfolio.html", title: "Portofolio & Rekam Jejak Industri | PT. Candi Oxygen", description: "Rekam jejak dan galeri proyek pasokan gas industri, gas medis, filling station Safe N Lock, dan instalasi sistem pemipaan gas oleh PT. Candi Oxygen sejak tahun 1980." };

export default function PortfolioPage() {
  const t = useT();
  return (
    <PortfolioProvider>
      <section className="bg-navy-950 text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CImg src={"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80"} alt={t("Rekam Jejak Proyek PT Candi Oxygen")} className="w-full h-full object-cover opacity-90 filter contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-sky-400" />
            {" "}
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold"><T>Rekam Jejak Kepercayaan Sejak 1980</T></span>
            {" "}
            <span className="h-px w-8 bg-sky-400" />
          </div>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white"><T>{"Portofolio Proyek & Kerjasama Industri"}</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            <T>Dokumentasi instalasi gas piping system, pasokan gas murni, filling station di Safe N Lock Sidoarjo, serta kemitraan rumah sakit dan manufaktur di seluruh Jawa Timur.</T>
          </p>
        </div>
      </section>
      <section className="py-6 bg-slate-50 border-b border-slate-200 sticky top-20 z-30 backdrop-blur-md bg-slate-50/95">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
            <PortfolioFilters />
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <PortfolioGrid>
            <Card sig={"portfolio.html|Pemasangan Gas Piping System & Suplai Oksigen Medis"}><div className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300" data-category="medis">
              <div className="relative h-64 overflow-hidden">
                <CImg src={"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"} alt={t("Instalasi Gas Medis RS Surabaya - Sidoarjo")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-navy-900 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm"><T>INSTALASI MEDIS</T></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span><T>{"Surabaya & Sidoarjo"}</T></span>
                  {" "}
                  <span className="font-mono text-emerald-600 font-semibold"><T>Aktif Beroperasi</T></span>
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors"><T>{"Pemasangan Gas Piping System & Suplai Oksigen Medis"}</T></h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>Instalasi pipa tembaga seamless degreased, manifold changeover otomatis, serta pengiriman rutin tabung 6 m³ untuk fasilitas rawat inap, ICU, dan instalasi gawat darurat.</T>
                </p>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span><T>{"Layanan: Piping & Delivery"}</T></span>
                  {" "}
                  <span className="text-emerald-600 font-bold"><T>100% On-Time</T></span>
                </div>
              </div>
            </div></Card>
            <Card sig="portfolio.html|Filling Station Modern Berstandar K3"><div className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300" data-category="kriogenik">
              <div className="relative h-64 overflow-hidden">
                <CImg src={"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"} alt={t("Modernisasi Stasiun Pengisian Filling Station Safe N Lock Sidoarjo")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-sky-600 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm"><T>SAFE N LOCK SIDOARJO</T></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span><T>Kawasan Safe N Lock Blok K</T></span>
                  {" "}
                  <span className="font-mono text-sky-600 font-semibold"><T>Stasiun Pengisian Utama</T></span>
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors"><T>Filling Station Modern Berstandar K3</T></h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>Fasilitas stasiun pengisian otomatis modern milik PT. Candi Oxygen di Sidoarjo yang melayani pengisian O2, N2, Argon, CO2, serta perawatan tabung berstandar K3.</T>
                </p>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span><T>Fasilitas: Filling Station</T></span>
                  {" "}
                  <span className="text-sky-600 font-bold"><T>Auto-Vacuum</T></span>
                </div>
              </div>
            </div></Card>
            <Card sig={"portfolio.html|Suplai Argon, Mixed Gases & Purging Nitrogen Galangan"}><div className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300" data-category="industri">
              <div className="relative h-64 overflow-hidden">
                <CImg src={"assets/images/produk dan layanan/gambar welding.jpg"} alt={t("Fabrikasi Baja dan Pengelasan Presisi Gresik & Pasuruan")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-navy-950 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm"><T>{"INDUSTRI & GALANGAN"}</T></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span><T>{"Kawasan Industri Gresik & Pasuruan"}</T></span>
                  {" "}
                  <span className="font-mono text-sky-600 font-semibold"><T>Pasokan Kontrak</T></span>
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors"><T>{"Suplai Argon, Mixed Gases & Purging Nitrogen Galangan"}</T></h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>{"Penyediaan pasokan gas Argon High Purity dan Gas Campuran dalam paket rak cradle silinder 16 tabung serta layanan purging pipelines Nitrogen untuk proyek galangan & pabrik baja."}</T>
                </p>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span><T>Produk: Argon, Mixed, Purging</T></span>
                  {" "}
                  <span className="text-sky-600 font-bold"><T>Cradle System</T></span>
                </div>
              </div>
            </div></Card>
            <Card sig={"portfolio.html|Penyediaan Liquid Nitrogen & CO2 Pembekuan Makanan"}><div className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300" data-category="industri">
              <div className="relative h-64 overflow-hidden">
                <CImg src={"https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"} alt={t("Nitrogen Liquid Pembekuan Cepat Makanan Mojokerto")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-navy-900 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm"><T>{"FOOD & BEVERAGE"}</T></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span><T>{"Mojokerto & Malang"}</T></span>
                  {" "}
                  <span className="font-mono text-emerald-600 font-semibold"><T>Food Grade</T></span>
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors"><T>{"Penyediaan Liquid Nitrogen & CO2 Pembekuan Makanan"}</T></h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>Pasokan teratur Nitrogen Cair dalam tabung cryogenic dewar serta gas CO2 food grade untuk industri pengemasan makanan beku, minuman berkarbonasi, dan modified atmosphere packaging.</T>
                </p>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span><T>Format: Cryogenic Dewars</T></span>
                  {" "}
                  <span className="text-emerald-600 font-bold"><T>{"Higienis & Bersertifikat"}</T></span>
                </div>
              </div>
            </div></Card>
            <Card sig={"portfolio.html|Armada Pengiriman Oksigen Medis Homecare & Regulator"}><div className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300" data-category="medis">
              <div className="relative h-64 overflow-hidden">
                <CImg src={"https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"} alt={t("Pasokan Oksigen Rumah Sakit & Homecare Jawa Timur")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-sky-600 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm"><T>{"HOMECARE & KLINIK"}</T></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span><T>Jawa Timur Raya</T></span>
                  {" "}
                  <span className="font-mono text-emerald-600 font-semibold"><T>Respon Tanggap</T></span>
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors"><T>{"Armada Pengiriman Oksigen Medis Homecare & Regulator"}</T></h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>Layanan cepat tanggap antar tabung oksigen medis 1 m³ dan 6 m³ lengkap dengan regulator medis berstandar, trolley silinder, dan pengujian kebocoran untuk pemulihan pasien di rumah.</T>
                </p>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span><T>Layanan: Homecare Delivery</T></span>
                  {" "}
                  <span className="text-emerald-600 font-bold"><T>Siap Kirim</T></span>
                </div>
              </div>
            </div></Card>
            <Card sig={"portfolio.html|Pembersihan & Inerting Jaringan Pipa dengan Nitrogen Kering"}><div className="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300" data-category="kriogenik">
              <div className="relative h-64 overflow-hidden">
                <CImg src={"assets/images/produk dan layanan/purging pipeline layanan.jpg"} alt={t("Purging Pipelines with Nitrogen di Pabrik Petrokimia")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-navy-950 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm"><T>PURGING PIPELINE</T></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span><T>Zona Industri Petrokimia</T></span>
                  {" "}
                  <span className="font-mono text-sky-600 font-semibold"><T>Sertifikasi Migas/K3</T></span>
                </div>
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors"><T>{"Pembersihan & Inerting Jaringan Pipa dengan Nitrogen Kering"}</T></h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>Jasa pengurasan pipa (purging) menggunakan gas Nitrogen bertekanan tinggi untuk menghilangkan uap hidrokarbon, kelembaban, dan oksigen sebelum proses re-commissioning pabrik kimia.</T>
                </p>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span><T>Teknologi: High Pressure N2</T></span>
                  {" "}
                  <span className="text-sky-600 font-bold"><T>Zero Spark Risk</T></span>
                </div>
              </div>
            </div></Card>
          </PortfolioGrid>
        </div>
      </section>
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono"><T>MULAI KOLABORASI INDUSTRI</T></span>
          <h2 className="scroll-fade-heading font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>Siap Membangun Kemitraan Pasokan Gas Berkelanjutan?</T></h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            <T>Diskusikan kebutuhan volume gas berkala, instalasi sistem sentral, atau sewa peralatan bersama tim ahli PT. Candi Oxygen untuk penawaran kompetitif.</T>
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CLink href="quote.html" className="btn-rolex-pill-dark px-8 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase rounded-full shadow-luxury-md"><T>Ajukan Penawaran Resmi</T></CLink>
            {" "}
            <CLink href="contact.html" className="btn-rolex-pill-light px-8 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase rounded-full border border-slate-300"><T>Hubungi Tim Kami</T></CLink>
          </div>
        </div>
      </section>
    </PortfolioProvider>
  );
}
