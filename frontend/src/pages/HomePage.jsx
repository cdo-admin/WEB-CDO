import { T, TH, CImg, CLink, Card } from '../cms/components.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import CartTrigger from '../components/CartTrigger.jsx';
import CandiMap from '../components/CandiMap.jsx';
import { useHeroScroll } from '../hooks/usePageEffects.js';

export const meta = { page: "index.html", title: "PT. Candi Oxygen | Supplier Gas Industri & Medis Sejak 1980 Jawa Timur", description: "PT. Candi Oxygen adalah industri supplier gas terkemuka di Jawa Timur sejak 1980. Memasok gas industri, gas medis berkualitas tinggi, filling station, dan sistem instalasi pemipaan gas di Safe N Lock Sidoarjo." };

export default function HomePage() {
  const t = useT();
  useHeroScroll();
  return (
    <>
      <section id="rolex-hero" className="relative w-full h-[90vh] min-h-[680px] flex items-center justify-center overflow-hidden bg-navy-950">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <CImg id="rolex-hero-img" src="assets/images/beranda/beranda hero.jpg" alt={t("Candi Oxygen Precision Gas Supply")} className="w-full h-full object-cover filter brightness-100 transition-transform duration-100 ease-out will-change-transform will-change-filter" />
          <div id="rolex-hero-overlay" className="absolute inset-0 bg-navy-950 transition-opacity duration-100 ease-out opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(4,9,20,0.85)_90%)]" />
        </div>
        <div id="rolex-hero-content" className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto space-y-6 transition-all duration-100 ease-out will-change-transform will-change-opacity">
          <span className="block text-xs uppercase tracking-[0.35em] text-sky-300 font-medium font-luxury-sub"><T>PRESISI • KEMURNIAN • KEANDALAN</T></span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"><T>{"Kemurnian Gas Tertinggi untuk Kehidupan & Industri"}</T></h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-light leading-relaxed">
            <T>Memasok gas industri, gas medis, dan instalasi sistem pemipaan gas sejak tahun 1980.</T>
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <CLink href="#rolex-vertical-showcase" className="btn-rolex-pill group">
              <span><T>Selanjutnya</T></span>
              {" "}
              <i className="fa-solid fa-chevron-down text-xs group-hover:translate-y-0.5 transition-transform" />
            </CLink>
          </div>
        </div>
      </section>
      <section id="rolex-vertical-showcase" className="w-full bg-navy-950 px-2 sm:px-4 py-4 transition-all duration-700">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
          <Card sig={"index.html|Industrial & Medical Gases"}><CLink href="products.html" className="rolex-vertical-card group rounded-sm block">
            <CImg src="assets/images/beranda/showcase 1.jpg" alt={t("Industrial & Medical Gases")} />
            <div className="card-overlay" />
            <div className="card-content">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-sky-400 font-bold block mb-2"><T>Produk Gas</T></span>
              <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-sky-300 transition-colors"><T>{"Industrial & Medical Gases"}</T></h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                <T>Oksigen, Nitrogen, Argon, Asetilen, CO2, Mixed Gases, Special Gases, hingga LPG berstandar mutu tinggi.</T>
              </p>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 mt-4 font-semibold group-hover:translate-x-2 transition-transform">
                <span><T>Lihat Seluruh Gas</T></span>
                {" "}
                <i className="fa-solid fa-arrow-right-long text-xs" />
              </span>
            </div>
          </CLink></Card>
          {" "}
          <Card sig={"index.html|Dedikasi & Kepercayaan"}><CLink href="about.html" className="rolex-vertical-card group rounded-sm block">
            <CImg src="assets/images/beranda/showcase dedikasi.jpg" alt={t("Dedikasi Sejak 1980")} />
            <div className="card-overlay" />
            <div className="card-content">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-sky-400 font-bold block mb-2"><T>Melayani Sejak 1980</T></span>
              <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-sky-300 transition-colors"><T>{"Dedikasi & Kepercayaan"}</T></h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                <T>Membangun reputasi dan kepercayaan setiap pelanggan dengan layanan dan produk berkualitas tinggi.</T>
              </p>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 mt-4 font-semibold group-hover:translate-x-2 transition-transform">
                <span><T>Baca Profil Perusahaan</T></span>
                {" "}
                <i className="fa-solid fa-arrow-right-long text-xs" />
              </span>
            </div>
          </CLink></Card>
          {" "}
          <Card sig={"index.html|Filling Station & Gas Piping"}><CLink href="products.html" className="rolex-vertical-card group rounded-sm block">
            <CImg src="assets/images/beranda/showcase filling.jpg" alt={t("Layanan Servis & Perlengkapan")} />
            <div className="card-overlay" />
            <div className="card-content">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-sky-400 font-bold block mb-2"><T>Layanan Teknis</T></span>
              <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-sky-300 transition-colors"><T>{"Filling Station & Gas Piping"}</T></h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                <T>Delivery service, gas piping system, spare parts, maintenance, purging pipelines, dan perlengkapan gas lengkap.</T>
              </p>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sky-400 mt-4 font-semibold group-hover:translate-x-2 transition-transform">
                <span><T>Eksplorasi Layanan</T></span>
                {" "}
                <i className="fa-solid fa-arrow-right-long text-xs" />
              </span>
            </div>
          </CLink></Card>
        </div>
      </section>
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-sm overflow-hidden shadow-luxury-lg border border-slate-200">
                <CImg src="assets/images/beranda/beranda tentang.jpg" alt={t("Fasilitas Safe N Lock PT Candi Oxygen")} className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-sky-300 font-semibold font-mono"><T>SAFE N LOCK SIDOARJO</T></span>
                  <h4 className="font-luxury-serif text-xl font-bold text-white mt-1"><T>{"Stasiun Pengisian & Logistik"}</T></h4>
                  <p className="text-xs text-slate-300 mt-1"><T>{"Kawasan Industri & Pergudangan Safe N Lock Blok K 1726-1729."}</T></p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3" />
              <h2 className="scroll-fade-heading font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-navy-900 leading-tight">
                <TH k={"Membangun Reputasi & Kepercayaan, Memasok Gas Berkualitas Sejak 1980."}><T>{"Membangun Reputasi & Kepercayaan,"}</T><br />{" "}<span className="font-semibold text-navy-950"><T>Memasok Gas Berkualitas Sejak 1980.</T></span></TH>
              </h2>
              <div className="p-6 bg-slate-50 border-l-4 border-sky-500 rounded-sm text-slate-700 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  <TH k="Candi Oxygen adalah Industri yang bergerak di bidang Supplier Gas."><strong><T>Candi Oxygen</T></strong>{" "}<T>adalah Industri yang bergerak di bidang</T>{" "}<strong><T>Supplier Gas</T></strong><T>.</T></TH>
                </p>
                <p>
                  <TH k="Selama bertahun-tahun, PT. Candi Oxygen telah membangun reputasi dan kepercayaan kepada setiap pelanggan dengan memberikan layanan dan produk yang berkualitas tinggi."><T>Selama bertahun-tahun,</T>{" "}<strong><T>PT. Candi Oxygen</T></strong>{" "}<T>telah membangun reputasi dan kepercayaan kepada setiap pelanggan dengan memberikan layanan dan produk yang berkualitas tinggi.</T></TH>
                </p>
                <p>
                  <TH k="Kami telah memasok produk dan layanan servis kami ke industri bisnis dan ke rumah Anda sejak tahun 1980. Kami mempunyai tim yang ahli dalam bekerja keras untuk menyediakan setiap pelanggan kami layanan yang cepat dan terpercaya sesuai dengan yang mereka butuhkan."><T>Kami telah memasok produk dan layanan servis kami ke industri bisnis dan ke rumah Anda sejak tahun</T>{" "}<strong><T>1980</T></strong><T>. Kami mempunyai tim yang ahli dalam bekerja keras untuk menyediakan setiap pelanggan kami layanan yang cepat dan terpercaya sesuai dengan yang mereka butuhkan.</T></TH>
                </p>
              </div>
              <div className="pt-2">
                <CLink href="about.html" className="inline-flex items-center gap-3 text-xs uppercase font-bold tracking-[0.25em] text-navy-900 hover:text-sky-600 transition-colors group">
                  <span><T>{"Baca Profil & Sejarah Selengkapnya"}</T></span>
                  {" "}
                  <i className="fa-solid fa-arrow-right-long text-sky-500 group-hover:translate-x-1.5 transition-transform" />
                </CLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-luxury-md grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 h-96 lg:h-[480px] overflow-hidden bg-slate-900 relative">
              <CImg src="assets/images/beranda/showcase oxyy.jpg" alt={t("Gas Oksigen Industri PT Candi Oxygen")} className="w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 space-y-5">
              <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-navy-900"><T>Gas Oksigen Industri</T></h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                <T>Pasokan gas oksigen industri berkualitas tinggi dengan pilihan kemurnian WG, HP, dan UHP untuk pengelasan, pemotongan logam, laser cutting presisi, serta berbagai proses pembakaran dan produksi industri.</T>
              </p>
              <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-sky-500" />
                  {" "}
                  <span><T>{"Tersedia dalam tabung & sistem cradle manifold"}</T></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-sky-500" />
                  {" "}
                  <span><T>Pilihan kemurnian WG, HP, dan UHP sesuai kebutuhan proses</T></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-sky-500" />
                  {" "}
                  <span><T>Layanan antar cepat ke seluruh wilayah Jawa Timur</T></span>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <CartTrigger as="button" order="Oksigen (O2) Industri" img="assets/images/beranda/showcase oxyy.jpg" className="btn-rolex-pill-dark text-center px-8 py-3 text-xs uppercase tracking-wider rounded-full w-full sm:w-auto"><T>Pesan</T></CartTrigger>
                {" "}
                <CartTrigger as="button" spec="Oksigen (O2) Industri" img="assets/images/beranda/showcase oxyy.jpg" className="px-8 py-3 text-xs uppercase tracking-wider rounded-full border border-slate-400 text-navy-900 hover:bg-slate-100 font-semibold w-full sm:w-auto"><i className="fa-solid fa-circle-info mr-1" /><span><T>Spesifikasi</T></span></CartTrigger>
              </div>
              <div className="text-center pt-1">
                <CLink href="products.html" className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-navy-900"><T>Lihat semua produk →</T></CLink>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
            <CLink href="products.html" className="w-full sm:w-auto px-8 py-4 bg-navy-900 text-white hover:bg-navy-800 text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-luxury-md border border-navy-900 flex items-center justify-center gap-3 transition-all">
              <i className="fa-solid fa-list-check text-sky-400" />
              {" "}
              <span><T>{"Jelajahi Seluruh Produk & Layanan"}</T></span>
            </CLink>
            {" "}
            <CLink href="portfolio.html" className="w-full sm:w-auto px-8 py-4 bg-white text-navy-900 hover:bg-slate-100 text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-luxury-sm border border-slate-300 flex items-center justify-center gap-3 transition-all">
              <i className="fa-solid fa-images text-sky-600" />
              {" "}
              <span><T>Lihat Rekam Jejak Portofolio</T></span>
            </CLink>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold"><T>Fasilitas Kami</T></span>
            <h2 className="scroll-fade-heading font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>Lokasi Kami</T></h2>
          </div>
          <CandiMap />
        </div>
      </section>
    </>
  );
}
