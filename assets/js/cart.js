/* ==========================================================================
   cart.js — Keranjang pesanan ala toko online (PT. Candi Oxygen)
   Alur pengunjung:
     1. Halaman Produk & Layanan: klik "Pesan" -> muncul jendela spesifikasi/kustomisasi.
     2. "Masukkan Keranjang" -> item tersimpan (tetap ada walau pindah halaman).
     3. Tombol keranjang -> "Pesan" -> masuk ke formulir RFQ (quote.html) yang sudah berisi pesanan.
     4. Isi data diri -> "Kirim Pesanan via WhatsApp" -> chat WhatsApp terbuka berisi
        template purchase order lengkap (identitas + pesanan), pengunjung tinggal menekan Kirim.
   Pilihan spesifikasi / varian dibaca dari assets/js/quote-options.js (SPECS, PER_PRODUCT, VARIANTS).
   ========================================================================== */
(function () {
  'use strict';
  var KEY = 'candiCart1', WA_FALLBACK = '628113739800';
  var PAGE = (location.pathname.replace(/\/+$/, '').split('/').pop() || 'index').replace(/\.html$/, '');
  function hasCatalog() { return !!document.getElementById('catalog-start'); }
  function isQuoteHref(h) { return /^(\.\/|\/)?quote(\.html)?([?#].*)?$/.test(String(h || '').trim()); }
  var CAT_LABEL = { gas: 'Produk Gas', service: 'Layanan Servis', equipment: 'Perlengkapan' };
  var SECTION_CAT = { 'section-gases': 'gas', 'section-services': 'service', 'section-equipment': 'equipment' };

  // Judul kartu di halaman produk -> nama produk di sistem pesanan (sama dengan <option> di quote.html)
  var NAME_MAP = {
    'Oksigen (O2) Industri': 'Oksigen Industri', 'Oksigen (O2) Medis': 'Oksigen Medis', 'Nitrogen (N2)': 'Nitrogen (N2)', 'Argon (Ar)': 'Argon (Ar)',
    'Karbon Dioksida (CO2)': 'Karbon Dioksida (CO2)', 'Asetilen (C2H2)': 'Asetilen (C2H2)', 'Mixed Gases': 'Mixed Gases',
    'Special Gases': 'Special Gases', 'Amonia (NH3)': 'Amonia (NH3)', 'LPG': 'LPG', 'VGL': 'VGL',
    'Filling Station': 'Filling Station', 'Delivery Service': 'Delivery Service', 'Gas Piping System Sentral': 'Gas Piping System',
    'Purging Pipelines with Nitrogen': 'Purging Pipelines with Nitrogen', 'Spare Parts & Komponen': 'Spare Parts',
    'Maintenance Tabung': 'Maintenance Bejana Tekan',
    'Valve Tabung': 'High Pressure Valve', 'Cryogenic Dewars': 'Cryogenic Dewars', 'Cryogenic Regulator': 'Cryogenic Regulator',
    'Cylinder (Tabung Gas)': 'Gas Cylinder Baru', 'Regulator Gas': 'Regulator Gas', 'Cradle (Rak Tabung)': 'Cradle (Rak Tabung)',
    'Flowmeter Oksigen': 'Flowmeter Oksigen', 'Gas Outlet Panel': 'Gas Outlet Panel', 'Bed Head Panel': 'Bed Head Panel', 'Humidifier Bottle': 'Humidifier Bottle', 'Alarm Gas Medis': 'Alarm Gas Medis'
  };

  function lang() { return window.getLanguage && window.getLanguage() === 'en' ? 'en' : 'id'; }
  function T(s) { return lang() === 'en' && window.t ? window.t(s) : s; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pair(it) { return typeof it === 'string' ? [it, it] : it; }
  function cfg(n) { try { return window[n]; } catch (e) { return undefined; } }

  /* ------------------------------ Penyimpanan ------------------------------ */
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  var items = load();
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function count() { return items.length; }

  /* --------------------------------- Gaya --------------------------------- */
  var css = document.createElement('style');
  css.textContent =
    '#cart-fab{position:fixed;right:1rem;bottom:1rem;z-index:55;width:3.5rem;height:3.5rem;border-radius:9999px;background:#0A192F;color:#fff;border:0;box-shadow:0 10px 25px rgba(2,6,23,.35);display:flex;align-items:center;justify-content:center;font-size:1.25rem;cursor:pointer;transition:transform .2s}' +
    '#cart-fab:hover{transform:scale(1.07)}#cart-fab.bump{animation:cartbump .5s}@keyframes cartbump{40%{transform:scale(1.25)}}' +
    '#cart-fab .cb{position:absolute;top:-.25rem;right:-.25rem;min-width:1.35rem;height:1.35rem;padding:0 .3rem;border-radius:9999px;background:#0ea5e9;color:#fff;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:Roboto,sans-serif}' +
    '.cart-ov{position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:60;display:none}.cart-ov.on{display:block}' +
    '#cart-drawer{position:fixed;top:0;right:0;bottom:0;width:100%;max-width:26rem;background:#fff;z-index:61;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s;box-shadow:-10px 0 30px rgba(2,6,23,.25);font-family:Roboto,sans-serif}' +
    '#cart-drawer.on{transform:none}' +
    '.cart-item{border:1px solid #e2e8f0;border-radius:.25rem;padding:.75rem;background:#f8fafc}' +
    '.cart-qty{display:inline-flex;align-items:center;border:1px solid #cbd5e1;border-radius:.25rem;background:#fff}' +
    '.cart-qty button{width:1.9rem;height:1.9rem;font-size:1rem;color:#0A192F;border:0;background:transparent;cursor:pointer}' +
    '.cart-qty input{width:2.8rem;height:1.9rem;text-align:center;border:0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;font-weight:700;font-size:.8rem;outline:0;-moz-appearance:textfield}' +
    '.cart-qty input::-webkit-outer-spin-button,.cart-qty input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}' +
    '#spec-modal{position:fixed;inset:0;z-index:65;background:rgba(15,23,42,.7);display:none;align-items:center;justify-content:center;padding:1rem;overflow-y:auto}#spec-modal.on{display:flex}' +
    '#spec-modal .sm-box{background:#fff;border-radius:.25rem;width:100%;max-width:30rem;box-shadow:0 25px 50px rgba(2,6,23,.4);max-height:94vh;overflow-y:auto;font-family:Roboto,sans-serif}' +
    '#spec-modal label,#cart-drawer .lb{display:block;font-size:.68rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#334155;margin-bottom:.3rem}' +
    '#spec-modal select,#spec-modal textarea,#spec-modal input.f{width:100%;border:1px solid #cbd5e1;border-radius:.25rem;padding:.55rem .7rem;font-size:.8rem;background:#fff;outline:0}' +
    '#spec-modal select:focus,#spec-modal textarea:focus{border-color:#0ea5e9}' +
    '#prod-spec{position:fixed;inset:0;z-index:65;background:rgba(15,23,42,.7);display:none;align-items:center;justify-content:center;padding:1rem;overflow-y:auto}#prod-spec.on{display:flex}' +
    '#prod-spec .ps-box{background:#fff;border-radius:.25rem;width:100%;max-width:34rem;box-shadow:0 25px 50px rgba(2,6,23,.4);max-height:94vh;overflow-y:auto;font-family:Roboto,sans-serif}' +
    '#prod-spec table{width:100%;border-collapse:collapse;font-size:.78rem}#prod-spec td{padding:.55rem .6rem;border-top:1px solid #e2e8f0;vertical-align:top;color:#334155}#prod-spec td:first-child{width:34%;font-weight:700;color:#0A192F;background:#f8fafc}' +
    '#prod-spec h4{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:#334155;font-weight:700;margin:1rem 0 .4rem}' +
    '#prod-spec ul{margin:0;padding-left:1.1rem;font-size:.78rem;color:#334155;line-height:1.6}' +
    '.prod-spec-btn{display:inline-flex;align-items:center;gap:.35rem;border:1px solid #bae6fd;background:#f0f9ff;color:#0284c7;border-radius:9999px;padding:.35rem .8rem;font-size:.68rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}.prod-spec-btn:hover{background:#0284c7;color:#fff;border-color:#0284c7}' +
    '.cart-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:9999px;padding:.8rem 1.4rem;font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;border:1px solid #0A192F;background:#0A192F;color:#fff;cursor:pointer;width:100%}' +
    '.cart-btn:hover{background:#0284c7;border-color:#0284c7}.cart-btn.ghost{background:#fff;color:#0A192F}.cart-btn.ghost:hover{background:#f1f5f9;color:#0A192F;border-color:#0A192F}';
  document.head.appendChild(css);

  /* ------------------------------- Keranjang UI ------------------------------- */
  var fab, drawer, ov;
  function build() {
    if (document.getElementById('cart-fab')) return;
    fab = document.createElement('button'); fab.id = 'cart-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Keranjang');
    fab.innerHTML = '<i class="fa-solid fa-cart-shopping"></i><span class="cb">0</span>';
    ov = document.createElement('div'); ov.className = 'cart-ov';
    drawer = document.createElement('aside'); drawer.id = 'cart-drawer'; drawer.setAttribute('aria-label', 'Keranjang pesanan');
    document.body.appendChild(ov); document.body.appendChild(drawer); document.body.appendChild(fab);
    fab.addEventListener('click', function () { openDrawer(); });
    ov.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', onDrawerClick);
    drawer.addEventListener('change', onDrawerChange);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeModal(); closeSpec(); } });
    render();
  }
  function openDrawer() { render(); ov.classList.add('on'); drawer.classList.add('on'); document.documentElement.style.overflow = 'hidden'; }
  function closeDrawer() { if (!drawer) return; ov.classList.remove('on'); drawer.classList.remove('on'); if (!modal || !modal.classList.contains('on')) document.documentElement.style.overflow = ''; }

  function render() {
    if (!fab) return;
    var n = count();
    fab.querySelector('.cb').textContent = n;
    fab.style.display = (PAGE === 'quote' || (n === 0 && !hasCatalog())) ? 'none' : 'flex';
    fab.querySelector('.cb').style.display = n ? 'flex' : 'none';
    var body;
    if (!n) {
      body = '<div style="padding:3rem 1.5rem;text-align:center;color:#94a3b8"><i class="fa-solid fa-cart-shopping" style="font-size:2.5rem;color:#cbd5e1"></i>' +
        '<p style="font-size:.85rem;font-weight:600;margin-top:1rem;color:#64748b">Keranjang masih kosong</p><p style="font-size:.75rem;margin-top:.4rem">Klik <b>Pesan</b> pada produk atau layanan, atur spesifikasinya, lalu masukkan ke keranjang.</p></div>';
    } else {
      body = '<div style="padding:1rem;display:flex;flex-direction:column;gap:.7rem">' + items.map(function (it, i) {
        return '<div class="cart-item" data-i="' + i + '"><div style="display:flex;justify-content:space-between;gap:.5rem">' +
          '<div style="min-width:0"><div style="font-weight:700;color:#0A192F;font-size:.85rem">' + esc(it.name) + '</div>' +
          '<div style="font-size:.7rem;color:#64748b;margin-top:.15rem">' + esc(T(it.categoryLabel)) + ' • ' + esc(T(it.spec)) + '</div>' +
          (it.notes ? '<div style="font-size:.7rem;color:#64748b;font-style:italic;margin-top:.2rem">“' + esc(it.notes) + '”</div>' : '') + '</div>' +
          '<button type="button" data-c="del" aria-label="Hapus" style="color:#e11d48;border:0;background:none;cursor:pointer;font-size:.9rem;align-self:flex-start"><i class="fa-solid fa-trash-can"></i></button></div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:.6rem"><span class="lb" style="margin:0">Jumlah</span>' +
          '<span class="cart-qty"><button type="button" data-c="minus" aria-label="Kurangi">−</button><input type="number" min="1" value="' + esc(it.qty) + '" data-c="qty"><button type="button" data-c="plus" aria-label="Tambah">+</button></span></div></div>';
      }).join('') + '</div>';
    }
    drawer.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid #e2e8f0"><div><div style="font-family:Montserrat,sans-serif;font-weight:700;color:#0A192F;font-size:1.05rem">Keranjang Pesanan</div>' +
      '<div style="font-size:.7rem;color:#64748b">' + n + ' ' + T('item') + '</div></div><button type="button" data-c="close" aria-label="Tutup" style="border:0;background:none;font-size:1.6rem;line-height:1;color:#64748b;cursor:pointer">&times;</button></div>' +
      '<div style="flex:1;overflow-y:auto">' + body + '</div>' +
      (n ? '<div style="padding:1rem 1.25rem;border-top:1px solid #e2e8f0;display:flex;flex-direction:column;gap:.6rem;background:#fff">' +
        '<button type="button" class="cart-btn" data-c="order">' + T('Pesan') + ' (' + n + ' ' + T('item') + ') <i class="fa-solid fa-arrow-right"></i></button>' +
        '<button type="button" class="cart-btn ghost" data-c="more">Tambah produk lain</button>' +
        '<button type="button" data-c="clear" style="border:0;background:none;font-size:.7rem;color:#94a3b8;text-decoration:underline;cursor:pointer">Kosongkan keranjang</button></div>' : '');
  }
  function onDrawerClick(e) {
    var b = e.target.closest('[data-c]'); if (!b) return; var a = b.getAttribute('data-c');
    var row = b.closest('[data-i]'), i = row ? Number(row.getAttribute('data-i')) : -1;
    if (a === 'close' || a === 'more') { closeDrawer(); if (a === 'more' && !hasCatalog()) location.href = 'products.html'; }
    else if (a === 'order') { location.href = 'quote.html'; }
    else if (a === 'clear') { if (confirm(T('Kosongkan semua item di keranjang?'))) { items = []; persist(); render(); } }
    else if (a === 'del' && i >= 0) { items.splice(i, 1); persist(); render(); }
    else if ((a === 'plus' || a === 'minus') && i >= 0) { var q = Math.max(1, (parseInt(items[i].qty, 10) || 1) + (a === 'plus' ? 1 : -1)); items[i].qty = String(q); persist(); render(); }
  }
  function onDrawerChange(e) {
    var inp = e.target.closest('input[data-c="qty"]'); if (!inp) return; var i = Number(inp.closest('[data-i]').getAttribute('data-i'));
    items[i].qty = String(Math.max(1, parseInt(inp.value, 10) || 1)); persist(); render();
  }

  /* --------------------------- Jendela spesifikasi --------------------------- */
  var modal, cur = null;
  function buildModal() {
    modal = document.createElement('div'); modal.id = 'spec-modal'; document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('[data-m="close"]')) return closeModal();
      var a = e.target.closest('[data-m]'); if (!a) return; var m = a.getAttribute('data-m'), q = modal.querySelector('#sm-qty');
      if (m === 'plus') q.value = (parseInt(q.value, 10) || 1) + 1;
      else if (m === 'minus') q.value = Math.max(1, (parseInt(q.value, 10) || 1) - 1);
      else if (m === 'add') submitModal();
      else if (m === 'order') openModal(cur);
    });
    modal.addEventListener('change', function (e) { if (e.target.id === 'sm-spec') syncNote(); if (e.target.id === 'sm-var') { hideErr(); var sel = modal.querySelector('#sm-spec'); sel.innerHTML = specOptionsHtml(cur.name, cur.category, e.target.value); syncNote(); } });
    modal.addEventListener('input', hideErr);
  }
  function compose(name, variant) {
    if (!variant) return name;
    return name.slice(-1) === ')' ? name.slice(0, -1) + ', ' + variant + ')' : name + ' (' + variant + ')';
  }
  function groupsFor(name, cat, variant) {
    var pp = cfg('PER_PRODUCT'), sp = cfg('SPECS'), full = compose(name, variant);
    var g = (pp && (pp[full] || pp[name])) || (sp && sp[cat]) || [];
    return g.slice();
  }
  function specOptionsHtml(name, cat, variant) {
    var groups = groupsFor(name, cat, variant), cs = cfg('CUSTOM_SPEC') || ['Kustom / Sesuai Catatan', 'Kustom / Sesuai Catatan Khusus'];
    groups.push({ label: groups.length ? 'Spesifikasi Khusus' : '', items: [[cs[0], cs[1]]] });
    return groups.map(function (g) {
      var o = g.items.map(function (it) { var x = pair(it); return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + '</option>'; }).join('');
      return g.label ? '<optgroup label="' + esc(g.label) + '">' + o + '</optgroup>' : o;
    }).join('');
  }
  function isCustom(v) { var c = cfg('CUSTOM_SPEC') || ['Kustom / Sesuai Catatan', 'Kustom / Sesuai Catatan Khusus']; return c.indexOf(v) !== -1; }
  function openModal(p) {
    if (!modal) buildModal();
    cur = p;
    var specHtml = specOptionsHtml(p.name, p.category, '');
    var vars = cfg('VARIANTS'), v = vars && vars[p.name];
    var varHtml = v ? '<div style="margin-top:.9rem"><label>' + esc(T(v.label)) + '</label><select id="sm-var"><option value="">' + esc(v.placeholder) + '</option>' +
      v.items.map(function (it) { var x = pair(it); return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + '</option>'; }).join('') + '</select></div>' : '';
    modal.innerHTML = '<div class="sm-box"><div style="position:relative">' +
      (p.img ? '<div style="height:9rem;background:#0F172A;overflow:hidden"><img src="' + esc(p.img) + '" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.9"></div>' : '') +
      '<button type="button" data-m="close" aria-label="Tutup" style="position:absolute;top:.5rem;right:.6rem;width:2.1rem;height:2.1rem;border-radius:9999px;border:0;background:rgba(255,255,255,.95);font-size:1.3rem;line-height:1;cursor:pointer">&times;</button></div>' +
      '<div style="padding:1.25rem"><div style="font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#0284c7;font-weight:700">' + esc(p.categoryLabel) + '</div>' +
      '<h3 style="font-family:Montserrat,sans-serif;font-size:1.25rem;font-weight:700;color:#0A192F;margin:.2rem 0 1rem">' + esc(p.title) + '</h3>' +
      varHtml + '<div style="margin-top:.9rem"><label>' + esc(T(p.category === 'service' ? 'Jenis Layanan' : 'Spesifikasi / Ukuran')) + '</label><select id="sm-spec">' + specHtml + '</select></div>' +
      '<div style="margin-top:.9rem"><label>Jumlah</label><span class="cart-qty"><button type="button" data-m="minus" aria-label="Kurangi">−</button><input type="number" id="sm-qty" min="1" value="1"><button type="button" data-m="plus" aria-label="Tambah">+</button></span></div>' +
      '<div style="margin-top:.9rem"><label id="sm-nl">Catatan (opsional)</label><textarea id="sm-notes" rows="2" placeholder="Contoh: sewa tabung atau tabung milik sendiri..."></textarea></div>' +
      '<p id="sm-err" style="display:none;color:#dc2626;font-size:.72rem;font-weight:600;margin-top:.5rem"></p>' +
      '<button type="button" class="cart-btn" data-m="add" style="margin-top:1.1rem"><i class="fa-solid fa-cart-plus"></i> Masukkan Keranjang</button></div></div>';
    modal.classList.add('on'); document.documentElement.style.overflow = 'hidden'; syncNote();
  }
  function closeModal() { if (!modal || !modal.classList.contains('on')) return; modal.classList.remove('on'); if (!drawer || !drawer.classList.contains('on')) document.documentElement.style.overflow = ''; }
  function hideErr() { var e = modal && modal.querySelector('#sm-err'); if (e) e.style.display = 'none'; }
  function showErr(m) { var e = modal.querySelector('#sm-err'); e.textContent = T(m); e.style.display = 'block'; }
  function syncNote() {
    var s = modal.querySelector('#sm-spec'), n = modal.querySelector('#sm-notes'), l = modal.querySelector('#sm-nl'), c = isCustom(s.value);
    l.textContent = c ? T('Catatan spesifik (WAJIB untuk spesifikasi Kustom) *') : T('Catatan (opsional)');
    n.placeholder = c ? T('Wajib diisi: jelaskan ukuran / spesifikasi kustom yang Anda butuhkan...') : T('Contoh: sewa tabung atau tabung milik sendiri...');
  }
  function submitModal() {
    var spec = modal.querySelector('#sm-spec').value, notes = modal.querySelector('#sm-notes').value.trim(), qty = parseInt(modal.querySelector('#sm-qty').value, 10);
    var vs = modal.querySelector('#sm-var'), variant = vs ? vs.value : '';
    if (vs && !variant) return showErr('Pilih jenis terlebih dahulu sebelum menambahkan item.');
    if (isCustom(spec) && !notes) return showErr('Catatan wajib diisi untuk spesifikasi Kustom. Jelaskan ukuran atau kebutuhan Anda.');
    if (!qty || qty < 1) return showErr('Masukkan kuantitas pesanan yang valid.');
    var name = compose(cur.name, variant);
    // item identik (nama + spesifikasi + catatan) digabung jumlahnya
    var same = items.filter(function (x) { return x.name === name && x.spec === spec && (x.notes || '') === notes; })[0];
    if (same) same.qty = String((parseInt(same.qty, 10) || 0) + qty);
    else items.push({ name: name, category: cur.category, categoryLabel: cur.categoryLabel, spec: spec, qty: String(qty), notes: notes });
    persist(); render(); closeModal();
    fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump');
    if (typeof window.showLuxuryToast === 'function') window.showLuxuryToast(T('Masuk Keranjang'), name + ' (' + spec + ') × ' + qty, 'success');
    setTimeout(openDrawer, 350);
  }

  /* ----------------- Tombol "Pesan" di halaman Produk & Layanan ----------------- */
  var rev = null;
  function toId(txt) {       // judul versi English -> judul asli Indonesia
    if (!rev) { rev = {}; try { var d = window.i18n.dictionary; Object.keys(d).forEach(function (k) { rev[String(d[k]).replace(/<[^>]+>/g, '').trim()] = k; }); } catch (e) {} }
    return rev[txt] || txt;
  }
  function productFrom(a) {
    var root = document.getElementById('catalog-start') || document, el = a.parentElement, h = null;
    while (el && el !== root) {
      var hs = el.querySelectorAll('h3,h4');
      if (hs.length === 1) { h = hs[0]; break; }
      el = el.parentElement;
    }
    if (!h) return null;
    var title = h.textContent.replace(/\s+/g, ' ').trim(), idTitle = toId(title);
    var sec = a.closest('section[id^="section-"]'), cat = (sec && SECTION_CAT[sec.id]) || 'gas';
    var img = el.querySelector('img');
    return { idTitle: idTitle, title: title, name: NAME_MAP[idTitle] || NAME_MAP[title] || idTitle, category: cat, categoryLabel: CAT_LABEL[cat], img: img ? img.getAttribute('src') : '' };
  }
  /* ----------------------- Pop-up spesifikasi produk ----------------------- */
  var psEl, psCur = null;
  function pick(v) { return Array.isArray(v) ? v[lang() === 'en' ? 1 : 0] : v; }
  function closeSpec() { if (!psEl || !psEl.classList.contains('on')) return; psEl.classList.remove('on'); document.documentElement.style.overflow = ''; }
  function openSpec(p) {
    var D = (window.PRODUCT_SPECS || {})[p.name]; psCur = p;
    if (!psEl) {
      psEl = document.createElement('div'); psEl.id = 'prod-spec'; document.body.appendChild(psEl);
      psEl.addEventListener('click', function (e) {
        if (e.target === psEl || e.target.closest('[data-ps="close"]')) return closeSpec();
        if (e.target.closest('[data-ps="order"]')) { closeSpec(); openModal(psCur); }
      });
    }
    var rows = D && D.rows ? D.rows.map(function (r) { return '<tr><td>' + esc(T(pick(r[0]))) + '</td><td>' + esc(pick(r[1])) + '</td></tr>'; }).join('') : '';
    var uses = D && D.uses && D.uses.length ? '<h4>' + esc(T('Pemakaian')) + '</h4><ul>' + D.uses.map(function (u) { return '<li>' + esc(pick(u)) + '</li>'; }).join('') + '</ul>' : '';
    var note = D && D.note ? '<div style="margin-top:1rem;background:#fffbeb;border:1px solid #fde68a;border-radius:.25rem;padding:.7rem .85rem;font-size:.74rem;color:#92400e;line-height:1.55"><b>' + esc(T('Catatan keselamatan')) + ':</b> ' + esc(pick(D.note)) + '</div>' : '';
    var sum = D ? pick(D.summary) : '';
    psEl.innerHTML = '<div class="ps-box"><div style="position:relative">' +
      (p.img ? '<div style="height:9rem;background:#0F172A;overflow:hidden"><img src="' + esc(p.img) + '" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.9"></div>' : '') +
      '<button type="button" data-ps="close" aria-label="Tutup" style="position:absolute;top:.5rem;right:.6rem;width:2.1rem;height:2.1rem;border-radius:9999px;border:0;background:rgba(255,255,255,.95);font-size:1.3rem;line-height:1;cursor:pointer">&times;</button></div>' +
      '<div style="padding:1.25rem"><div style="font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#0284c7;font-weight:700">' + esc(T('Spesifikasi')) + '</div>' +
      '<h3 style="font-family:Montserrat,sans-serif;font-size:1.25rem;font-weight:700;color:#0A192F;margin:.2rem 0 .6rem">' + esc(p.title) + '</h3>' +
      (sum ? '<p style="font-size:.8rem;color:#475569;line-height:1.6;margin:0 0 .9rem">' + esc(sum) + '</p>' : '') +
      (rows ? '<table>' + rows + '</table>' : '') + uses + note +
      '<p style="font-size:.68rem;color:#94a3b8;margin:.9rem 0 0">' + esc(T('Informasi umum. Ukuran dan kemurnian pasti dikonfirmasi saat penawaran.')) + '</p>' +
      '<div style="display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap"><button type="button" class="cart-btn" data-ps="order" style="flex:1"><i class="fa-solid fa-cart-plus"></i> ' + esc(T('Pesan Produk Ini')) + '</button>' +
      '<button type="button" class="cart-btn ghost" data-ps="close" style="flex:0 0 auto;width:auto">' + esc(T('Tutup')) + '</button></div></div></div>';
    psEl.classList.add('on'); document.documentElement.style.overflow = 'hidden';
  }
  function injectSpecButtons() {
    document.querySelectorAll('#catalog-start a[href]').forEach(function (a) {
      if (!isQuoteHref(a.getAttribute('href'))) return;
      var n = a.nextElementSibling; if (n && n.hasAttribute('data-spec-btn')) return;
      if (!productFrom(a)) return;
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-spec-btn', ''); b.className = 'prod-spec-btn';
      b.innerHTML = '<i class="fa-solid fa-circle-info"></i> Spesifikasi';
      a.insertAdjacentElement('afterend', b);
    });
  }

  /* ----------------------- Pop-up "Spesifikasi" produk ----------------------- */
  function specFor(p) { var d = cfg('PRODUCT_SPECS'); return d && d[p.idTitle]; }
  function pick(arr, i) { return arr[lang() === 'en' ? 1 : 0] || arr[0]; }
  function labelOf(items) { return items.map(function (it) { var x = pair(it); return T(x[1]); }).join(', '); }
  function autoRows() { return []; } // ukuran/varian sengaja tidak ditampilkan; semua isi diatur di product-specs.js
  function openInfo(p) {
    if (!modal) buildModal();
    cur = p;
    var d = specFor(p) || { rows: [] }, L = cfg('SPEC_LABELS') || {}, en = lang() === 'en';
    var rows = (d.rows || []).map(function (r) { var lb = L[r[0]] ? L[r[0]][en ? 1 : 0] : r[0]; return [lb, en ? r[2] : r[1]]; }).concat(autoRows(p));
    var table = rows.map(function (r) {
      return '<div style="display:flex;gap:.75rem;padding:.6rem 0;border-bottom:1px solid #e2e8f0;font-size:.8rem"><div style="flex:0 0 36%;color:#64748b;font-weight:600">' + esc(r[0]) + '</div><div style="flex:1;color:#0A192F;font-weight:600">' + esc(r[1]) + '</div></div>';
    }).join('');
    var uses = d.uses ? '<div style="margin-top:1rem"><label>' + T('Aplikasi') + '</label><ul style="margin:.2rem 0 0 1.1rem;padding:0;list-style:disc;font-size:.8rem;color:#334155;line-height:1.6">' +
      (d.uses[en ? 'en' : 'id'] || d.uses.id).map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul></div>' : '';
    var note = d.note ? '<p style="margin-top:.9rem;font-size:.72rem;color:#64748b;font-style:italic">' + esc(d.note[en ? 'en' : 'id']) + '</p>' : '';
    modal.innerHTML = '<div class="sm-box"><div style="position:relative">' +
      (p.img ? '<div style="height:9rem;background:#0F172A;overflow:hidden"><img src="' + esc(p.img) + '" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.9"></div>' : '') +
      '<button type="button" data-m="close" aria-label="Tutup" style="position:absolute;top:.5rem;right:.6rem;width:2.1rem;height:2.1rem;border-radius:9999px;border:0;background:rgba(255,255,255,.95);font-size:1.3rem;line-height:1;cursor:pointer">&times;</button></div>' +
      '<div style="padding:1.25rem"><div style="font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#0284c7;font-weight:700">' + esc(T('Spesifikasi')) + ' • ' + esc(T(p.categoryLabel)) + '</div>' +
      '<h3 style="font-family:Montserrat,sans-serif;font-size:1.25rem;font-weight:700;color:#0A192F;margin:.2rem 0 .8rem">' + esc(p.title) + '</h3>' +
      '<div style="border-top:1px solid #e2e8f0">' + (table || '<p style="padding:.8rem 0;font-size:.8rem;color:#64748b">' + T('Spesifikasi lengkap tersedia sesuai permintaan.') + '</p>') + '</div>' + uses + note +
      '<button type="button" class="cart-btn" data-m="order" style="margin-top:1.2rem"><i class="fa-solid fa-cart-plus"></i> ' + T('Pesan Produk Ini') + '</button>' +
      '<button type="button" class="cart-btn ghost" data-m="close" style="margin-top:.6rem">' + T('Tutup') + '</button></div></div>';
    modal.classList.add('on'); document.documentElement.style.overflow = 'hidden';
  }
  function injectSpecButtons() {
    document.querySelectorAll('#catalog-start a[href]').forEach(function (a) {
      if (!isQuoteHref(a.getAttribute('href'))) return;
      if (a.getAttribute('data-spec-btn')) return;
      var p = productFrom(a); if (!p || !specFor(p)) return;
      var b = document.createElement('button'); b.type = 'button';
      var big = a.classList.contains('btn-rolex-pill-dark');
      b.className = 'cart-spec-btn ' + (big ? 'px-8 py-3.5 text-xs uppercase tracking-widest rounded-full border border-slate-400 text-navy-900 hover:bg-slate-100 w-full sm:w-auto text-center font-semibold' : 'text-xs font-bold uppercase text-slate-500 hover:text-sky-600 mr-4');
      b.innerHTML = '<i class="fa-solid fa-circle-info mr-1"></i><span>Spesifikasi</span>';
      a.setAttribute('data-spec-btn', '1'); b._a = a;
      if (big) a.parentNode.insertBefore(b, a.nextSibling); else a.parentNode.insertBefore(b, a);
    });
  }
  function bindProducts() {
    injectSpecButtons(); setTimeout(injectSpecButtons, 1500);
    document.addEventListener('click', function (e) {
      var sb = e.target.closest && e.target.closest('.cart-spec-btn');
      if (sb) { var a2 = sb._a || sb.nextElementSibling, p2 = a2 && productFrom(a2); if (p2) { e.preventDefault(); openInfo(p2); } return; }
    }, true);
    injectSpecButtons();
    document.addEventListener('click', function (e) {
      var sb = e.target.closest && e.target.closest('[data-spec-btn]'); if (!sb) return;
      var p = productFrom(sb.previousElementSibling); if (p) { e.preventDefault(); openSpec(p); }
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('#catalog-start a[href]'); if (!a || !isQuoteHref(a.getAttribute('href'))) return;
      var p = productFrom(a); if (!p) return;
      e.preventDefault(); e.stopPropagation(); openModal(p);
    }, true);
  }

  /* ---------------------- Template pesan WhatsApp (purchase order) ---------------------- */
  function waNumber() {
    var a = document.querySelector('a[href*="wa.me/"]'), m = a && /wa\.me\/(\d+)/.exec(a.getAttribute('href'));
    return m ? m[1] : WA_FALLBACK;
  }
  function makeRef() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }, r = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'PO-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
  }
  function waText(d) {
    var L = [];
    L.push('Halo PT. Candi Oxygen, saya ingin mengajukan pesanan (Purchase Order).', '');
    L.push('*No. Referensi:* ' + d.ref, '');
    L.push('*DATA PEMESAN*');
    L.push('Nama / PIC: ' + (d.name || '-'));
    L.push('Perusahaan: ' + (d.company || '-'));
    L.push('Bidang: ' + (d.clientType || '-'));
    L.push('Email: ' + (d.email || '-'));
    L.push('WhatsApp / Telp: ' + (d.phone || '-'), '');
    L.push('*RINCIAN PESANAN (' + d.items.length + ' item)*');
    d.items.forEach(function (it, i) {
      L.push((i + 1) + '. ' + it.name);
      L.push('    Spesifikasi: ' + it.spec);
      L.push('    Jumlah: ' + it.qty);
      if (it.notes && it.notes !== 'Preset Langsung') L.push('    Catatan: ' + it.notes);
    });
    L.push('', '*PENGIRIMAN*');
    L.push('PIC Lapangan: ' + (d.pic || '-') + (d.picPhone ? ' (' + d.picPhone + ')' : ''));
    L.push('Alamat: ' + (d.address || '-'));
    L.push('Kab / Kota: ' + (d.city || '-'));
    if (d.schedule) L.push('Frekuensi / Jadwal: ' + d.schedule);
    if (d.notes) L.push('Catatan: ' + d.notes);
    L.push('', 'Mohon konfirmasi ketersediaan dan penawaran harganya. Terima kasih.');
    return L.join('\n');
  }
  function waLink(d) { return 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(waText(d)); }

  function mailTo() {
    var a = document.querySelector('a[href^="mailto:"]'), m = a && /^mailto:([^?]+)/.exec(a.getAttribute('href'));
    return m ? m[1] : 'cdosidoarjo@gmail.com';
  }
  function mailLink(d) {
    var body = waText(d).replace(/\*/g, '').replace('Halo PT. Candi Oxygen, saya ingin mengajukan pesanan (Purchase Order).', 'Yth. PT. Candi Oxygen,\nBerikut pengajuan pesanan (Purchase Order) dari kami:').replace('Mohon konfirmasi', 'Mohon konfirmasi') + '\n\nHormat kami,\n' + (d.name || '') + (d.company ? '\n' + d.company : '');
    return 'mailto:' + mailTo() + '?subject=' + encodeURIComponent('Pesanan (PO) ' + d.ref + (d.company ? ' - ' + d.company : '')) + '&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n'));
  }

  // Buka langsung jendela tulis Gmail (To, Subjek, Isi sudah terisi) -> pengguna tinggal periksa lalu klik Kirim
  function gmailLink(d) {
    var m = /^mailto:[^?]*\?subject=([^&]*)&body=(.*)$/.exec(mailLink(d));
    return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(mailTo()) + '&su=' + (m ? m[1] : '') + '&body=' + (m ? m[2] : '');
  }

  /* ---------------------------------- API publik ---------------------------------- */
  window.CandiCart = {
    items: function () { return items.map(function (x) { return Object.assign({}, x); }); },
    set: function (arr) { items = (arr || []).map(function (x) { return Object.assign({}, x); }); persist(); render(); },
    clear: function () { items = []; persist(); render(); },
    count: count, open: openDrawer, makeRef: makeRef, waText: waText, waLink: waLink, mailLink: mailLink, gmailLink: gmailLink
  };

  /* Tombol bebas: <button data-cart-order="Judul Produk"> / <button data-cart-spec="Judul Produk"> (mis. di Beranda) */
  function productByTitle(idTitle, img) {
    var name = NAME_MAP[idTitle] || idTitle;
    var cat = /^(Filling|Delivery|Gas Piping|Purging|Spare|Maintenance)/.test(idTitle) ? 'service' : (/^(Valve|Cryogenic|Cylinder|Regulator|Cradle|Flowmeter|Gas Outlet|Bed Head|Humidifier|Alarm)/.test(idTitle) ? 'equipment' : 'gas');
    var shown = lang() === 'en' && window.t ? window.t(idTitle) : idTitle;
    return { idTitle: idTitle, title: shown, name: name, category: cat, categoryLabel: CAT_LABEL[cat], img: img || '' };
  }
  function bindDataButtons() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-cart-order],[data-cart-spec]'); if (!b) return;
      e.preventDefault();
      var t = b.getAttribute('data-cart-order') || b.getAttribute('data-cart-spec'), img = b.getAttribute('data-cart-img') || '';
      var p = productByTitle(t, img);
      if (b.hasAttribute('data-cart-spec')) openInfo(p); else openModal(p);
    });
  }

  function init() {
    bindDataButtons();
    build();
    if (hasCatalog()) bindProducts();
    window.addEventListener('storage', function (e) { if (e.key === KEY) { items = load(); render(); } });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.lang-btn')) setTimeout(function () { rev = null; render(); }, 150);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
