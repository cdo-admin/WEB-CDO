import { useState } from 'react';
import { ApplyButton, JobCard } from '../components/Career.jsx';
import { ApplyCtx, useJobs, useCareerSubmit } from '../components/careerData.js';
import PhoneInput from '../components/PhoneInput.jsx';
import { T, TH, CImg, Card } from '../cms/components.jsx';
import { useT } from '../i18n/i18n.js';

export const meta = { page: "career.html", title: "Karir & Peluang Profesional | PT. Candi Oxygen", description: "Peluang karir profesional di PT. Candi Oxygen. Supplier gas industri dan medis terkemuka sejak tahun 1980 di Jawa Timur." };

export default function CareerPage() {
  const t = useT();
  const jobs = useJobs();
  const noJobs = jobs.managed && !jobs.jobs.length;
  const [role, setRole] = useState(null);
  const open = (r) => { setRole(r); document.body.style.overflow = "hidden"; };
  const close = () => { setRole(null); document.body.style.overflow = ""; };
  const career = useCareerSubmit(close);
  return (
    <ApplyCtx.Provider value={open}>
      <section className="bg-navy-950 text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CImg src="assets/images/karir/hero karir cdo.jpg" alt={t("Tim Kerja PT Candi Oxygen")} className="w-full h-full object-cover opacity-80 filter contrast-150" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-sky-400" />
            {" "}
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold"><T>{"Peluang Karir & Talenta"}</T></span>
            {" "}
            <span className="h-px w-8 bg-sky-400" />
          </div>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white"><T>Bergabung Bersama PT. Candi Oxygen</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            <T>Kami mempunyai tim yang ahli dalam bekerja keras untuk menyediakan setiap pelanggan kami layanan yang cepat dan terpercaya.</T>
          </p>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold"><T>Formasi Profesional</T></span>
            <h2 className="scroll-fade-heading font-luxury-serif text-3xl font-light text-navy-900"><T>Posisi Aktif PT. Candi Oxygen</T></h2>
            <p className="text-slate-500 text-xs sm:text-sm"><T>{"Penempatan: Kawasan Industri & Pergudangan Safe N Lock Sidoarjo, Jawa Timur."}</T></p>
          </div>
          <div id="active-positions-container" className={"space-y-6" + (noJobs ? " hidden" : "")}>
            {jobs.managed ? jobs.jobs.map((j) => <JobCard key={j.id} j={j} />) : (
              <>
                <Card sig="career.html|Teknisi Stasiun Pengisian (Filling Station Operator)"><div className="p-8 bg-slate-50 rounded-sm border border-slate-200 shadow-luxury-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-sky-500 transition-colors">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-700 font-mono text-[11px] font-bold"><T>{"PABRIK & OPERASIONAL"}</T></span>
                      {" "}
                      <span className="text-xs text-slate-500">
                        <i className="fa-solid fa-location-dot mr-1 text-sky-600" />
                        {" "}<T>Safe N Lock Sidoarjo</T>
                      </span>
                    </div>
                    <h3 className="font-luxury-serif text-xl sm:text-2xl font-bold text-navy-900"><T>Teknisi Stasiun Pengisian (Filling Station Operator)</T></h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      <T>Mengoperasikan sistem manifold pengisian gas silinder Oksigen, Nitrogen, Argon, dan CO2, melakukan pengecekan visual kondisi tabung, serta memastikan prosedur keselamatan K3 bejana bertekanan terpenuhi.</T>
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                      <span><T>Status: Full-Time</T></span>
                      {" "}
                      <span><T>•</T></span>
                      {" "}
                      <span><T>Pendidikan: SMK/D3 Teknik Mesin/Elektro</T></span>
                    </div>
                  </div>
                  <ApplyButton className="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full shrink-0" role="Teknisi Filling Station Operator"><T>Lamar Posisi Ini</T></ApplyButton>
                </div></Card>
                <Card sig="career.html|Pengemudi Armada Pengiriman (Delivery Service Driver B1/B2)"><div className="p-8 bg-slate-50 rounded-sm border border-slate-200 shadow-luxury-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-sky-500 transition-colors">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono text-[11px] font-bold"><T>{"LOGISTIK & DISTRIBUSI"}</T></span>
                      {" "}
                      <span className="text-xs text-slate-500">
                        <i className="fa-solid fa-location-dot mr-1 text-sky-600" />
                        {" "}<T>Wilayah Jawa Timur (Base: Sidoarjo)</T>
                      </span>
                    </div>
                    <h3 className="font-luxury-serif text-xl sm:text-2xl font-bold text-navy-900"><T>Pengemudi Armada Pengiriman (Delivery Service Driver B1/B2)</T></h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      <T>Menghantarkan tabung gas industri dan tabung medis secara terjadwal dan aman ke klien rumah sakit, industri pabrik, bengkel, serta pengiriman langsung ke rumah (homecare) wilayah Jawa Timur.</T>
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                      <span><T>Status: Full-Time</T></span>
                      {" "}
                      <span><T>•</T></span>
                      {" "}
                      <span><T>Syarat: SIM B1 / B2 Umum Aktif</T></span>
                    </div>
                  </div>
                  <ApplyButton className="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full shrink-0" role="Delivery Service Driver Jawa Timur"><T>Lamar Posisi Ini</T></ApplyButton>
                </div></Card>
                <Card sig={"career.html|Teknisi Gas Piping System & Nitrogen Purging"}><div className="p-8 bg-slate-50 rounded-sm border border-slate-200 shadow-luxury-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-sky-500 transition-colors">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-700 font-mono text-[11px] font-bold"><T>REKAYASA PIPA</T></span>
                      {" "}
                      <span className="text-xs text-slate-500">
                        <i className="fa-solid fa-location-dot mr-1 text-sky-600" />
                        {" "}<T>Project Base Jawa Timur</T>
                      </span>
                    </div>
                    <h3 className="font-luxury-serif text-xl sm:text-2xl font-bold text-navy-900"><T>{"Teknisi Gas Piping System & Nitrogen Purging"}</T></h3>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      <T>Melakukan penyambungan brazing pipa tembaga medis RS, instalasi manifold gas sentral industri, serta prosedur pembersihan pipa (purging) dengan gas Nitrogen bertekanan tinggi.</T>
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                      <span><T>Status: Full-Time / Kontrak Proyek</T></span>
                      {" "}
                      <span><T>•</T></span>
                      {" "}
                      <span><T>Pengalaman: Min. 1 Tahun di Pemipaan</T></span>
                    </div>
                  </div>
                  <ApplyButton className="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full shrink-0" role={"Teknisi Gas Piping System & Purging"}><T>Lamar Posisi Ini</T></ApplyButton>
                </div></Card>
              </>
            )}
          </div>
          <div id="no-positions-container" className={(noJobs ? "" : "hidden ") + "p-12 bg-slate-50 border border-slate-200 rounded-sm text-center space-y-5"}>
            <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-2xl"><i className="fa-solid fa-briefcase" /></div>
            <h3 className="font-luxury-serif text-2xl font-light text-navy-900"><T>Saat Ini Belum Ada Lowongan Terbuka</T></h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              <TH k="Seluruh posisi operasional di PT. Candi Oxygen Safe N Lock saat ini sudah terisi. Namun, kami selalu terbuka untuk talenta unggul. Silakan kirimkan CV Anda ke Talent Pool kami, dan tim HRD kami akan menghubungi Anda saat posisi baru dibuka."><T>Seluruh posisi operasional di PT. Candi Oxygen Safe N Lock saat ini sudah terisi. Namun, kami selalu terbuka untuk talenta unggul. Silakan kirimkan CV Anda ke</T>{" "}<strong><T>Talent Pool</T></strong>{" "}<T>kami, dan tim HRD kami akan menghubungi Anda saat posisi baru dibuka.</T></TH>
            </p>
            <div className="pt-2">
              <ApplyButton className="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full shadow-luxury-sm" role="Talent Pool (Pendaftaran Terbuka)"><T>Kirim CV ke Talent Pool</T></ApplyButton>
            </div>
          </div>
        </div>
      </section>
      {role !== null && (
      <div id="career-modal" className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="bg-white rounded-sm shadow-2xl max-w-xl w-full p-8 border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-sky-600 font-bold font-mono"><T>PORTAL REKRUTMEN PT. CANDI OXYGEN</T></span>
              <h3 className="font-luxury-serif text-2xl font-bold text-navy-900 mt-1"><T>Formulir Lamaran Karir</T></h3>
              <p className="text-xs text-slate-500 mt-1">
                <T>Posisi Tujuan:</T>{" "}
                <span id="careerRoleTitle" className="font-semibold text-navy-900">{role}</span>
              </p>
            </div>
            <button id="close-career-modal" type="button" onClick={close} className="text-slate-400 hover:text-navy-900 p-2" aria-label={t("Tutup")}><i className="fa-solid fa-xmark text-xl" /></button>
          </div>
          <form id="career-form" className="mt-6 space-y-4 text-xs" onSubmit={career.submit}>
            <input type="hidden" id="careerPosition" name="position" value={role} readOnly />
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Nama Lengkap Sesuai KTP *</T></label>
              {" "}
              <input type="text" id="careerName" required placeholder={t("Nama Lengkap Anda")} className="form-input-luxury" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Alamat Email *</T></label>
                {" "}
                <input type="email" id="careerEmail" required placeholder={t("nama@email.com")} className="form-input-luxury" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Nomor WhatsApp Aktif *</T></label>
                {" "}
                <PhoneInput id="careerPhone" required placeholder={t("+62 811-xxxx-xxxx")} className="form-input-luxury" />
              </div>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>Tautan CV / Resume (Google Drive / Dropbox) *</T></label>
              {" "}
              <input type="url" id="careerPortfolio" required placeholder={t("https://drive.google.com/file/d/... (Pastikan akses diset ke Siapa Saja)")} className="form-input-luxury" />
              {" "}
              <span className="text-[10px] text-slate-400 mt-1 block"><T>Pastikan link Google Drive dapat dibuka oleh publik / tim rekrutmen kami.</T></span>
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1"><T>{"Ringkasan Pengalaman Kerja & Kualifikasi *"}</T></label>
              <textarea id="careerLetter" required rows="4" placeholder={t("Ceritakan riwayat kerja, keahlian khusus di bidang gas/teknik, atau sertifikasi yang Anda miliki...")} className="form-input-luxury" />
            </div>
            <div className="pt-2">
              <button type="submit" className="btn-luxury-primary w-full py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm shadow-luxury-md transition-all" disabled={career.busy}>{career.label || <T>Kirimkan Berkas Lamaran</T>}</button>
            </div>
          </form>
        </div>
      </div>
      )}
    </ApplyCtx.Provider>
  );
}
