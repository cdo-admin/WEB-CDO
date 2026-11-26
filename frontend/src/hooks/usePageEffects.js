// Animasi halaman (dulu di main.js): judul memudar saat di-scroll, elemen muncul saat terlihat,
// penghitung angka, dan efek hero ala Rolex di Beranda. Dijalankan setelah halaman tampil.
import { useEffect } from 'react';

export function usePageEffects(deps = []) {
  useEffect(() => {
    const cleanups = [];
    if ('IntersectionObserver' in window) {
      const headings = document.querySelectorAll('.scroll-fade-heading');
      const ho = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('heading-in-view', e.isIntersecting)), { threshold: 0.15, rootMargin: '-20px 0px -20px 0px' });
      headings.forEach((h) => ho.observe(h));
      cleanups.push(() => ho.disconnect());

      const rv = new IntersectionObserver((es) => es.forEach((e) => {
        const on = e.isIntersecting;
        e.target.classList.toggle('opacity-100', on); e.target.classList.toggle('translate-y-0', on);
        e.target.classList.toggle('opacity-0', !on); e.target.classList.toggle('translate-y-8', !on);
      }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal-on-scroll:not([data-cms-clone])').forEach((el) => {
        el.classList.add('transition-all', 'duration-800', 'ease-out', 'opacity-0', 'translate-y-8');
        rv.observe(el);
      });
      cleanups.push(() => rv.disconnect());

      const co = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const el = e.target, target = parseFloat(el.getAttribute('data-target')), dec = el.getAttribute('data-decimal') === 'true', start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / 2000, 1), v = target * (1 - Math.pow(1 - p, 4));
          el.textContent = p < 1 ? (dec ? v.toFixed(3) : Math.floor(v).toLocaleString()) : (dec ? target.toFixed(3) : target.toLocaleString());
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }), { threshold: 0.5 });
      document.querySelectorAll('.counter-val').forEach((c) => co.observe(c));
      cleanups.push(() => co.disconnect());
    }
    return () => cleanups.forEach((f) => f());
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Efek hero Beranda: foto memburam & membesar, lapisan gelap menebal, teks memudar ke atas. */
export function useHeroScroll() {
  useEffect(() => {
    const img = document.getElementById('rolex-hero-img'), ov = document.getElementById('rolex-hero-overlay');
    const content = document.getElementById('rolex-hero-content'), show = document.getElementById('rolex-vertical-showcase');
    if (!img) return undefined;
    const on = () => {
      const y = window.scrollY, p = Math.min(Math.max(y / Math.max(window.innerHeight * 0.7, 500), 0), 1);
      img.style.filter = `blur(${(p * 14).toFixed(1)}px)`;
      img.style.transform = `scale(${(1 + p * 0.07).toFixed(3)})`;
      if (ov) ov.style.opacity = (0.25 + p * 0.63).toFixed(2);
      if (content) { content.style.opacity = Math.max(1 - p * 1.6, 0).toFixed(2); content.style.transform = `translateY(${(p * -35).toFixed(1)}px)`; }
      if (show && y > 150) { show.classList.remove('opacity-0', 'translate-y-12'); show.classList.add('opacity-100', 'translate-y-0'); }
    };
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);
}
