// Peta Jawa Timur dengan pin lokasi perusahaan (Leaflet + OpenStreetMap, tanpa API key). Data di data/locations.js.
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { LOCATIONS, JATIM, PIN_COLORS } from '../data/locations.js';
import { useT } from '../i18n/I18nProvider.jsx';

const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pinSvg = (color) => '<svg class="cmap-pin" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg"><path d="M17 1C8.7 1 2 7.6 2 15.8 2 27 17 43 17 43s15-16 15-27.2C32 7.6 25.3 1 17 1z" fill="' + color + '" stroke="#fff" stroke-width="2"/><circle cx="17" cy="16" r="6" fill="#fff"/></svg>';

export default function CandiMap() {
  const t = useT();
  const view = useRef(null), map = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true, onResize;
    import('leaflet').then(({ default: L }) => {
      if (!alive || !view.current) return;
      const m = L.map(view.current, { scrollWheelZoom: false, minZoom: 7, maxZoom: 18, zoomSnap: 0.25, maxBounds: [[-9.6, 109.8], [-6.0, 115.4]] });
      map.current = m;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(m);
      const home = () => m.fitBounds(JATIM, { padding: [10, 10] });
      m._home = home; home();
      LOCATIONS.forEach((l) => {
        const icon = L.divIcon({ className: '', html: pinSvg(PIN_COLORS[l.id] || '#0284c7'), iconSize: [34, 44], iconAnchor: [17, 43], tooltipAnchor: [l.side === 'left' ? -14 : 14, -22] });
        const mk = L.marker([l.lat, l.lng], { icon, title: l.name, alt: l.name, keyboard: true, riseOnHover: true }).addTo(m);
        mk.bindTooltip(esc(l.name), { permanent: true, direction: l.side === 'left' ? 'left' : 'right', className: 'cmap-tip' });
        mk.on('click', () => window.open(l.url, '_blank', 'noopener'));
      });
      m.on('click', () => m.scrollWheelZoom.enable());
      view.current.addEventListener('mouseleave', () => m.scrollWheelZoom.disable());
      setTimeout(() => { if (alive) { m.invalidateSize(); home(); } }, 300);
      onResize = () => m.invalidateSize();
      window.addEventListener('resize', onResize);
    }).catch(() => alive && setFailed(true));
    return () => { alive = false; if (onResize) window.removeEventListener('resize', onResize); if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  if (failed) {
    return (
      <div className="cmap"><div className="cmap-fallback">
        {LOCATIONS.map((l) => (
          <div className="it" key={l.id}><b>{l.name}</b>{l.address}<br />
            <a className="cmap-btn pri" style={{ marginTop: '.7rem' }} target="_blank" rel="noopener noreferrer" href={l.url}><i className="fa-solid fa-location-dot" /> {t('Buka di Google Maps')}</a></div>
        ))}
      </div></div>
    );
  }
  return (
    <div className="cmap">
      <div className="cmap-view" ref={view} role="application" aria-label={t('Peta lokasi PT. Candi Oxygen di Jawa Timur')} />
      <div className="cmap-bar">
        {LOCATIONS.map((l) => (
          <button key={l.id} type="button" className="cmap-btn" onClick={() => map.current && map.current.flyTo([l.lat, l.lng], 15, { duration: 0.9 })}><i className="fa-solid fa-location-dot" /> {l.name}</button>
        ))}
        <button type="button" className="cmap-btn" onClick={() => map.current && map.current._home()}><i className="fa-solid fa-expand" /> {t('Lihat seluruh Jawa Timur')}</button>
        <span className="cmap-hint">{t('Klik pin untuk membuka Google Maps')}</span>
      </div>
    </div>
  );
}
