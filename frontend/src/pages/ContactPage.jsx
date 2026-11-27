import { useContactForm, useReviewForm } from '../components/ContactForms.jsx';
import PhoneInput from '../components/PhoneInput.jsx';
import { T, CImg, CLink, Card } from '../cms/components.jsx';
import { useT } from '../i18n/i18n.js';
import CandiMap from '../components/CandiMap.jsx';

export const meta = { page: "contact.html", title: "Kontak & Lokasi Markas | PT. Candi Oxygen", description: "Hubungi kantor pusat & stasiun pengisian gas PT. Candi Oxygen di Kawasan Industri Safe N Lock Sidoarjo. Layanan pasokan gas industri & medis." };

export default function ContactPage() {
  const t = useT();
  const onContact = useContactForm();
  const review = useReviewForm();
  return (
    <>
      <section className="bg-navy-950 text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CImg src="assets/images/kontak lokasi/kontak lokasi cdo.jpeg" alt={t("Kantor Pusat PT Candi Oxygen Safe N Lock Sidoarjo")} className="w-full h-full object-cover opacity-90 filter contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-sky-400" />
            {" "}
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold"><T>{"Direktori & Layanan Pelanggan"}</T></span>
            {" "}
            <span className="h-px w-8 bg-sky-400" />
          </div>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white"><T>{"Kontak Markas & Lokasi Distribusi"}</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            <T>Informasi alamat, jalur kontak, dan lokasi, serta tinggalkan review atau kritik dan saran untuk mengembangkan layanan kami.</T>
          </p>
        </div>
      </section>
      <div className="bg-sky-50 border-b border-sky-100 py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-sky-600" />
            {" "}
            <span>
              <T>Membutuhkan kalkulasi harga khusus untuk pengadaan gas industri, tabung medis, atau instalasi pemipaan di Jawa Timur?</T>
            </span>
          </div>
          <CLink href="quote.html" className="font-bold text-sky-600 hover:text-navy-900 underline uppercase tracking-wider"><T>Buka Formulir Ajukan Penawaran Resmi (RFQ) →</T></CLink>
        </div>
      </div>
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-8 reveal-on-scroll">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold"><T>Layanan Pelanggan</T></span>
                <h2 className="scroll-fade-heading font-luxury-serif text-3xl font-light text-navy-900"><T>Kirimkan Pesan atau Pertanyaan</T></h2>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  <T>Silakan kirimkan pertanyaan seputar layanan pengiriman khusus Jawa Timur, jadwal pengisian di Safe N Lock, atau konsultasi kebutuhan gas Anda.</T>
                </p>
              </div>
              <form id="contact-form" className="space-y-5 text-xs" onSubmit={onContact}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Nama Lengkap *</T></label>
                    {" "}
                    <input type="text" id="fullName" required placeholder={t("Ir. Hendra Prasetyo")} className="form-input-luxury" />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Alamat Email *</T></label>
                    {" "}
                    <input type="email" id="email" required placeholder={t("hendra@perusahaan.co.id")} className="form-input-luxury" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Nomor Telepon / WhatsApp *</T></label>
                    {" "}
                    <PhoneInput id="phone" required placeholder={t("+62 811-xxxx-xxxx")} className="form-input-luxury" />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Nama Usaha / Pribadi</T></label>
                    {" "}
                    <input type="text" id="company" placeholder={t("PT / Bengkel / Rumah Tangga")} className="form-input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Subjek Pesan *</T></label>
                  {" "}
                  <select id="subject" required className="form-input-luxury text-slate-700" defaultValue="">
                    <option value="" disabled>{t("Pilih Keperluan...")}</option>
                    <option value={"Informasi Pasokan Gas Medis & Homecare"}>{t("Informasi Pasokan Gas Medis & Homecare")}</option>
                    <option value="Jadwal Delivery Service">{t("Jadwal Delivery Service")}</option>
                    <option value="Informasi Filling Station Safe N Lock Sidoarjo">{t("Informasi Filling Station Safe N Lock Sidoarjo")}</option>
                    <option value={"Konsultasi Instalasi Pemipaan Gas & Maintenance"}>{t("Konsultasi Instalasi Pemipaan Gas & Maintenance")}</option>
                    <option value="Pertanyaan Umum">{t("Pertanyaan Umum")}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Pesan / Pertanyaan Anda *</T></label>
                  <textarea id="message" required rows="5" placeholder={t("Tuliskan pesan Anda secara jelas...")} className="form-input-luxury" />
                </div>
                <div>
                  <button type="submit" className="btn-luxury-primary w-full py-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-luxury-md border border-navy-900 transition-all flex items-center justify-center gap-3">
                    <span><T>Kirimkan Pesan Kontak</T></span>
                    {" "}
                    <i className="fa-solid fa-paper-plane text-sky-400 text-xs" />
                  </button>
                </div>
              </form>
              <div id="review" className="pt-10 mt-2 border-t border-slate-200 space-y-5 scroll-mt-28">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold"><T>{"Review & Masukan"}</T></span>
                  <h2 className="scroll-fade-heading font-luxury-serif text-3xl font-light text-navy-900"><T>Puas Dengan Pelayanan Kami?</T></h2>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    <T>Silahkan tinggalkan review atau kritik dan saran, tim kami akan menerima dan membacanya</T>
                  </p>
                </div>
                <form id="review-form" className="space-y-5 text-xs" onSubmit={review.submit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Nama *</T></label>
                      {" "}
                      <input type="text" id="reviewName" required maxLength="80" placeholder={t("Nama Anda")} className="form-input-luxury" />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Perusahaan / Instansi</T></label>
                      {" "}
                      <input type="text" id="reviewCompany" maxLength="80" placeholder={t("Opsional")} className="form-input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Penilaian Anda *</T></label>
                    <div className="flex items-center gap-1 text-3xl" role="group" aria-label={t("Penilaian 1 sampai 5 bintang")}>
                      <review.Stars />
                    </div>
                    <input type="hidden" id="reviewRating" value={review.rating || ""} readOnly />
                    <p id="reviewRatingErr" className={(review.err ? "" : "hidden ") + "text-[11px] font-semibold text-red-600 mt-1"} role="alert"><T>Pilih jumlah bintang terlebih dahulu.</T></p>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Review, Kritik, atau Saran *</T></label>
                    <textarea id="reviewMessage" required rows="5" maxLength="2000" placeholder={t("Ceritakan pengalaman Anda atau masukan untuk kami...")} className="form-input-luxury" />
                  </div>
                  <button type="submit" disabled={review.busy} className="btn-luxury-primary w-full py-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm shadow-luxury-md border border-navy-900 transition-all flex items-center justify-center gap-3">
                    <span>{review.busy ? review.sending : <T>Kirim Review</T>}</span>
                    {" "}
                    <i className="fa-solid fa-paper-plane text-sky-400 text-xs" />
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
              <div className="p-8 rounded-sm bg-navy-950 text-white border border-white/10 shadow-luxury-lg space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10" />
                <h3 className="font-luxury-serif text-2xl font-bold text-white"><T>{"Hotline Kantor & WhatsApp"}</T></h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <T>Tim ahli kami siap melayani kebutuhan pasokan gas industri dan medis berkualitas tinggi untuk mitra usaha di seluruh penjuru Jawa Timur.</T>
                </p>
                <div className="space-y-3 pt-2">
                  <CLink href="tel:+623199010315" className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm border border-white/20 transition-all">
                    <i className="fa-solid fa-phone text-sky-400" />
                    {" "}
                    <span><T>Telepon: (031) 990103 15 / 16</T></span>
                  </CLink>
                  {" "}
                  <CLink href="https://wa.me/628113739800" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-md">
                    <i className="fa-brands fa-whatsapp text-base" />
                    {" "}
                    <span><T>WhatsApp: +62 811-3739-800</T></span>
                  </CLink>
                </div>
              </div>
              <Card sig="contact.html|PT. Candi Oxygen Gases"><div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <CImg src="assets/images/logo.png" alt={t("Logo")} className="w-6 h-6 object-contain" />
                    <h4 className="font-luxury-serif font-bold text-navy-900 text-sm uppercase"><T>PT. Candi Oxygen Gases</T></h4>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    <T>{"Pergudangan & Industri \"Safe N Lock\" Blok K No. 1726-1729"}</T>
                    <br />
                    {" "}<T>Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul,</T>
                    <br />
                    {" "}<T>Sidoarjo, Jawa Timur 61232</T>
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-200 text-slate-600">
                  <p>
                    <i className="fa-solid fa-envelope text-sky-600 mr-2" />
                    {" "}
                    <CLink href="mailto:cdosidoarjo@gmail.com" className="text-navy-900 hover:text-sky-600"><T>cdosidoarjo@gmail.com</T></CLink>
                  </p>
                  <p>
                    <i className="fa-solid fa-clock text-sky-600 mr-2" />
                    {" "}<T>Operasional: Senin-Jumat (08:00-16:00) Sabtu (08:00-14:00 WIB)</T>
                  </p>
                </div>
                <div className="pt-2">
                  <CLink href="https://maps.app.goo.gl/PkMwwPr6fTNHs1Qb6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sky-600 hover:text-navy-900 font-semibold underline text-xs">
                    <span><T>Buka Petunjuk Arah di Google Maps</T></span>
                    {" "}
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                  </CLink>
                </div>
              </div></Card>
              <Card sig="contact.html|PT. Candi Sukses Abadi"><div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <CImg src="assets/images/logo.png" alt={t("Logo")} className="w-6 h-6 object-contain" />
                  <h4 className="font-luxury-serif font-bold text-navy-900 text-sm uppercase"><T>PT. Candi Sukses Abadi</T></h4>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    <T>Jl. Bypass Krian, Semawut, Balongbendo,</T>
                    <br />
                    {" "}<T>Kec. Balongbendo, Kabupaten Sidoarjo,</T>
                    <br />
                    {" "}<T>Jawa Timur 61263</T>
                  </p>
                </div>
                <div className="pt-2">
                  <CLink href={"https://www.google.com/maps/search/?api=1&query=Jl.+Bypass+Krian,+Semawut,+Balongbendo,+Sidoarjo+61263"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sky-600 hover:text-navy-900 font-semibold underline text-xs">
                    <span><T>Buka Petunjuk Arah di Google Maps</T></span>
                    {" "}
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                  </CLink>
                </div>
              </div></Card>
              <div className="p-6 bg-navy-900 text-white rounded-sm space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-sky-300 font-luxury-serif"><T>Saluran Resmi Media Sosial</T></h5>
                <p className="text-[11px] text-slate-300">
                  <T>Ikuti update kegiatan industri, edukasi keselamatan tabung gas, dan dokumentasi proyek kami:</T>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <CLink href="https://www.instagram.com/candioxygengases" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 rounded text-xs flex items-center gap-2 transition-all">
                    <i className="fa-brands fa-instagram text-sm" />
                    {" "}
                    <span><T>@candioxygengases</T></span>
                  </CLink>
                  {" "}
                  <CLink href="https://www.tiktok.com/@candioxygengases" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/10 hover:bg-black rounded text-xs flex items-center gap-2 transition-all"><i className="fa-brands fa-tiktok text-sm" />{" "}<span><T>TikTok</T></span></CLink>
                  {" "}
                  <CLink href="https://www.linkedin.com/company/pt-candi-oxygen-gases" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/10 hover:bg-[#0A66C2] rounded text-xs flex items-center gap-2 transition-all"><i className="fa-brands fa-linkedin-in text-sm" />{" "}<span><T>LinkedIn</T></span></CLink>
                  {" "}
                  <CLink href="https://wa.me/628113739800" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/10 hover:bg-emerald-600 rounded text-xs flex items-center gap-2 transition-all"><i className="fa-brands fa-whatsapp text-sm" />{" "}<span><T>WhatsApp</T></span></CLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold"><T>Peta Lokasi</T></span>
            <h2 className="scroll-fade-heading font-luxury-serif text-3xl sm:text-4xl font-light text-navy-900"><T>Lokasi Kami</T></h2>
          </div>
          <CandiMap />
        </div>
      </section>
    </>
  );
}
