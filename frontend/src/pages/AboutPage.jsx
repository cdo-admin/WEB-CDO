import { T, TH, CImg, Card } from '../cms/components.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

export const meta = { page: "about.html", title: "Tentang Kami | PT. Candi Oxygen", description: "Profil resmi, visi misi verbatim, sejarah panjang sejak tahun 1980, dan komitmen PT. Candi Oxygen sebagai industri supplier gas berkualitas tinggi di Safe N Lock Sidoarjo." };

export default function AboutPage() {
  const t = useT();
  return (
    <>
      <section className="relative w-full h-[90vh] min-h-[560px] overflow-hidden bg-navy-950 flex items-end">
        <CImg src="assets/images/about/hero about.jpeg" alt={t("Fasilitas Pengisian Gas PT Candi Oxygen Sidoarjo")} className="absolute inset-0 w-full h-full object-cover object-center opacity-60 filter contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        <div className="relative z-10 w-full pb-20 px-6 sm:px-12 lg:px-24 text-center">
          <p className="scroll-fade-heading text-xs sm:text-sm uppercase tracking-[0.4em] text-sky-300 font-semibold mb-3"><T>PT. CANDI OXYGEN</T></p>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"><T>Di Balik Setiap Tabung Bertekanan</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed mt-4">
            <T>Kisah dedikasi, presisi tinggi, dan komitmen tanpa kompromi dalam memasok gas industri dan medis berkualitas.</T>
          </p>
        </div>
      </section>
      <section className="bg-navy-950 text-white py-24 sm:py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold font-mono block mb-3"><T>{"SEJARAH & NILAI LUHUR"}</T></span>
              <h2 className="scroll-fade-heading font-luxury-serif text-2xl sm:text-4xl lg:text-5xl font-light text-white leading-snug"><T>Perjalanan PT. Candi Oxygen</T></h2>
            </div>
            <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              <p className="scroll-fade-heading">
                <T>Candi Oxygen adalah Industri yang bergerak di bidang Supplier Gas. Selama bertahun-tahun, PT. Candi Oxygen telah membangun reputasi dan kepercayaan kepada setiap pelanggan dengan memberikan layanan dan produk yang berkualitas tinggi.</T>
              </p>
              <p className="scroll-fade-heading">
                <T>Kami mempunyai tim yang ahli dalam bekerja keras untuk menyediakan setiap pelanggan kami layanan yang cepat dan terpercaya sesuai dengan yang mereka butuhkan, berpusat di kawasan industri terpadu Safe N Lock Sidoarjo.</T>
              </p>
              <p className="scroll-fade-heading">
                <TH k={"Berlokasi di kawasan Pergudangan & Industri \"Safe N Lock\" Blok K No. 1726-1729, Sidoarjo, fasilitas kami dirancang untuk mendukung pengisian mandiri, perawatan tabung, serta sistem distribusi gas berstandar keselamatan K3."}><T>{"Berlokasi di kawasan Pergudangan & Industri"}</T>{" "}<em><T>"Safe N Lock"</T></em>{" "}<T>Blok K No. 1726-1729, Sidoarjo, fasilitas kami dirancang untuk mendukung pengisian mandiri, perawatan tabung, serta sistem distribusi gas berstandar keselamatan K3.</T></TH>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="pt-6 lg:pt-0 lg:px-8 text-center lg:text-left first:pt-0 first:lg:pl-0">
              <p className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl font-bold text-navy-900"><T>1980</T></p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2"><T>Tahun Didirikan</T></p>
            </div>
            <div className="pt-6 lg:pt-0 lg:px-8 text-center lg:text-left">
              <p className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl font-bold text-navy-900"><T>45+</T></p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2"><T>Tahun Melayani</T></p>
            </div>
            <div className="pt-6 lg:pt-0 lg:px-8 text-center lg:text-left">
              <p className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl font-bold text-navy-900"><T>3560+</T></p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2"><T>Proyek Terselesaikan</T></p>
            </div>
            <div className="pt-6 lg:pt-0 lg:px-8 text-center lg:text-left">
              <p className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl font-bold text-navy-900"><T>100%</T></p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2"><T>Kepatuhan Standar K3</T></p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 sm:py-32 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-24">
            <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono"><T>LINIMASA PERJALANAN</T></span>
            <h2 className="scroll-fade-heading font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>{"Rekam Jejak & Tonggak Pencapaian"}</T></h2>
            <div className="w-12 h-0.5 bg-sky-500 mx-auto mt-2" />
          </div>
          <div className="journey-timeline-track relative">
            <Card sig={"about.html|Awal Mula Pendirian & Layanan Pasokan Gas"}><div className="timeline-row mb-16 relative flex flex-col md:flex-row items-start group">
              <div className="timeline-node-pin hidden md:block" />
              <div className="timeline-year-badge md:w-36 text-sky-600 font-mono font-bold text-lg md:text-xl md:text-right pr-8"><T>1980</T></div>
              <div className="timeline-card-hover flex-1 bg-white p-8 rounded-sm border border-slate-200 shadow-sm transition-all duration-300">
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mb-2"><T>{"Awal Mula Pendirian & Layanan Pasokan Gas"}</T></h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  <T>Memulai komitmen melayani kebutuhan gas industri untuk bengkel fabrikasi dan pengelasan serta oksigen medis untuk pasien dan klinik di Jawa Timur dengan armada awal dan integritas layanan prima.</T>
                </p>
              </div>
            </div></Card>
            <Card sig="about.html|Ekspansi Fasilitas Terpadu di Safe N Lock Sidoarjo"><div className="timeline-row mb-16 relative flex flex-col md:flex-row items-start group">
              <div className="timeline-node-pin hidden md:block" />
              <div className="timeline-year-badge md:w-36 text-sky-600 font-mono font-bold text-lg md:text-xl md:text-right pr-8"><T>2005</T></div>
              <div className="timeline-card-hover flex-1 bg-white p-8 rounded-sm border border-slate-200 shadow-sm transition-all duration-300">
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mb-2"><T>Ekspansi Fasilitas Terpadu di Safe N Lock Sidoarjo</T></h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  <T>{"Menyatukan operasional ke Pergudangan & Industri \"Safe N Lock\" Blok K No. 1726-1729, Jl. Lingkar Timur KM 5.5 Sidoarjo, guna mempercepat akses logistik dan integrasi rantai pasok Jawa Timur."}</T>
                </p>
              </div>
            </div></Card>
            <Card sig={"about.html|Perawatan Tabung & Sertifikasi K3"}><div className="timeline-row mb-16 relative flex flex-col md:flex-row items-start group">
              <div className="timeline-node-pin hidden md:block" />
              <div className="timeline-year-badge md:w-36 text-sky-600 font-mono font-bold text-lg md:text-xl md:text-right pr-8"><T>2014</T></div>
              <div className="timeline-card-hover flex-1 bg-white p-8 rounded-sm border border-slate-200 shadow-sm transition-all duration-300">
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mb-2"><T>{"Perawatan Tabung & Sertifikasi K3"}</T></h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  <T>Menerapkan perawatan tabung berkala, inspeksi visual ultrasonik tabung, serta sertifikasi keselamatan kerja K3 bejana bertekanan bekerjasama dengan dinas ketenagakerjaan.</T>
                </p>
              </div>
            </div></Card>
            <Card sig={"about.html|Digitalisasi Filling Station & Layanan Pipa Sentral"}><div className="timeline-row mb-16 relative flex flex-col md:flex-row items-start group">
              <div className="timeline-node-pin hidden md:block" />
              <div className="timeline-year-badge md:w-36 text-sky-600 font-mono font-bold text-lg md:text-xl md:text-right pr-8"><T>2020</T></div>
              <div className="timeline-card-hover flex-1 bg-white p-8 rounded-sm border border-slate-200 shadow-sm transition-all duration-300">
                <h3 className="font-luxury-serif text-xl font-bold text-navy-900 mb-2"><T>{"Digitalisasi Filling Station & Layanan Pipa Sentral"}</T></h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  <T>Mengadopsi stasiun pengisian otomatis modern untuk O2, N2, Argon, CO2, serta pembentukan divisi rekayasa instalasi gas piping system dan Nitrogen purging pipa industri.</T>
                </p>
              </div>
            </div></Card>
            <div className="timeline-row relative flex flex-col md:flex-row items-start group">
              <div className="timeline-node-pin hidden md:block" />
              <div className="timeline-year-badge md:w-36 text-sky-600 font-mono font-bold text-lg md:text-xl md:text-right pr-8"><T>HARI INI</T></div>
              <div className="timeline-card-hover flex-1 bg-navy-950 text-white p-8 rounded-sm border border-sky-500/30 shadow-luxury-md transition-all duration-300">
                <span className="text-[10px] uppercase font-mono tracking-widest text-sky-400 font-bold block mb-1"><T>KINI • PT. CANDI OXYGEN</T></span>
                <h3 className="font-luxury-serif text-xl font-bold text-white mb-2"><T>Pilar Utama Rantai Pasok Gas Jawa Timur</T></h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  <T>Sebagai PT. Candi Oxygen, kami terus memperkuat komitmen menjaga kemurnian gas tertinggi dan keandalan armada pengiriman ke seluruh penjuru rumah sakit dan pabrik di Jawa Timur.</T>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 sm:py-32 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sm:mb-20">
            <h2 className="scroll-fade-heading font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>{"Visi & Misi Kami"}</T></h2>
            <div className="w-12 h-0.5 bg-sky-500 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="p-8 sm:p-12 bg-slate-50 border border-slate-200 rounded-sm flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-navy-900 mb-6"><T>Visi Perusahaan</T></h3>
                <blockquote className="text-slate-700 text-sm sm:text-base leading-relaxed italic border-l-2 border-sky-500 pl-4 my-4">
                  <T>"Menjadi perusahaan penyedia gas dan layanan terkait yang terdepan, terpercaya, dan berkelanjutan di Indonesia dengan mengutamakan kepuasan pelanggan, kualitas produk, keselamatan kerja, serta inovasi."</T>
                </blockquote>
              </div>
              <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 font-mono"><T>{"Pedoman Mutu & Keberlanjutan Sejak 1980"}</T></div>
            </div>
            <div className="p-8 sm:p-12 bg-navy-950 text-white rounded-sm border border-navy-900 flex flex-col justify-between shadow-luxury-md">
              <div>
                <h3 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-white mb-6"><T>Misi Perusahaan</T></h3>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-300 font-light">
                  <li className="flex items-start gap-3">
                    <span className="text-sky-400 font-bold font-mono"><T>1.</T></span>
                    {" "}
                    <span>
                      <T>Menyediakan produk gas berkualitas tinggi dan layanan terbaik yang memenuhi standar industri dan keselamatan kerja.</T>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-sky-400 font-bold font-mono"><T>2.</T></span>
                    {" "}
                    <span>
                      <T>Mengembangkan jaringan distribusi yang efisien dan andal guna memastikan ketersediaan pasokan gas bagi pelanggan.</T>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-sky-400 font-bold font-mono"><T>3.</T></span>
                    {" "}
                    <span>
                      <T>Menerapkan standar keselamatan, kesehatan kerja, dan lingkungan (K3L) yang ketat dalam setiap kegiatan operasional.</T>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-sky-400 font-bold font-mono"><T>4.</T></span>
                    {" "}
                    <span>
                      <T>Meningkatkan kompetensi sumber daya manusia serta memanfaatkan teknologi modern untuk mendukung pertumbuhan bisnis.</T>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-sky-400 font-bold font-mono"><T>5.</T></span>
                    {" "}
                    <span>
                      <T>Membangun hubungan kemitraan yang saling menguntungkan dan berkelanjutan dengan seluruh pemangku kepentingan.</T>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-white/10 text-xs text-sky-300 font-mono mt-6"><T>Komitmen Operasional Terpadu Seluruh Karyawan</T></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
