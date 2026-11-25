/**
 * ==============================================================================
 * PT. CANDI OXYGEN - MAIN LUXURY INTERACTION CONTROLLER
 * Rolex & Omega Luxury Dynamic Animations, Scroll Fades, and Form Integrations
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveNavLink();
  initHeaderSearch();
  initDynamicOrderTable();
  initRolexHeroScroll();
  initScrollFadeHeadings();
  initScrollAnimations();
  initStatCounters();
  initForms();
  initModals();
  initPortfolioFilter();
  initProductsTabFilter();
  initEmergencyHotline();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & ROLEX-STYLE HEADER DYNAMICS
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-luxury-sm', 'border-b', 'border-slate-200/90');
        header.classList.remove('bg-transparent');
      } else {
        if (!header.dataset.solid) {
          header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-luxury-sm', 'border-b', 'border-slate-200/90');
          header.classList.add('bg-transparent');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile Menu Drawer
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        mobileMenu.classList.add('opacity-100');
        const drawer = mobileMenu.querySelector('.mobile-drawer-content');
        if (drawer) drawer.classList.remove('-translate-x-full');
      }, 10);
    });

    const closeMenu = () => {
      const drawer = mobileMenu.querySelector('.mobile-drawer-content');
      if (drawer) drawer.classList.add('-translate-x-full');
      mobileMenu.classList.remove('opacity-100');
      document.body.style.overflow = '';
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 350);
    };

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });
  }
}

/* --------------------------------------------------------------------------
   2. ROLEX-STYLE HERO SCROLL EFFECT (BLUR, DARKEN, REVEAL 3 VERTICAL CARDS)
   -------------------------------------------------------------------------- */
function initRolexHeroScroll() {
  const heroImage = document.getElementById('rolex-hero-img');
  const heroOverlay = document.getElementById('rolex-hero-overlay');
  const heroContent = document.getElementById('rolex-hero-content');
  const verticalShowcase = document.getElementById('rolex-vertical-showcase');

  if (!heroImage) return;

  const handleHeroScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(window.innerHeight * 0.7, 500);
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // 1. Blur from 0px to 16px
    const blurPx = (progress * 14).toFixed(1);
    // 2. Scale slightly from 1 to 1.07
    const scale = (1 + progress * 0.07).toFixed(3);
    heroImage.style.filter = `blur(${blurPx}px)`;
    heroImage.style.transform = `scale(${scale})`;

    // 3. Darken overlay from 0.25 to 0.88
    if (heroOverlay) {
      const darkOpacity = 0.25 + progress * 0.63;
      heroOverlay.style.opacity = darkOpacity.toFixed(2);
    }

    // 4. Hero center content smoothly dissolves and translates upwards
    if (heroContent) {
      const contentOpacity = Math.max(1 - progress * 1.6, 0);
      const contentY = (progress * -35).toFixed(1);
      heroContent.style.opacity = contentOpacity.toFixed(2);
      heroContent.style.transform = `translateY(${contentY}px)`;
    }

    // 5. Vertical showcase enters with crisp clarity
    if (verticalShowcase) {
      if (scrollY > 150) {
        verticalShowcase.classList.remove('opacity-0', 'translate-y-12');
        verticalShowcase.classList.add('opacity-100', 'translate-y-0');
      }
    }
  };

  window.addEventListener('scroll', handleHeroScroll, { passive: true });
  handleHeroScroll();
}

/* --------------------------------------------------------------------------
   3. OMEGA-STYLE ACTIVE NAV LINK DETECTION
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  // Halaman aktif dibaca dari alamat; tahan terhadap /products, /products/, /products.html dan ?utm=...
  // Prioritas: nama halaman yang ditulis di <body data-page="..."> (tidak terpengaruh bentuk alamat di hosting);
  // cadangan: dibaca dari alamat.
  let cur = (document.body.getAttribute('data-page') || '').trim();
  if (cur) { cur += '.html'; }
  else {
    cur = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
    if (cur.indexOf('.') < 0) cur += '.html'; // Netlify: /career -> career.html
  }

  // Gaya penanda dibuat di sini agar tidak bergantung pada style.css
  if (!document.getElementById('nav-here-style')) {
    const st = document.createElement('style');
    st.id = 'nav-here-style';
    st.textContent =
      '.nav-omega-link.nav-here{color:#0284c7!important;font-weight:700!important;padding-bottom:6px;' +
      'background:linear-gradient(#0284c7,#0284c7) no-repeat left bottom/100% 2px}' +
      '.nav-omega-link.nav-here::before,.nav-omega-link.nav-here::after{display:none!important}';
    document.head.appendChild(st);
  }

  document.querySelectorAll('.nav-omega-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split(/[?#]/)[0];
    const here = href === cur;
    link.classList.toggle('active', here);
    link.classList.toggle('active-omega', here);
    link.classList.toggle('nav-here', here);
    if (here) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
}

/* --------------------------------------------------------------------------
   3B. HEADER SEARCH SYSTEM WITH CATEGORIZED SUGGESTIONS
   -------------------------------------------------------------------------- */
