import OrderBuilder from '../components/OrderBuilder.jsx';
import { useQuoteSubmit } from '../components/useQuoteSubmit.js';
import PhoneInput from '../components/PhoneInput.jsx';
import { T, TH, CImg, CLink, Card } from '../cms/components.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

export const meta = { page: "quote.html", title: "Ajukan Penawaran Resmi (RFQ) | PT. Candi Oxygen", description: "Formulir resmi permohonan penawaran harga (RFQ) pasokan gas industri, gas medis, layanan servis, dan perlengkapan gas PT. Candi Oxygen sejak 1980 dengan sistem Dynamic Order Table." };

export default function QuotePage() {
  const t = useT();
  const quote = useQuoteSubmit();
  return (
    <>
      <section className="bg-navy-950 text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CImg src="assets/images/quote/hero quote.jpeg" className="w-full h-full object-cover opacity-95 filter contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-sky-400" />
            {" "}
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold"><T>Layanan Komersial Eksklusif</T></span>
            {" "}
            <span className="h-px w-8 bg-sky-400" />
          </div>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white"><T>Formulir Pemesanan</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            <T>Pilih paket gas industri, gas medis, layanan instalasi pipa, atau perlengkapan gas dengan sistem tabel pesanan multi-item yang dinamis dan terstruktur.</T>
          </p>
        </div>
      </section>
      <section className="py-20 sm:py-28 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 space-y-10 reveal-on-scroll">
              <div className="space-y-3 pb-6 border-b border-slate-200">
                <h2 className="scroll-fade-heading font-luxury-serif text-2xl sm:text-3xl font-light text-navy-900"><T>Formulir Pemesanan Terpadu</T></h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  <T>Tambahkan beberapa jenis gas, ukuran, layanan, atau perlengkapan sekaligus dalam satu pesanan. Pesanan dikirim lewat WhatsApp atau email, lalu tim kami akan menghubungi Anda untuk konfirmasi.</T>
                </p>
              </div>
              <form id="quote-form" className="space-y-10 text-xs" onSubmit={quote.submit}>
                <Card sig={"quote.html|1 Informasi Kontak & Entitas Pemohon * Wajib diisi"}><div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
                  <h4 className="font-luxury-serif font-bold text-navy-900 text-base uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-mono"><T>1</T></span>
                      {" "}<T>{"Informasi Kontak & Entitas Pemohon"}</T>
                    </span>
                    {" "}
                    <span className="text-[10px] text-slate-400 font-normal uppercase tracking-widest"><T>* Wajib diisi</T></span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Nama Lengkap / PIC *</T></label>
                      {" "}
                      <input type="text" id="quoteName" required placeholder={t("Contoh: Ir. Hendra Prasetyo")} className="form-input-luxury" />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Email Resmi Pengadaan *</T></label>
                      {" "}
                      <input type="email" id="quoteEmail" required placeholder={t("pengadaan@perusahaan.co.id")} className="form-input-luxury" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Nomor WhatsApp / Telepon *</T></label>
                      {" "}
                      <PhoneInput id="quotePhone" required placeholder={t("+62 811-xxxx-xxxx")} className="form-input-luxury" />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Nama Perusahaan / RS / Badan Usaha</T></label>
                      {" "}
                      <input type="text" id="quoteCompany" placeholder={t("PT Logam Mulia / RS Husada / Workshop")} className="form-input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Kategori Bidang Pemohon *</T></label>
                    {" "}
                    <select id="quoteClientType" required className="form-input-luxury text-slate-700">
                      <option value={"Industri Bisnis & Manufaktur"}>{t("Industri Bisnis & Manufaktur (Fabrikasi, Laser Cutting, Heavy Industry)")}</option>
                      <option value={"Rumah Sakit & Fasilitas Medis"}>{t("Rumah Sakit, Klinik & Fasilitas Layanan Medis")}</option>
                      <option value={"Laboratorium & Pusat Riset"}>{t("Laboratorium Analitik & Lembaga Riset Ilmiah")}</option>
                      <option value="Kebutuhan Rumah Tangga / Homecare">{t("Kebutuhan Rumah Tangga / Pasien Homecare Medis")}</option>
                      <option value={"Proyek Konstruksi & Pengelasan"}>{t("Proyek Konstruksi, Pengelasan & Pemanasan")}</option>
                      <option value="Lainnya">{t("Lainnya")}</option>
                    </select>
                  </div>
                </div></Card>
                <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <h4 className="font-luxury-serif font-bold text-navy-900 text-base uppercase tracking-wider flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-mono"><T>2</T></span>
                      {" "}<T>Susun Rincian Pesanan (Dynamic Order Builder)</T>
                    </h4>
                  </div>
                  <OrderBuilder />
                </div>
                <Card sig={"quote.html|3 Alamat Pengiriman & Rencana Distribusi"}><div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-slate-200 space-y-6">
                  <h4 className="font-luxury-serif font-bold text-navy-900 text-base uppercase tracking-wider flex items-center gap-3 pb-3 border-b border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-mono"><T>3</T></span>
                    {" "}<T>{"Alamat Pengiriman & Rencana Distribusi"}</T>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Nama PIC / Penanggung Jawab Lapangan *</T></label>
                      {" "}
                      <input type="text" id="shippingPIC" required placeholder={t("Contoh: Pak Budi (Kepala Gudang)")} className="form-input-luxury" />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Nomor Telepon / WhatsApp Lapangan *</T></label>
                      {" "}
                      <PhoneInput id="shippingPhone" required placeholder={t("+62 812-xxxx-xxxx")} className="form-input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Alamat Lengkap Lokasi Pengiriman *</T></label>
                    <textarea id="shippingAddress" required rows="3" placeholder={t("Masukkan nama jalan, nomor bangunan, RT/RW, kelurahan, kecamatan, dan patokan lokasi...")} className="form-input-luxury" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Kabupaten / Kota Tujuan Pengiriman *</T></label>
                      {" "}
                      <input type="text" id="quoteLocation" required placeholder={t("Contoh: Sidoarjo / Surabaya / Gresik / Pasuruan / Mojokerto")} className="form-input-luxury" />
                      {" "}
                      <span className="text-[10px] text-slate-400 mt-1 block"><T>Distribusi armada langsung dari Safe N Lock Blok K Sidoarjo ke seluruh Jawa Timur.</T></span>
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Frekuensi Kebutuhan / Estimasi Jadwal</T></label>
                      {" "}
                      <input type="text" id="quoteVolume" placeholder={t("Contoh: Kebutuhan Rutin Mingguan / Proyek 1 Bulan / Sekali Order")} className="form-input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5"><T>Catatan Khusus Pengiriman / Akses Bongkar Muat</T></label>
                    <textarea id="quoteNotes" rows="2" placeholder={t("Sebutkan jika ada persyaratan K3 khusus pabrik, jadwal jam penerimaan barang, atau perlunya tabung peminjaman rotasi...")} className="form-input-luxury" />
                  </div>
                </div></Card>
                <div className="pt-2">
                  <p className="text-[11px] text-slate-500 text-center mb-3">
                    <i className="fa-brands fa-whatsapp text-emerald-500 mr-1" />
                    <T>Setelah menekan tombol, WhatsApp akan terbuka berisi template pesanan Anda. Tinggal tekan</T>{" "}
                    <b><T>Kirim</T></b>
                    <T>. Atau kirim lewat email.</T>
                  </p>
                  <button type="submit" id="quoteSubmitBtn" disabled={quote.busy} className="btn-luxury-primary w-full py-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-luxury-md border border-navy-900 transition-all flex items-center justify-center gap-3">
                    <span>{quote.busy ? t("Memproses Permohonan...") : <T>Kirim Pesanan via WhatsApp</T>}</span>
                    {" "}
                    <i className="fa-brands fa-whatsapp text-emerald-400 text-base" />
                  </button>
                  {" "}
                  <button type="submit" id="quoteEmailBtn" disabled={quote.busy} className="w-full mt-3 py-3.5 bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold tracking-[0.2em] uppercase rounded-sm border border-navy-900 transition-all flex items-center justify-center gap-3">
                    <span><T>Kirim Pesanan via Email</T></span>
                    {" "}
                    <i className="fa-solid fa-envelope text-sky-600" />
                  </button>
                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center mt-3">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-halved text-emerald-500" />
                      {" "}<T>Data Terenkripsi Aman</T>
                    </span>
                    {" "}
                    <span><T>•</T></span>
                    {" "}
                    <span className="flex items-center gap-1.5"><i className="fa-solid fa-reply-all text-sky-500" />{" "}<T>Respon Cepat 1x24 Jam</T></span>
                    {" "}
                    <span><T>•</T></span>
                    {" "}
                    <span className="flex items-center gap-1.5"><i className="fa-solid fa-location-dot text-slate-500" />{" "}<T>Safe N Lock Sidoarjo</T></span>
                  </div>
                </div>
              </form>
            </div>
            <div className="lg:col-span-4 space-y-6 reveal-on-scroll">
              <div className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-4">
                <div className="bg-sky-50 text-sky-600 flex items-center justify-center text-xl" />
                <h4 className="font-luxury-serif font-bold text-navy-900 text-lg"><T>Kepercayaan Sejak 1980</T></h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <T>Selama bertahun-tahun, PT. Candi Oxygen telah membangun reputasi dan kepercayaan kepada setiap pelanggan dengan memberikan layanan dan produk yang berkualitas tinggi ke industri bisnis dan ke rumah Anda sejak tahun 1980.</T>
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700" />
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                <h5 className="font-bold text-navy-900 text-xs uppercase tracking-wider"><T>Perlu Diskusi Langsung?</T></h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <T>Jika Anda memerlukan konsultasi atau ingin datang langsung ke stasiun pengisian kami di Safe N Lock, silakan buka halaman kontak.</T>
                </p>
                <CLink href="contact.html" className="inline-flex items-center gap-2 text-xs uppercase font-bold text-sky-600 hover:text-navy-900 transition-colors pt-1">
                  <span><T>{"Buka Halaman Kontak & Lokasi"}</T></span>
                  {" "}
                  <i className="fa-solid fa-arrow-right-long" />
                </CLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
