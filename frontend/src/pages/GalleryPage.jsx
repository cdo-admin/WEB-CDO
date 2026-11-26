import { T, CImg } from '../cms/components.jsx';
import { useT } from '../i18n/I18nProvider.jsx';

export const meta = { page: "gallery.html", title: "Galeri Kegiatan | PT. Candi Oxygen", description: "Galeri kegiatan keluarga besar PT. Candi Oxygen: outing, lomba 17 Agustusan, buka bersama, dan momen kebersamaan lainnya." };

export default function GalleryPage() {
  const t = useT();
  return (
    <>
      <section className="bg-navy-950 text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CImg src={"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80"} alt={t("Galeri Kegiatan PT Candi Oxygen")} className="w-full h-full object-cover opacity-90 filter contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-sky-400" />
            {" "}
            <span className="text-xs uppercase tracking-[0.3em] text-sky-400 font-bold"><T>Keluarga Besar Candi Oxygen</T></span>
            {" "}
            <span className="h-px w-8 bg-sky-400" />
          </div>
          <h1 className="scroll-fade-heading font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white"><T>Galeri Kegiatan</T></h1>
          <p className="scroll-fade-heading text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed"><T>Keseruan dan kebersamaan tim PT. Candi Oxygen di luar pekerjaan sehari-hari.</T></p>
        </div>
      </section>
      <section className="py-20 bg-white min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <ActivityGallery />
        </div>
      </section>
    </>
  );
}