const candiSearchCatalog = [
  // PRODUK GAS
  { id: 'oksigen-industri', keywords: 'oxygen industrial welding cutting laser oksigen industri', name: 'Oksigen (O2) Industri', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Oksigen WG / HP / UHP untuk pengelasan, pemotongan, dan laser cutting', tag: 'INDUSTRI', target: 'products.html#section-gases', specTitle: 'Oksigen (O2) Industri' },
  { id: 'oksigen-medis', keywords: 'oxygen medical hospital homecare oksigen medis', name: 'Oksigen (O2) Medis', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Oksigen medis untuk terapi pernapasan rumah sakit, klinik, dan homecare', tag: 'MEDIS', target: 'products.html#section-gases', specTitle: 'Oksigen (O2) Medis' },
  { id: 'nitrogen', keywords: 'nitrogen cryogenic inert purging', name: 'Nitrogen (N2)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Nitrogen cair kriogenik & gas kering tekanan tinggi untuk purging', tag: 'INERT & CRYOGENIC', target: 'products.html#section-gases', specTitle: 'Nitrogen (N2) High Purity' },
  { id: 'argon', keywords: 'argon welding tig mig', name: 'Argon (Ar)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Pelindung pengelasan presisi TIG/MIG & spektrometri laboratorium', tag: 'WELDING & LAB', target: 'products.html#section-gases', specTitle: 'Argon (Ar) Pure & UHP' },
  { id: 'asetilen', keywords: 'acetylene cutting brazing', name: 'Asetilen (C2H2)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Bahan bakar oxy-fuel cutting & brazing suhu nyala 3.100°C', tag: 'HIGH HEAT FLAME', target: 'products.html#section-gases', specTitle: 'Asetilen (C2H2) Dissolved Acetylene' },
  { id: 'co2', keywords: 'carbon dioxide food beverage', name: 'CO2 (Karbon Dioksida)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Food grade industri minuman berkarbonasi & pengelasan baja', tag: 'FOOD & WELDING', target: 'products.html#section-gases', specTitle: 'CO2 (Karbon Dioksida) Food & Industrial' },
  { id: 'mixed-gases', keywords: 'mixed gases blend', name: 'Mixed Gases (Gas Campuran)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'ArO, ArCO, Arnitro, ArHidro, ArHeli, N2O2, N2CO2, dan OCO', tag: 'GAS BLENDS', target: 'products.html#section-gases', specTitle: 'Mixed Gases (Gas Campuran Pengelasan)' },
  { id: 'special-gases', keywords: 'special gases ultra high purity calibration', name: 'Special Gases (Gas Spesial)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Helium, Hidrogen, Nitrous Oxide (N2O), Karbon Monoksida (CO)', tag: 'SPECIAL GASES', target: 'products.html#section-gases', specTitle: 'Special Gases (Ultra High Purity)' },
  { id: 'amonia', keywords: 'amonia ammonia nh3', name: 'Amonia (NH3)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Silinder amonia 50 kg, 55 kg, 60 kg', tag: 'AMMONIA', target: 'products.html#section-gases', specTitle: 'Ammonia (NH3)' },
  { id: 'lpg', keywords: 'lpg fuel liquid petroleum gas', name: 'LPG (Liquid Petroleum Gas)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Bahan bakar cair ramah lingkungan pemanas burner industri', tag: 'HEATING FUEL', target: 'products.html#section-gases', specTitle: 'LPG (Liquid Petroleum Gas) Industri' },
  { id: 'vgl', keywords: 'vgl vessel gas liquid cryogenic cylinder liquid oxygen nitrogen argon', name: 'VGL (Vessel Gas Liquid)', category: 'gases', categoryLabel: 'PRODUK GAS', desc: 'Tabung kriogenik isolasi vakum untuk gas cair O2, N2, Ar, CO2', tag: 'CRYOGENIC LIQUID', target: 'products.html#section-gases', specTitle: 'VGL (Vessel Gas Liquid)' },

  // LAYANAN
  { id: 'filling-station', keywords: 'filling station refill', name: 'Filling Station (Stasiun Pengisian Gas)', category: 'services', categoryLabel: 'LAYANAN PROFESIONAL', desc: 'Pengisian gas mandiri otomatis di Safe N Lock Sidoarjo', tag: 'STASIUN RESMI', target: 'products.html#section-services', specTitle: 'Filling Station Gas Terpadu' },
  { id: 'delivery-service', keywords: 'delivery shipping fleet', name: 'Delivery Service (Armada Khusus)', category: 'services', categoryLabel: 'LAYANAN PROFESIONAL', desc: 'Armada pengiriman terjadwal wilayah Jawa Timur', tag: 'LOGISTIK TERJADWAL', target: 'products.html#section-services', specTitle: 'Delivery Service Khusus Jawa Timur' },
  { id: 'gas-piping', keywords: 'piping pipeline installation medical', name: 'Gas Piping System (Instalasi Pipa Gas)', category: 'services', categoryLabel: 'LAYANAN PROFESIONAL', desc: 'Pipa tembaga medis RS berstandar HTM 02-01 & sentral pabrik', tag: 'STANDAR MEDIS HTM', target: 'products.html#section-services', specTitle: 'Gas Piping System Medis & Industri' },
  { id: 'spare-parts', keywords: 'spare parts components', name: 'Spare Parts (Suku Cadang & Komponen)', category: 'services', categoryLabel: 'LAYANAN PROFESIONAL', desc: 'Suku cadang bejana tekan, pigtail fleksibel, seal, spindle valve', tag: 'ORIGINAL PARTS', target: 'products.html#section-services', specTitle: 'Penyediaan Spare Parts Bejana Tekan' },
  { id: 'maintenance', keywords: 'maintenance servis perawatan tabung', name: 'Maintenance Tabung', category: 'services', categoryLabel: 'LAYANAN PROFESIONAL', desc: 'Pembersihan kerak internal, pengecatan kode warna & perpanjangan izin bejana tekan', tag: 'MAINTENANCE', target: 'products.html#section-services', specTitle: 'Maintenance Tabung Gas' },
  { id: 'purging-pipelines', keywords: 'purging pipeline nitrogen', name: 'Purging Pipelines with Nitrogen', category: 'services', categoryLabel: 'LAYANAN PROFESIONAL', desc: 'Pengurasan pipa migas & kimia dengan gas N2 bertekanan', tag: 'ZERO SPARK RISK', target: 'products.html#section-services', specTitle: 'Purging Pipelines with Nitrogen' },

  // PERLENGKAPAN GAS
  { id: 'valve', keywords: 'valve cylinder', name: 'Valve (Katup Tabung Gas Bertekanan)', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Katup kuningan tempa tahan 300 Bar', tag: '300 BAR', target: 'products.html#section-equipment', specTitle: 'High-Pressure Cylinder Valve' },
  { id: 'cyrogenic-dewars', keywords: 'cryogenic dewar liquid', name: 'Cryogenic Dewars (Tabung Gas Cair)', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Bejana insulasi vakum super dingin 175L - 500L stainless steel', tag: 'VACUUM INSULATED', target: 'products.html#section-equipment', specTitle: 'Cryogenic Liquid Dewars' },
  { id: 'cyrogenic-regulator', keywords: 'cryogenic regulator', name: 'Cryogenic Regulator (Regulator Suhu Rendah)', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Regulator vaporisasi gas cair dengan pemanas elektrik internal', tag: 'AUTO HEATING', target: 'products.html#section-equipment', specTitle: 'Cryogenic Vaporizer Regulator' },
  { id: 'cylinder', keywords: 'cylinder steel tank', name: 'Cylinder (Silinder Tabung Baja)', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Silinder baja seamless ukuran 1m³, 2m³, 6m³, 7m³, 10m³', tag: 'SEAMLESS STEEL', target: 'products.html#section-equipment', specTitle: 'Seamless Steel Gas Cylinder' },
  { id: 'regulator', keywords: 'regulator pressure flowmeter', name: 'Regulator Gas (Medis & Industri)', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Dua tingkat reduksi tekanan dengan flowmeter akurasi tinggi', tag: 'TWO-STAGE BRASS', target: 'products.html#section-equipment', specTitle: 'Two-Stage Gas Pressure Regulator' },
  { id: 'cradle', keywords: 'cradle rack manifold', name: 'Cradle (Rak Bundel Silinder Manifold)', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Sistem rak silinder manifold ukuran 2x2 hingga 4x4', tag: 'MANIFOLD RACK', target: 'products.html#section-equipment', specTitle: 'Cylinder Manifold Cradle Rack' },
  { id: 'flowmeter-oksigen', keywords: 'flowmeter oksigen oxygen aliran', name: 'Flowmeter Oksigen', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Pengatur aliran oksigen medis dalam liter per menit', tag: 'OXYGEN FLOW', target: 'products.html#section-equipment', specTitle: 'Medical Oxygen Flowmeter' },
  { id: 'gas-outlet-panel', keywords: 'gas outlet panel medis dinding', name: 'Gas Outlet Panel', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Outlet gas medis untuk dinding atau bed head unit', tag: 'MEDICAL OUTLET', target: 'products.html#section-equipment', specTitle: 'Medical Gas Outlet Panel' },
  { id: 'bed-head-panel', keywords: 'bed head panel kepala tempat tidur medis', name: 'Bed Head Panel', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Panel outlet gas medis di kepala tempat tidur pasien', tag: 'BED HEAD UNIT', target: 'products.html#section-equipment', specTitle: 'Bed Head Panel' },
  { id: 'humidifier-bottle', keywords: 'humidifier botol pelembap oksigen', name: 'Humidifier Bottle', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Botol pelembap aliran oksigen medis untuk pasien', tag: 'OXYGEN HUMIDIFIER', target: 'products.html#section-equipment', specTitle: 'Oxygen Humidifier Bottle' },
  { id: 'alarm-gas-medis', keywords: 'alarm gas medis tekanan', name: 'Alarm Gas Medis', category: 'equipment', categoryLabel: 'PERLENGKAPAN GAS', desc: 'Alarm tekanan sistem pipa gas medis, suara dan visual', tag: 'PRESSURE ALARM', target: 'products.html#section-equipment', specTitle: 'Medical Gas Alarm' },
];

function initHeaderSearch() {
  const searchInputs = document.querySelectorAll('.header-search-input');
  if (!searchInputs.length) return;

  searchInputs.forEach(input => {
    const wrapper = input.closest('.header-search-wrap');
    if (!wrapper) return;
    const dropdown = wrapper.querySelector('.header-search-suggestions');
    if (!dropdown) return;

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (query.length === 0) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      const matches = candiSearchCatalog.filter(item => {
        return item.name.toLowerCase().includes(query) ||
               (item.keywords || '').toLowerCase().includes(query) ||
               item.desc.toLowerCase().includes(query) ||
               item.tag.toLowerCase().includes(query) ||
               item.category.toLowerCase().includes(query);
      });

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="p-4 text-center text-xs text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-slate-300 text-sm mb-1.5 block"></i>
            Tidak ada produk, layanan, atau alat gas yang cocok.
          </div>
        `;
        dropdown.classList.add('active');
        return;
      }

      const grouped = {
        gases: matches.filter(m => m.category === 'gases'),
        services: matches.filter(m => m.category === 'services'),
        equipment: matches.filter(m => m.category === 'equipment')
      };

      let html = '';

      if (grouped.gases.length > 0) {
        html += `
          <div class="search-category-header">
            <i class="fa-solid fa-fire-flame-simple text-sky-500"></i>
            <span>PRODUK GAS (INDUSTRIAL & MEDICAL)</span>
          </div>
        `;
        grouped.gases.forEach(item => {
          html += renderSearchSuggestionItem(item);
        });
      }

      if (grouped.services.length > 0) {
        html += `
          <div class="search-category-header">
            <i class="fa-solid fa-wrench text-emerald-500"></i>
            <span>LAYANAN PROFESIONAL (SERVICES)</span>
          </div>
        `;
        grouped.services.forEach(item => {
          html += renderSearchSuggestionItem(item);
        });
      }

      if (grouped.equipment.length > 0) {
        html += `
          <div class="search-category-header">
            <i class="fa-solid fa-toolbox text-amber-500"></i>
            <span>PERLENGKAPAN GAS (EQUIPMENT)</span>
          </div>
        `;
        grouped.equipment.forEach(item => {
          html += renderSearchSuggestionItem(item);
        });
      }

      dropdown.innerHTML = html;
      dropdown.classList.add('active');

      // Klik saran -> langsung menuju bagian katalog yang sesuai
      dropdown.querySelectorAll('.search-suggestion-item').forEach(itemEl => {
        itemEl.addEventListener('click', () => {
          const targetUrl = itemEl.getAttribute('data-target') || 'products.html';
          const hash = targetUrl.split('#')[1] || '';
          const onProducts = /^products(\.html)?$/.test(window.location.pathname.split('/').pop());
          dropdown.classList.remove('active');
          input.value = '';

          if (onProducts && hash && document.getElementById(hash)) {
            const header = document.getElementById('main-header');
            const bar = document.getElementById('products-tabbar');
            const offset = (header ? header.offsetHeight : 80) + (bar ? bar.offsetHeight : 0) + 8;
            const y = document.getElementById(hash).getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
            if (history.replaceState) history.replaceState(null, '', '#' + hash);
          } else {
            window.location.href = targetUrl;
          }
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length > 0) {
        dropdown.classList.add('active');
      }
    });
  });
}

function renderSearchSuggestionItem(item) {
  return `
    <div class="search-suggestion-item" data-target="${item.target}">
      <div class="pr-2">
        <div class="item-title">${escapeHtml(item.name)}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
      <span class="item-tag shrink-0">${item.tag}</span>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   3C. DYNAMIC ORDER TABLE SYSTEM (QUOTE / RFQ)
   -------------------------------------------------------------------------- */
window.currentOrderTableItems = [];

// Mencegah teks bebas dari user (catatan, dll) dibaca sebagai HTML
function escapeHtml(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function initDynamicOrderTable() {
  const tableContainer = document.getElementById('order-table-container');
  const tableBody = document.getElementById('order-table-body');
  const emptyNotice = document.getElementById('order-table-empty');
  const btnAddItem = document.getElementById('btn-add-order-item');
  const totalBadge = document.getElementById('order-total-count');

  if (!tableContainer || !tableBody || !btnAddItem) return;

  const itemSelect = document.getElementById('order-item-select');
  const specSelect = document.getElementById('order-spec-select');
  const qtyInput = document.getElementById('order-qty-input');
  const notesInput = document.getElementById('order-notes-input');

  // Keranjang (cart.js): pesanan dari halaman Produk & Layanan otomatis terisi di sini,
  // dan setiap perubahan tabel disimpan balik ke keranjang.
  if (window.CandiCart && window.currentOrderTableItems.length === 0) {
    window.currentOrderTableItems = window.CandiCart.items();
  }

  const updateTableDisplay = () => {
    if (window.CandiCart) window.CandiCart.set(window.currentOrderTableItems);
    if (window.currentOrderTableItems.length === 0) {
      if (emptyNotice) emptyNotice.classList.remove('hidden');
      if (totalBadge) totalBadge.textContent = '0 Item Terdaftar';
      tableBody.innerHTML = '';
      return;
    }

    if (emptyNotice) emptyNotice.classList.add('hidden');
    if (totalBadge) totalBadge.textContent = `${window.currentOrderTableItems.length} Item Terdaftar`;

    let html = '';
    window.currentOrderTableItems.forEach((item, index) => {
      const badgeClass = item.category === 'gas' ? 'order-badge-gas' : (item.category === 'service' ? 'order-badge-service' : 'order-badge-equipment');
      html += `
        <tr class="order-table-row border-b border-slate-100 text-xs">
          <td class="py-3 px-3 font-mono font-bold text-slate-400 text-center">${index + 1}</td>
          <td class="py-3 px-3">
            <span class="font-bold text-navy-900 block">${escapeHtml(item.name)}</span>
            <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded ${badgeClass} inline-block mt-0.5">${escapeHtml(item.categoryLabel)}</span>
          </td>
          <td class="py-3 px-3 font-medium text-slate-700">${escapeHtml(item.spec)}</td>
          <td class="py-3 px-3 font-mono font-bold text-sky-700 text-center">${escapeHtml(item.qty)}</td>
          <td class="py-3 px-3 text-slate-500 italic">${escapeHtml(item.notes) || '-'}</td>
          <td class="py-3 px-3 text-center">
            <button type="button" class="btn-remove-order-item text-rose-500 hover:text-rose-700 p-1.5 rounded transition-colors" data-index="${index}" title="Hapus item ini">
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;

    // Attach delete listeners
    tableBody.querySelectorAll('.btn-remove-order-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        window.currentOrderTableItems.splice(idx, 1);
        updateTableDisplay();
      });
    });
  };

  btnAddItem.addEventListener('click', (e) => {
    e.preventDefault();
    // Sub-pilihan (mis. Mixed Gases -> ArO / ArCO) dari quote-options.js; kosong jika produk tidak punya varian
    const variantSelect = document.getElementById('order-variant-select');
    const variantWrap = variantSelect ? variantSelect.closest('[data-variant-wrap]') : null;
    const variantValue = (variantSelect && variantWrap && !variantWrap.classList.contains('hidden')) ? variantSelect.value : '';
    const baseItemName = itemSelect ? itemSelect.value : '';
    const selectedItemName = !variantValue ? baseItemName
      : baseItemName.endsWith(')') ? `${baseItemName.slice(0, -1)}, ${variantValue})`
      : `${baseItemName} (${variantValue})`;
    const selectedSpec = specSelect ? specSelect.value : '';
    const qty = qtyInput ? qtyInput.value.trim() : '1';
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!selectedItemName) {
      showLuxuryToast('Pilih Produk', 'Silakan pilih produk atau layanan yang ingin dipesan terlebih dahulu.', 'error');
      return;
    }

    if (!qty || isNaN(parseInt(qty, 10)) || parseInt(qty, 10) <= 0) {
      showLuxuryToast('Jumlah Tidak Valid', 'Masukkan kuantitas pesanan yang valid.', 'error');
      return;
    }

    const cat = itemSelect.selectedOptions[0]?.getAttribute('data-category') || 'gas';
    const catLabel = itemSelect.selectedOptions[0]?.getAttribute('data-category-label') || 'Produk Gas';

    window.currentOrderTableItems.push({
      name: selectedItemName,
      category: cat,
      categoryLabel: catLabel,
      spec: selectedSpec || 'Standar',
      qty: qty,
      notes: notes
    });

    updateTableDisplay();

    // Reset inputs
    if (qtyInput) qtyInput.value = '1';
    if (notesInput) notesInput.value = '';

    showLuxuryToast('Item Ditambahkan', `${selectedItemName} (${selectedSpec}) berhasil masuk ke daftar pesanan.`, 'success');
  });

  // Presets buttons (quick-add buttons)
  document.querySelectorAll('.btn-quick-preset').forEach(presetBtn => {
    presetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pName = presetBtn.getAttribute('data-name');
      const pSpec = presetBtn.getAttribute('data-spec');
      const pQty = presetBtn.getAttribute('data-qty') || '1';
      const pCat = presetBtn.getAttribute('data-cat') || 'gas';
      const pLabel = presetBtn.getAttribute('data-label') || 'Produk Gas';

      window.currentOrderTableItems.push({
        name: pName,
        category: pCat,
        categoryLabel: pLabel,
        spec: pSpec,
        qty: pQty,
        notes: 'Preset Langsung'
      });

      updateTableDisplay();
      showLuxuryToast('Preset Ditambahkan', `${pName} ditambahkan ke tabel pesanan.`, 'success');
    });
  });

  // Initial table render
  updateTableDisplay();
}

/* --------------------------------------------------------------------------
   4. DYNAMIC FADE IN / FADE OUT ON SCROLL FOR HEADINGS (REQUIREMENT 3)
   -------------------------------------------------------------------------- */
function initScrollFadeHeadings() {
  const headings = document.querySelectorAll('.scroll-fade-heading');
  if (!headings.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('heading-in-view');
      } else {
        // Fade out when scrolling away
        entry.target.classList.remove('heading-in-view');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '-20px 0px -20px 0px'
  });

  headings.forEach(h => observer.observe(h));
}

/* --------------------------------------------------------------------------
   5. GENERAL SCROLL ANIMATIONS (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        } else {
          entry.target.classList.remove('opacity-100', 'translate-y-0');
          entry.target.classList.add('opacity-0', 'translate-y-8');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => {
      el.classList.add('transition-all', 'duration-800', 'ease-out', 'opacity-0', 'translate-y-8');
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(el => el.classList.remove('opacity-0', 'translate-y-8'));
  }
}

/* --------------------------------------------------------------------------
   6. STAT COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = target * easeProgress;

      el.textContent = isDecimal ? current.toFixed(3) : Math.floor(current).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(3) : target.toLocaleString();
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   7. TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showLuxuryToast(title, message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const iconBg = type === 'success' ? 'bg-sky-500' : 'bg-rose-500';
  const iconSvg = type === 'success'
    ? `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
    : `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;

  toast.className = `flex items-start gap-4 p-5 bg-navy-900 text-white rounded shadow-luxury-lg border border-slate-700/60 transition-all duration-500 transform translate-y-4 opacity-0 max-w-md w-full relative overflow-hidden`;
  toast.innerHTML = `
    <div class="flex-shrink-0 w-8 h-8 rounded-full ${iconBg} flex items-center justify-center">
      ${iconSvg}
    </div>
    <div class="flex-1 pr-2">
      <h4 class="font-semibold text-sm tracking-wider uppercase text-sky-300 font-luxury-serif">${title}</h4>
      <p class="text-xs text-slate-300 mt-1 leading-relaxed">${message}</p>
    </div>
    <button class="text-slate-400 hover:text-white transition-colors" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sky-400 to-sky-600 w-full animate-toast-bar"></div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 500);
  }, 4500);
}

/* --------------------------------------------------------------------------
   8. FORM HANDLERS (SUPABASE INTEGRATED)
   -------------------------------------------------------------------------- */
function initForms() {
  // Contact Form (contact.html) -> membuka Gmail dengan pesan siap kirim (tujuan: CONTACT_EMAIL)
  const CONTACT_EMAIL = 'cdosidoarjo@gmail.com';
  const gmailCompose = (subject, body) => 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CONTACT_EMAIL) +
    '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(String(body).replace(/\n/g, '\r\n'));
  const openCompose = (win, url) => { if (win && !win.closed) win.location.href = url; else window.location.href = url; };
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let win = null; try { win = window.open('', '_blank'); } catch (_) { win = null; }
      const v = (id) => (contactForm.querySelector('#' + id)?.value || '').trim();
      const body = 'Pesan/Pertanyaan Pelanggan\n\n' +
        'Nama: ' + v('fullName') + '\n' +
        'Email: ' + v('email') + '\n' +
        'WhatsApp / Telp: ' + v('phone') + '\n' +
        (v('company') ? 'Nama Usaha / Pribadi: ' + v('company') + '\n' : '') +
        'Keperluan: ' + v('subject') + '\n\n' +
        'Pesan:\n' + v('message') + '\n';
      openCompose(win, gmailCompose('Pesan/Pertanyaan Pelanggan', body));
      showLuxuryToast('Pesan Siap Dikirim', 'Gmail terbuka dengan pesan Anda. Periksa kembali lalu tekan Kirim.', 'success');
      contactForm.reset();
    });
  }

  // Review, kritik & saran (contact.html) -> tersimpan ke admin (Review Masuk)
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    const ratingInput = reviewForm.querySelector('#reviewRating');
    const stars = Array.from(reviewForm.querySelectorAll('[data-star]'));
    const paint = (n) => stars.forEach(s => {
      const on = Number(s.getAttribute('data-star')) <= n;
      s.classList.toggle('text-amber-400', on); s.classList.toggle('text-slate-300', !on);
      s.setAttribute('aria-pressed', Number(s.getAttribute('data-star')) === n ? 'true' : 'false');
    });
    stars.forEach(s => s.addEventListener('click', () => { ratingInput.value = s.getAttribute('data-star'); paint(Number(ratingInput.value)); reviewForm.querySelector('#reviewRatingErr')?.classList.add('hidden'); }));
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rating = Number(ratingInput.value || 0);
      if (!rating) { reviewForm.querySelector('#reviewRatingErr')?.classList.remove('hidden'); return; }
      const btn = reviewForm.querySelector('button[type="submit"]'), orig = btn.innerHTML;
      const v = (id) => (reviewForm.querySelector('#' + id)?.value || '').trim();
      btn.disabled = true; btn.innerHTML = '<span>Mengirim...</span>';
      try {
        if (typeof supabaseClient === 'undefined' || !supabaseClient) throw new Error('no-db');
        const r = await supabaseClient.from('reviews').insert([{ full_name: v('reviewName'), company: v('reviewCompany') || null, rating: rating, message: v('reviewMessage') }]);
        if (r && r.error) throw r.error;
        showLuxuryToast('Terima Kasih!', 'Review Anda sudah kami terima. Tim kami akan membacanya.', 'success');
        reviewForm.reset(); ratingInput.value = ''; paint(0);
      } catch (err) {
        showLuxuryToast('Gagal Mengirim', 'Review belum terkirim. Silakan coba lagi nanti atau hubungi kami lewat WhatsApp.', 'error');
      } finally {
        btn.disabled = false; btn.innerHTML = orig;
      }
    });
  }

  // Dedicated Quote / RFQ Form (quote.html)
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('#quoteSubmitBtn') || quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Wajib ada minimal 1 item di tabel pesanan
      if (!window.currentOrderTableItems || window.currentOrderTableItems.length === 0) {
        showLuxuryToast('Pesanan Masih Kosong', 'Tambahkan minimal satu produk atau layanan ke tabel pesanan sebelum mengirim permohonan.', 'error');
        const builder = document.getElementById('order-item-select');
        if (builder) builder.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Buka jendela WhatsApp SEKARANG (masih dalam aksi klik pengunjung) agar tidak diblokir popup-blocker;
      // isinya diarahkan ke chat setelah pesanan tersimpan.
      const viaEmail = !!(e.submitter && e.submitter.id === 'quoteEmailBtn');
      let waWin = null;
      try { waWin = window.open('', '_blank'); } catch (_) { waWin = null; }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Memproses Permohonan...</span>`;

      const checkedBoxes = Array.from(quoteForm.querySelectorAll('input[name="selectedItems"]:checked')).map(cb => cb.value);

      let tableVolumeText = quoteForm.querySelector('#quoteVolume')?.value || '';
      let finalSelectedItems = checkedBoxes;

      if (window.currentOrderTableItems && window.currentOrderTableItems.length > 0) {
        finalSelectedItems = window.currentOrderTableItems.map(it => `${it.name} (${it.spec})`);
        const itemRows = window.currentOrderTableItems.map((it, idx) => 
          `${idx + 1}. [${it.categoryLabel}] ${it.name} | Spek: ${it.spec} | Jml: ${it.qty} | Catatan: ${it.notes || '-'}`
        ).join('\n');
        tableVolumeText = `=== DAFTAR PESANAN (${window.currentOrderTableItems.length} ITEM) ===\n${itemRows}\n\nKeterangan Tambahan: ${quoteForm.querySelector('#quoteVolume')?.value || 'Sesuai rincian tabel'}`;
      }

      // Data pengiriman (PIC lapangan, telepon lapangan, alamat lengkap) digabung ke kolom
      // yang sudah ada di Supabase agar tidak perlu mengubah skema tabel.
      const shippingPIC = quoteForm.querySelector('#shippingPIC')?.value.trim() || '';
      const shippingPhone = quoteForm.querySelector('#shippingPhone')?.value.trim() || '';
      const shippingAddress = quoteForm.querySelector('#shippingAddress')?.value.trim() || '';
      const extraNotes = quoteForm.querySelector('#quoteNotes')?.value.trim() || '';
      const poRef = (window.CandiCart && window.CandiCart.makeRef) ? window.CandiCart.makeRef() : ('PO-' + Date.now());
      const waOrder = {
        ref: poRef,
        name: quoteForm.querySelector('#quoteName')?.value.trim() || '',
        company: quoteForm.querySelector('#quoteCompany')?.value.trim() || '',
        clientType: quoteForm.querySelector('#quoteClientType')?.value || '',
        email: quoteForm.querySelector('#quoteEmail')?.value.trim() || '',
        phone: quoteForm.querySelector('#quotePhone')?.value.trim() || '',
        items: window.currentOrderTableItems.map(it => ({ ...it })),
        pic: shippingPIC, picPhone: shippingPhone, address: shippingAddress,
        city: quoteForm.querySelector('#quoteLocation')?.value.trim() || '',
        schedule: quoteForm.querySelector('#quoteVolume')?.value.trim() || '',
        notes: extraNotes
      };
      const shippingNotes = [
        `No. Referensi: ${poRef}`,
        `PIC Lapangan: ${shippingPIC || '-'} (${shippingPhone || '-'})`,
        `Catatan Pengiriman: ${extraNotes || '-'}`
      ].join('\n');

      const formData = {
        fullName: quoteForm.querySelector('#quoteName')?.value || '',
        email: quoteForm.querySelector('#quoteEmail')?.value || '',
        phone: quoteForm.querySelector('#quotePhone')?.value || '',
        company: quoteForm.querySelector('#quoteCompany')?.value || '',
        clientType: quoteForm.querySelector('#quoteClientType')?.value || 'Industri Bisnis',
        category: quoteForm.querySelector('#quoteCategory')?.value || 'Industrial & Medical Gases',
        selectedItems: finalSelectedItems,
        estimatedVolume: tableVolumeText,
        deliveryLocation: shippingAddress
          ? `${shippingAddress} — ${quoteForm.querySelector('#quoteLocation')?.value || ''}`
          : (quoteForm.querySelector('#quoteLocation')?.value || ''),
        notes: shippingNotes
      };

      try {
        // 1) Arsip ke database (Pesan Masuk di admin). Kalau gagal, WhatsApp tetap dibuka.
        try {
          if (typeof submitQuoteRequest === 'function') await submitQuoteRequest(formData);
        } catch (saveErr) { console.warn('Arsip pesanan gagal disimpan:', saveErr); }

        // 2) Buka WhatsApp dengan template purchase order
        const waUrl = !window.CandiCart ? '' : (viaEmail ? window.CandiCart.gmailLink(waOrder) : window.CandiCart.waLink(waOrder));
        if (waUrl) {
          if (waWin && !waWin.closed) waWin.location.href = waUrl;
          else window.location.href = waUrl;
        }
        showLuxuryToast(
          'Pesanan Siap Dikirim',
          (viaEmail ? 'Gmail terbuka dengan pesanan Anda. Periksa kembali lalu tekan Kirim. No. Referensi: ' : 'WhatsApp terbuka dengan template pesanan Anda. Tinggal tekan Kirim. No. Referensi: ') + poRef,
          'success'
        );
        quoteForm.reset();
        window.currentOrderTableItems = [];
        if (window.CandiCart) window.CandiCart.clear();
        const tableBody = document.getElementById('order-table-body');
        const emptyNotice = document.getElementById('order-table-empty');
        const totalBadge = document.getElementById('order-total-count');
        if (tableBody) tableBody.innerHTML = '';
        if (emptyNotice) emptyNotice.classList.remove('hidden');
        if (totalBadge) totalBadge.textContent = '0 Item Terdaftar';
      } catch (err) {
        if (waWin && !waWin.closed) { try { waWin.close(); } catch (_) {} }
        showLuxuryToast('Kendala Pengiriman', 'Silakan periksa kembali isian formulir Anda.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Career Form (career.html)
  const careerForm = document.getElementById('career-form');
  if (careerForm) {
    careerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = careerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Memproses Berkas...</span>`;

      const formData = {
        fullName: careerForm.querySelector('#careerName')?.value || '',
        email: careerForm.querySelector('#careerEmail')?.value || '',
        phone: careerForm.querySelector('#careerPhone')?.value || '',
        position: careerForm.querySelector('#careerPosition')?.value || '',
        linkedin: careerForm.querySelector('#careerLinkedin')?.value || '',
        portfolio: careerForm.querySelector('#careerPortfolio')?.value || '',
        coverLetter: careerForm.querySelector('#careerLetter')?.value || ''
      };

      try {
        if (typeof submitCareerApplication === 'function') {
          await submitCareerApplication(formData);
          showLuxuryToast(
            'Aplikasi Diterima',
            'Tim Talent Acquisition PT. Candi Oxygen akan meninjau kualifikasi Anda dengan standar kerahasiaan tinggi.',
            'success'
          );
        }
        careerForm.reset();
        const modal = document.getElementById('career-modal');
        if (modal) modal.classList.add('hidden');
      } catch (err) {
        showLuxuryToast('Gagal Mengirim', 'Mohon periksa kembali isian Anda.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Newsletter Forms
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showLuxuryToast(
          'Langganan Terverifikasi',
          'Anda kini terdaftar dalam buletin eksklusif PT. Candi Oxygen Industry Briefings.',
          'success'
        );
        input.value = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. LUXURY MODALS
   -------------------------------------------------------------------------- */
function initModals() {
  // Career application modal opener
  const applyBtns = document.querySelectorAll('[data-open-apply]');
  const careerModal = document.getElementById('career-modal');
  const closeCareerModal = document.getElementById('close-career-modal');

  if (applyBtns && careerModal) {
    applyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-career-role') || 'Posisi Spesialis';
        const positionInput = careerModal.querySelector('#careerPosition');
        const roleDisplay = careerModal.querySelector('#careerRoleTitle');
        if (positionInput) positionInput.value = role;
        if (roleDisplay) roleDisplay.textContent = role;

        careerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeCareerModal) {
      closeCareerModal.addEventListener('click', () => {
        careerModal.classList.add('hidden');
        document.body.style.overflow = '';
      });
    }

    careerModal.addEventListener('click', (e) => {
      if (e.target === careerModal) {
        careerModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   10. PRODUCTS & SERVICES TAB FILTER WITH FADE-IN & AUTO-SCROLL (REQUIREMENT 8)
   -------------------------------------------------------------------------- */
function initProductsTabFilter() {
  const tabs = document.querySelectorAll('.product-category-tab');
  const sections = document.querySelectorAll('.product-category-section');

  if (!tabs.length || !sections.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetCat = tab.getAttribute('data-target-category');

      tabs.forEach(t => {
        t.classList.remove('bg-navy-900', 'text-white');
        t.classList.add('bg-white', 'text-navy-900', 'border-slate-200');
      });
      tab.classList.add('bg-navy-900', 'text-white');
      tab.classList.remove('bg-white', 'text-navy-900', 'border-slate-200');

      let targetSectionElement = null;

      sections.forEach(sec => {
        sec.classList.remove('product-fade-active');

        if (targetCat === 'all' || sec.getAttribute('data-category') === targetCat) {
          sec.style.display = 'block';
          sec.classList.remove('hidden');
          // Trigger fade in animation
          void sec.offsetWidth; // force reflow
          sec.classList.add('product-fade-active');

          if (!targetSectionElement && sec.getAttribute('data-category') === targetCat) {
            targetSectionElement = sec;
          }
        } else {
          sec.style.display = 'none';
          sec.classList.add('hidden');
        }
      });

      // Requirement 8: For all filters except 'all', smoothly scroll to the showcase!
      if (targetCat !== 'all' && targetSectionElement) {
        const headerOffset = 130;
        const elementPosition = targetSectionElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   11. PORTFOLIO CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  if (!document.querySelector('.portfolio-filter-btn')) return;
  // Delegasi klik: tombol filter tambahan (dibuat dari admin) ikut berfungsi
  document.addEventListener('click', e => {
    const btn = e.target.closest ? e.target.closest('.portfolio-filter-btn') : null;
    if (!btn) return;
    const category = btn.getAttribute('data-filter');

    document.querySelectorAll('.portfolio-filter-btn').forEach(b => {
      b.classList.remove('bg-navy-900', 'text-white');
      b.classList.add('bg-white', 'text-navy-900', 'border-slate-200');
    });
    btn.classList.add('bg-navy-900', 'text-white');
    btn.classList.remove('bg-white', 'text-navy-900', 'border-slate-200');

    document.querySelectorAll('.portfolio-item').forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (category === 'all' || itemCategory === category) {
        item.style.display = '';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.96)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   12. EMERGENCY HOTLINE ACTION
   -------------------------------------------------------------------------- */
function initEmergencyHotline() {
  const quickCall = document.getElementById('emergency-hotline-toggle');
  if (quickCall) {
    quickCall.addEventListener('click', () => {
      showLuxuryToast(
        'Hubungi Kami',
        'Hotline PT. Candi Oxygen dapat dihubungi di (031) 990103 15 / 16 atau WhatsApp +62 811-3739-800.',
        'success'
      );
    });
  }
}
