/* ==========================================================================
   locations.js — Peta Jawa Timur dengan pin lokasi perusahaan (PT. Candi Oxygen)
   Cara mengubah / menambah lokasi: edit daftar LOCATIONS di bawah ini saja.
     lat, lng : koordinat (di Google Maps: klik kanan pada lokasi -> klik angka koordinat -> tersalin)
     url      : tujuan saat pin diklik (link Google Maps atau halaman profil Google Bisnis)
   Peta memakai Leaflet + peta dasar OpenStreetMap (gratis, tanpa API key).
   Pada halaman, cukup tulis:  <div data-candi-map></div>
   ========================================================================== */
(function () {
  'use strict';

  var LOCATIONS = [
    {
      id: 'oxygen',
      name: 'PT. Candi Oxygen Gases',
      address: 'Pergudangan & Industri "Safe N Lock" Blok K No. 1726-1729, Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul, Sidoarjo, Jawa Timur 61232',
      lat: -7.4626228, lng: 112.7480059,                       // titik pasti dari Google Maps
      url: 'https://maps.app.goo.gl/PkMwwPr6fTNHs1Qb6',
      side: 'right'
    },
    {
      id: 'sukses',
      name: 'PT. Candi Sukses Abadi',
      address: 'Jl. Bypass Krian, Semawut, Balongbendo, Kec. Balongbendo, Kabupaten Sidoarjo, Jawa Timur 61263',
      lat: -7.4790, lng: 112.5900,                              // PERKIRAAN. Sesuaikan dengan titik pasti dari Google Maps
      url: 'https://maps.app.goo.gl/12P91W1nhxMzChZS9',
      side: 'left'
    }
  ];
  var JATIM = [[-8.85, 111.0], [-6.8, 114.45]];                 // batas tampilan Jawa Timur
  var LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
  var LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';

  function T(s) { return window.getLanguage && window.getLanguage() === 'en' && window.t ? window.t(s) : s; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var css = document.createElement('style');
  css.textContent =
    '.cmap{border:1px solid #e2e8f0;border-radius:.125rem;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,.08);background:#e2e8f0}' +
    '.cmap-view{height:440px;width:100%;position:relative;z-index:0}' +
    '@media(max-width:640px){.cmap-view{height:340px}}' +
    '.cmap-bar{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;padding:.75rem;background:#fff;border-top:1px solid #e2e8f0;font-family:Roboto,sans-serif}' +
    '.cmap-btn{display:inline-flex;align-items:center;gap:.4rem;border:1px solid #0A192F;background:#fff;color:#0A192F;border-radius:9999px;padding:.45rem .9rem;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-decoration:none}' +
    '.cmap-btn:hover{background:#0A192F;color:#fff}.cmap-btn.pri{background:#0A192F;color:#fff}.cmap-btn.pri:hover{background:#0284c7;border-color:#0284c7}' +
    '.cmap-hint{margin-left:auto;font-size:.68rem;color:#64748b}' +
    '.cmap-pin{width:34px;height:44px;filter:drop-shadow(0 4px 4px rgba(2,6,23,.35));cursor:pointer;transition:transform .15s}' +
    '.cmap-pin:hover{transform:translateY(-3px) scale(1.08)}' +
    '.cmap-tip.leaflet-tooltip{font:700 11px/1.3 Roboto,sans-serif;color:#0A192F;border:0;border-radius:4px;padding:5px 8px;box-shadow:0 4px 12px rgba(2,6,23,.25)}' +
    '.cmap-fallback{padding:1.25rem;display:grid;gap:.9rem;font-family:Roboto,sans-serif;background:#fff}' +
    '@media(min-width:640px){.cmap-fallback{grid-template-columns:1fr 1fr}}' +
    '.cmap-fallback .it{border:1px solid #e2e8f0;border-radius:.25rem;padding:1rem;font-size:.8rem;color:#475569}' +
    '.cmap-fallback b{display:block;color:#0A192F;margin-bottom:.25rem}';
  document.head.appendChild(css);

  function pinSvg(color) {
    return '<svg class="cmap-pin" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg"><path d="M17 1C8.7 1 2 7.6 2 15.8 2 27 17 43 17 43s15-16 15-27.2C32 7.6 25.3 1 17 1z" fill="' + color + '" stroke="#fff" stroke-width="2"/><circle cx="17" cy="16" r="6" fill="#fff"/></svg>';
  }
  var COLORS = { oxygen: '#0284c7', sukses: '#0A192F' };

  function barHtml() {
    return LOCATIONS.map(function (l) { return '<button type="button" class="cmap-btn" data-fly="' + l.id + '"><i class="fa-solid fa-location-dot"></i> ' + esc(l.name) + '</button>'; }).join('') +
      '<button type="button" class="cmap-btn" data-reset="1"><i class="fa-solid fa-expand"></i> Lihat seluruh Jawa Timur</button>' +
      '<span class="cmap-hint">Klik pin untuk membuka Google Maps</span>';
  }
  function fallback(box) {
    box.innerHTML = '<div class="cmap-fallback">' + LOCATIONS.map(function (l) {
      return '<div class="it"><b>' + esc(l.name) + '</b>' + esc(l.address) + '<br><a class="cmap-btn pri" style="margin-top:.7rem" target="_blank" rel="noopener noreferrer" href="' + esc(l.url) + '"><i class="fa-solid fa-location-dot"></i> Buka di Google Maps</a></div>';
    }).join('') + '</div>';
  }

  function build(box) {
    box.classList.add('cmap');
    box.innerHTML = '<div class="cmap-view" role="application" aria-label="Peta lokasi PT. Candi Oxygen di Jawa Timur"></div><div class="cmap-bar">' + barHtml() + '</div>';
    var L = window.L, view = box.querySelector('.cmap-view');
    var map = L.map(view, { scrollWheelZoom: false, minZoom: 7, maxZoom: 18, zoomSnap: 0.25, maxBounds: [[-9.6, 109.8], [-6.0, 115.4]] });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    function home() { map.fitBounds(JATIM, { padding: [10, 10] }); }
    home();
    var markers = {};
    LOCATIONS.forEach(function (l) {
      var icon = L.divIcon({ className: '', html: pinSvg(COLORS[l.id] || '#0284c7'), iconSize: [34, 44], iconAnchor: [17, 43], tooltipAnchor: [l.side === 'left' ? -14 : 14, -22] });
      var m = L.marker([l.lat, l.lng], { icon: icon, title: l.name, alt: l.name, keyboard: true, riseOnHover: true }).addTo(map);
      m.bindTooltip(esc(l.name), { permanent: true, direction: l.side === 'left' ? 'left' : 'right', className: 'cmap-tip' });
      m.on('click', function () { window.open(l.url, '_blank', 'noopener'); });
      markers[l.id] = m;
    });
    box.querySelector('.cmap-bar').addEventListener('click', function (e) {
      var f = e.target.closest('[data-fly]'), r = e.target.closest('[data-reset]');
      if (f) { var l = LOCATIONS.filter(function (x) { return x.id === f.getAttribute('data-fly'); })[0]; map.flyTo([l.lat, l.lng], 15, { duration: 0.9 }); }
      else if (r) home();
    });
    // geser/zoom dengan scroll hanya setelah peta diklik, agar tidak mengganggu scroll halaman
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    view.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });
    setTimeout(function () { map.invalidateSize(); home(); }, 300);
    window.addEventListener('resize', function () { map.invalidateSize(); });
  }

  function loadLeaflet(cb, fail) {
    if (window.L && window.L.map) return cb();
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = LEAFLET_CSS; document.head.appendChild(l);
    var s = document.createElement('script'); s.src = LEAFLET_JS; s.onload = cb; s.onerror = fail; document.head.appendChild(s);
  }

  function init() {
    var boxes = document.querySelectorAll('[data-candi-map]');
    if (!boxes.length) return;
    loadLeaflet(function () { boxes.forEach(build); }, function () { boxes.forEach(fallback); });
  }
  window.CandiLocations = LOCATIONS;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
