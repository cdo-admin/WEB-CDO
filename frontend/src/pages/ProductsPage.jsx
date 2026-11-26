import { T, CImg, Card } from '../cms/components.jsx';
import { useT } from '../i18n/I18nProvider.jsx';
import OrderButton from '../components/OrderButton.jsx';
import ProductTabs from "../components/ProductTabs.jsx";

export const meta = { page: "products.html", title: "Produk, Layanan & Perlengkapan Gas | PT. Candi Oxygen", description: "Katalog resmi gas industri & medis, stasiun pengisian filling station, pengiriman gas, instalasi pemipaan gas, dan perlengkapan bejana tekan PT. Candi Oxygen di Sidoarjo, Jawa Timur." };

export default function ProductsPage() {
  const t = useT();
  return (
    <>
      <section className="bg-navy-950 text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CImg src="assets/images/produk dan layanan/hero produk layanan.jpeg" alt={t("Koleksi Gas Industri PT Candi Oxygen")} className="w-full h-full object-cover opacity-80 filter contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-sky-400" />
            {" "}
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold"><T>{"Katalog Resmi & Showroom"}</T></span>
            {" "}
            <span className="h-px w-8 bg-sky-400" />
          </div>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white"><T>{"Koleksi Produk, Layanan & Perlengkapan Gas"}</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            <T>Gas industri dan medis, perlengkapan, serta layanan pendukung dari PT. Candi Oxygen Gases.</T>
          </p>
        </div>
      </section>
      <section id="products-tabbar" className="py-6 bg-slate-50 border-b border-slate-200 sticky top-20 z-30 backdrop-blur-md bg-slate-50/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
            <ProductTabs />
          </div>
        </div>
      </section>
      <div id="catalog-start" className="py-16 sm:py-24 bg-white space-y-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
          <section id="section-gases" className="product-category-section space-y-12" data-category="gases">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>{"Gas Industri & Medis"}</T></h2>
              <div className="w-12 h-0.5 bg-sky-500 mx-auto" />
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <T>Gas dengan kemurnian teruji laboratorium dalam berbagai ukuran tabung silinder dan pasokan curah cair untuk medis dan fabrikasi industri.</T>
              </p>
            </div>
            <section className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-sm p-8 sm:p-12 lg:p-16 shadow-luxury-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                <div className="lg:col-span-6 relative">
                  <div className="relative h-[380px] sm:h-[460px] rounded-sm overflow-hidden shadow-2xl bg-navy-950">
                    <CImg src="assets/images/produk dan layanan/showcase oxyy.jpg" alt={t("Signature Showcase: Oksigen Industri PT Candi Oxygen")} className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="lg:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900 tracking-tight"><T>Oksigen (O2) Industri</T></h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    <T>Oksigen industri dengan pilihan tingkat kemurnian WG, HP, dan UHP. Siap disalurkan untuk pengelasan dan pemotongan logam, laser cutting presisi tinggi, serta berbagai proses pembakaran dan produksi industri.</T>
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <OrderButton title="Oksigen (O2) Industri" cat="gas" big className="btn-rolex-pill-dark px-8 py-3.5 text-xs uppercase tracking-widest rounded-full shadow-luxury-md w-full sm:w-auto text-center"><T>Pesan</T></OrderButton>
                  </div>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card sig="products.html|Oksigen (O2) Medis"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/gambar oksigen medis.jpg" alt={t("Oksigen Medis")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Oksigen (O2) Medis</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Oksigen medis untuk terapi pernapasan di rumah sakit, klinik, dan kebutuhan homecare, tersedia dalam tabung siap pakai.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Oksigen (O2) Medis" cat="gas" img="assets/images/produk dan layanan/gambar oksigen medis.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Nitrogen (N2)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/N2 Produk.jpg" alt={t("Nitrogen Gas")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Nitrogen (N2)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>{"Gas inert berkualitas tinggi untuk proses purging pipa, pembekuan kriogenik makanan & minuman, perlakuan panas logam, dan ban pesawat/otomotif."}</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Nitrogen (N2)" cat="gas" img="assets/images/produk dan layanan/N2 Produk.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Argon (Ar)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/AR Produk.jpg" alt={t("Argon Gas")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Argon (Ar)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Pelindung atmosfer terbaik untuk pengelasan TIG/MIG stainless steel, aluminium, perakitan presisi pesawat terbang, dan spektrometri laboratorium.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Argon (Ar)" cat="gas" img="assets/images/produk dan layanan/AR Produk.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Karbon Dioksida (CO2)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/CO2 Produk.jpg" alt={t("CO2 Gas")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Karbon Dioksida (CO2)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Diaplikasikan luas untuk pengelasan MIG/MAG baja konstruksi, karbonasi minuman ringan, pemadam kebakaran, dan proses pendinginan cepat.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Karbon Dioksida (CO2)" cat="gas" img="assets/images/produk dan layanan/CO2 Produk.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Asetilen (C2H2)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/Acetylene produk.jpg" alt={t("Asetilen")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Asetilen (C2H2)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Bahan bakar gas bersuhu nyala api tertinggi (hingga 3.100°C) yang esensial untuk pemotongan logam baja tebal, brazing, dan flame hardening.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Asetilen (C2H2)" cat="gas" img="assets/images/produk dan layanan/Acetylene produk.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Mixed Gases"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/gambar mixed gases.jpg" alt={t("Mixed Gases")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Mixed Gases</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Campuran gas dengan komposisi tertentu: ArO, ArCO, Arnitro, ArHidro, ArHeli, N2O2, N2CO2, dan OCO.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Mixed Gases" cat="gas" img="assets/images/produk dan layanan/gambar mixed gases.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Special Gases"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-5xl"><i className="fa-solid fa-flask" /></div>
                    <CImg src="assets/images/produk dan layanan/gambar special gases.jpg" alt={t("Special Gases")} removeOnError className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Special Gases</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed"><T>Helium (He), Hidrogen (H2), Nitrous Oxide (N2O), dan Karbon Monoksida (CO).</T></p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Special Gases" cat="gas" img="assets/images/produk dan layanan/gambar special gases.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Amonia (NH3)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/gambar nh3.jpg" alt={t("Amonia")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Amonia (NH3)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed"><T>Gas amonia (NH3) dalam silinder, tersedia ukuran 50 kg, 55 kg, dan 60 kg.</T></p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Amonia (NH3)" cat="gas" img="assets/images/produk dan layanan/gambar nh3.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|LPG"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/produk lpg.jpg" alt={t("LPG")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>LPG</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Pasokan gas bahan bakar cair (Propana-Butana) berkualitas stabil untuk kebutuhan dapur komersial hotel/resto, pemanas oven industri, dan boiler.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="LPG" cat="gas" img="assets/images/produk dan layanan/produk lpg.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|VGL"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-44 rounded-sm overflow-hidden mb-4 bg-slate-900 relative">
                    <CImg src="assets/images/produk dan layanan/showcase vgl.jpg" alt={t("VGL (Vessel Gas Liquid)")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center justify-between" />
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>VGL</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Vessel Gas Liquid (VGL) adalah tabung kriogenik modern untuk menyimpan gas industri cair (O2, N2, Ar, CO2). Berkat isolasi vakum tinggi, satu tabung VGL mampu menggantikan hingga 22 tabung gas konvensional, sehingga jauh lebih hemat ruang, aman, dan efisien untuk operasional industri Anda.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="VGL" cat="gas" img="assets/images/produk dan layanan/showcase vgl.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
            </div>
          </section>
          <section id="section-services" className="product-category-section space-y-16" data-category="services">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>Layanan Profesional</T></h2>
              <div className="w-12 h-0.5 bg-sky-500 mx-auto" />
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <T>Dukungan operasional menyeluruh dari stasiun pengisian mandiri, armada pengiriman terjadwal, hingga instalasi jalur pipa sentral.</T>
              </p>
            </div>
            <div className="space-y-12">
              <Card sig="products.html|Filling Station"><div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-slate-50 border border-slate-200 rounded-sm p-6 sm:p-10 shadow-sm">
                <div className="lg:col-span-5 h-64 sm:h-72 rounded-sm overflow-hidden bg-slate-900">
                  <CImg src="assets/images/produk dan layanan/filling station produk.jpeg" alt={t("Filling Station Safe N Lock")} className="w-full h-full object-cover" />
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="font-luxury-serif text-2xl font-bold text-navy-900"><T>Filling Station</T></h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <T>Fasilitas pengisian otomatis berkapasitas besar di Kawasan Industri Safe N Lock Blok K Sidoarjo. Melayani isi ulang O2, N2, Argon, dan CO2 dengan manifold presisi tinggi, pembersihan tabung vakum, dan pemeriksaan kebocoran menyeluruh sebelum distribusi.</T>
                  </p>
                  <div className="pt-2 flex items-center gap-6 text-xs text-slate-500 font-mono" />
                  <div className="pt-2">
                    <OrderButton title="Filling Station" cat="service" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-navy-900"><span><T>Jadwalkan Pengisian</T></span>{" "}<span><T>→</T></span></OrderButton>
                  </div>
                </div>
              </div></Card>
              <Card sig="products.html|Delivery Service"><div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-slate-50 border border-slate-200 rounded-sm p-6 sm:p-10 shadow-sm">
                <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
                  <h3 className="font-luxury-serif text-2xl font-bold text-navy-900"><T>Delivery Service</T></h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <T>Armada pengiriman khusus gas bertekanan. Melayani jadwal pasokan rutin ke rumah sakit, pabrik, bengkel, serta pengantaran tabung medis langsung ke rumah (homecare) di Surabaya, Sidoarjo, Gresik, Pasuruan, Mojokerto, dan kota sekitarnya.</T>
                  </p>
                  <div className="pt-2 flex items-center gap-6 text-xs text-slate-500 font-mono" />
                  <div className="pt-2">
                    <OrderButton title="Delivery Service" cat="service" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-navy-900"><span><T>Pesan Antar Terjadwal</T></span>{" "}<span><T>→</T></span></OrderButton>
                  </div>
                </div>
                <div className="lg:col-span-5 h-64 sm:h-72 rounded-sm overflow-hidden bg-slate-900 order-1 lg:order-2">
                  <CImg src="assets/images/produk dan layanan/layanan delivery.jpg" alt={t("Armada Pengiriman PT Candi Oxygen")} className="w-full h-full object-cover" />
                </div>
              </div></Card>
              <Card sig="products.html|Gas Piping System Sentral"><div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card sig="products.html|Gas Piping System Sentral#2"><div className="bg-slate-50 border border-slate-200 rounded-sm p-8 space-y-4 shadow-sm hover:border-sky-500 transition-all">
                  <div className="h-48 rounded-sm overflow-hidden bg-slate-900 mb-4">
                    <CImg src="assets/images/produk dan layanan/gas piping system layanan.jpg" alt={t("Instalasi Pemipaan Gas Medis")} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900"><T>Gas Piping System Sentral</T></h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <T>Desain, rekayasa jalur, dan instalasi brazing pipa tembaga medis degreased untuk ruang operasi RS, ICU, dan klinik, serta jalur pipa stainless manifold pabrik industri.</T>
                  </p>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                    <OrderButton title="Gas Piping System Sentral" cat="service" img="assets/images/produk dan layanan/gas piping system layanan.jpg" className="font-bold text-sky-600 hover:text-navy-900"><T>Survei Lapangan →</T></OrderButton>
                  </div>
                </div></Card>
                <Card sig="products.html|Purging Pipelines with Nitrogen"><div className="bg-slate-50 border border-slate-200 rounded-sm p-8 space-y-4 shadow-sm hover:border-sky-500 transition-all">
                  <div className="h-48 rounded-sm overflow-hidden bg-slate-900 mb-4">
                    <CImg src="assets/images/produk dan layanan/purging pipeline layanan.jpg" alt={t("Purging Pipelines with Nitrogen")} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900"><T>Purging Pipelines with Nitrogen</T></h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <T>Layanan pengurasan pipa gas/minyak menggunakan Nitrogen kering bertekanan tinggi untuk mengeliminasi uap hidrokarbon, kelembaban, dan oksigen sebelum komisioning.</T>
                  </p>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                    <OrderButton title="Purging Pipelines with Nitrogen" cat="service" img="assets/images/produk dan layanan/purging pipeline layanan.jpg" className="font-bold text-sky-600 hover:text-navy-900"><T>Konsultasi Purging →</T></OrderButton>
                  </div>
                </div></Card>
              </div></Card>
              <Card sig={"products.html|Spare Parts & Komponen"}><div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card sig={"products.html|Spare Parts & Komponen#2"}><div className="p-8 bg-slate-50 border border-slate-200 rounded-sm space-y-3">
                  <h4 className="font-luxury-serif text-lg font-bold text-navy-900"><T>{"Spare Parts & Komponen"}</T></h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <T>Penyediaan pigtail tembaga fleksibel, katup valve kuningan tempa, seal PTFE tahan tekanan, dan pressure gauge presisi bersertifikat.</T>
                  </p>
                  <OrderButton title={"Spare Parts & Komponen"} cat="service" className="inline-block text-xs font-bold text-sky-600 hover:text-navy-900 pt-1"><T>Minta Daftar Komponen →</T></OrderButton>
                </div></Card>
                <Card sig="products.html|Maintenance Tabung"><div className="p-8 bg-slate-50 border border-slate-200 rounded-sm space-y-3">
                  <h4 className="font-luxury-serif text-lg font-bold text-navy-900"><T>Maintenance Tabung</T></h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <T>Pembersihan kerak internal tabung, pengecatan kode warna standar, dan perpanjangan izin bejana tekan.</T>
                  </p>
                  <OrderButton title="Maintenance Tabung" cat="service" className="inline-block text-xs font-bold text-sky-600 hover:text-navy-900 pt-1"><T>Jadwalkan Maintenance →</T></OrderButton>
                </div></Card>
              </div></Card>
            </div>
          </section>
          <section id="section-equipment" className="product-category-section space-y-12" data-category="equipment">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>{"Perlengkapan Gas & Bejana Tekan"}</T></h2>
              <div className="w-12 h-0.5 bg-sky-500 mx-auto" />
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <T>Valve, dewar, regulator, tabung gas seamless, cradle, serta perlengkapan gas medis: flowmeter oksigen, gas outlet panel, bed head panel, humidifier bottle, dan alarm gas medis.</T>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card sig="products.html|Valve Tabung"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200">
                    <CImg src="assets/images/produk dan layanan/perlengkapan valve.jpg" alt={t("Valve Gas")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Valve Tabung</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Katup silinder gas tekanan tinggi tahan hingga 300 Bar dengan pengaman bursting disc.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Valve Tabung" cat="equipment" img="assets/images/produk dan layanan/perlengkapan valve.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Cryogenic Dewars"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200">
                    <CImg src="assets/images/produk dan layanan/gambar dewars.jpg" alt={t("Cryogenic Dewars")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Cryogenic Dewars</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Bejana vakum cair suhu ekstrem untuk penyimpanan dan transportasi Nitrogen, Oksigen, atau Argon cair kapasitas 175L - 500L.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Cryogenic Dewars" cat="equipment" img="assets/images/produk dan layanan/gambar dewars.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Cryogenic Regulator"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200">
                    <CImg src="assets/images/produk dan layanan/gambar cryogenic reg.jpg" alt={t("Cryogenic Regulator")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Cryogenic Regulator</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Regulator reduksi khusus aliran gas cair dengan pemanas elektrik internal untuk mencegah pembekuan uap pada sistem pipa gasifikasi.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Cryogenic Regulator" cat="equipment" img="assets/images/produk dan layanan/gambar cryogenic reg.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Cylinder (Tabung Gas)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200">
                    <CImg src="assets/images/produk dan layanan/gambar cylinder gas.jpg" alt={t("Cylinder Tabung")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Cylinder (Tabung Gas)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed"><T>Silinder baja tanpa sambungan, tersedia dalam ukuran 1m³, 2m³, 6m³, 7m³, dan 10m³.</T></p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Cylinder (Tabung Gas)" cat="equipment" img="assets/images/produk dan layanan/gambar cylinder gas.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Regulator Gas"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200">
                    <CImg src="assets/images/produk dan layanan/gambar reg gas.jpg" alt={t("Regulator Gas")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Regulator Gas</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed"><T>Regulator presisi untuk gas medis dan gas industri, berbahan kuningan tempa padat.</T></p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Regulator Gas" cat="equipment" img="assets/images/produk dan layanan/gambar reg gas.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Cradle (Rak Tabung)"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200">
                    <CImg src="assets/images/produk dan layanan/gambar craddle.jpg" alt={t("Cradle Rack")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Cradle (Rak Tabung)</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Rak manifold silinder tersambung sentral dengan lubang forklift untuk pasokan berkelanjutan volume tinggi, tersedia dalam ukuran 2x2, 2x3, 3x3, 3x4, dan 4x4.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Cradle (Rak Tabung)" cat="equipment" img="assets/images/produk dan layanan/gambar craddle.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Flowmeter Oksigen"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200 relative flex items-center justify-center text-slate-400 text-5xl">
                    <i className="fa-solid fa-gauge-high" />
                    {" "}
                    <CImg src="assets/images/produk dan layanan/gambar flowmeter oksigen.jpg" alt={t("Flowmeter Oksigen")} removeOnError className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Flowmeter Oksigen</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Pengukur dan pengatur aliran oksigen medis dalam liter per menit, dipasang pada outlet gas atau regulator tabung untuk terapi pernapasan pasien.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Flowmeter Oksigen" cat="equipment" img="assets/images/produk dan layanan/gambar flowmeter oksigen.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Gas Outlet Panel"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200 relative flex items-center justify-center text-slate-400 text-5xl">
                    <i className="fa-solid fa-plug" />
                    {" "}
                    <CImg src="assets/images/produk dan layanan/gambar gas outlet panel.jpg" alt={t("Gas Outlet Panel")} removeOnError className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Gas Outlet Panel</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Panel outlet gas medis untuk dinding atau bed head unit yang menyalurkan oksigen dan gas medis dari sistem pipa sentral ke ruang perawatan.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Gas Outlet Panel" cat="equipment" img="assets/images/produk dan layanan/gambar gas outlet panel.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Bed Head Panel"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200 relative flex items-center justify-center text-slate-400 text-5xl">
                    <i className="fa-solid fa-bed-pulse" />
                    {" "}
                    <CImg src="assets/images/produk dan layanan/gambar bed head panel.jpg" alt={t("Bed Head Panel")} removeOnError className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Bed Head Panel</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Panel terpadu di kepala tempat tidur pasien yang menyatukan outlet gas medis seperti oksigen, vakum, dan udara medis dalam satu unit di ruang perawatan.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Bed Head Panel" cat="equipment" img="assets/images/produk dan layanan/gambar bed head panel.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Humidifier Bottle"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200 relative flex items-center justify-center text-slate-400 text-5xl">
                    <i className="fa-solid fa-bottle-droplet" />
                    {" "}
                    <CImg src="assets/images/produk dan layanan/gambar humidifier bottle.jpg" alt={t("Humidifier Bottle")} removeOnError className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Humidifier Bottle</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Botol pelembap oksigen untuk melembapkan aliran gas medis sebelum dihirup pasien, agar saluran pernapasan tidak kering selama terapi.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Humidifier Bottle" cat="equipment" img="assets/images/produk dan layanan/gambar humidifier bottle.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
              <Card sig="products.html|Alarm Gas Medis"><div className="luxury-image-card bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between shadow-sm hover:border-sky-500 transition-all group">
                <div>
                  <div className="h-40 rounded-sm overflow-hidden mb-4 bg-slate-200 relative flex items-center justify-center text-slate-400 text-5xl">
                    <i className="fa-solid fa-bell" />
                    {" "}
                    <CImg src="assets/images/produk dan layanan/gambar alarm gas medis.jpg" alt={t("Alarm Gas Medis")} removeOnError className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mt-2"><T>Alarm Gas Medis</T></h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <T>Alarm tekanan gas medis dengan peringatan suara dan visual saat tekanan sistem pipa terlalu rendah atau tinggi, agar pasokan ke pasien tetap aman.</T>
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-5 flex justify-between items-center">
                  <OrderButton title="Alarm Gas Medis" cat="equipment" img="assets/images/produk dan layanan/gambar alarm gas medis.jpg" className="text-xs font-bold uppercase text-navy-900 hover:text-sky-600"><T>Pesan →</T></OrderButton>
                </div>
              </div></Card>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
