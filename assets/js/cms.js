/* =============================================================================
   PT. CANDI OXYGEN — CMS RINGAN + PELACAK PENGUNJUNG  (assets/js/cms.js)
   =============================================================================
   File ini dipasang di SEMUA halaman (paling bawah, setelah main.js).
   Tugasnya:
     1. Mengambil perubahan dari admin (tabel site_content di Supabase) lalu
        menerapkannya ke halaman: teks ID/EN, gambar, link, kartu yang
        disembunyikan / diduplikasi, serta pilihan produk di form penawaran.
     2. Mode edit visual (dipakai panel admin lewat iframe, ?cms_edit=1).
     3. Mencatat kunjungan (dari mana pengunjung datang) ke tabel page_views.

   Anda TIDAK perlu mengedit file ini. Semua pengaturan dilakukan lewat admin.html.
   Kalau Supabase belum diisi, website tampil seperti biasa (tanpa perubahan).
   ============================================================================= */
(function () {
  'use strict';

  var Q = new URLSearchParams(location.search);
  var IN_FRAME = window.parent !== window;
  var EDIT = Q.get('cms_edit') === '1' && IN_FRAME;
  var PROBE = Q.get('cms_probe') === '1' && IN_FRAME;
  var PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (PAGE.indexOf('.') < 0) PAGE += '.html';   // Netlify menampilkan /career tanpa .html
  var CACHE_KEY = 'candiCmsCache1';
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1, OPTION: 1 };
  var NOT_CARD = { SECTION: 1, MAIN: 1, HEADER: 1, FOOTER: 1, NAV: 1, BODY: 1, HTML: 1, FORM: 1 };

  var origText = new WeakMap();   // node teks -> teks asli (HTML sumber)
  var undo = [];                  // fungsi pembatal perubahan (untuk render ulang)
  var M = emptyModel();           // model data terakhir
  var quoteBase = null;           // pengaturan form penawaran bawaan (sebelum diubah admin)

  function emptyModel() { return { text: {}, img: {}, href: {}, hide: {}, clones: [], config: {}, scoped: {} }; }
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function dict() { return (window.i18n && window.i18n.dictionary) || {}; }
  function client() { try { if (typeof supabaseClient !== 'undefined' && supabaseClient) return supabaseClient; } catch (e) {} return null; }
  function cloneJSON(o) { return JSON.parse(JSON.stringify(o)); }

  /* ------------------------------ Util DOM -------------------------------- */
  function skipped(n) {
    for (var p = n.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP[p.tagName] || (p.hasAttribute && (p.hasAttribute('data-no-cms') || p.id === 'order-table-body'))) return true;
    }
    return false;
  }
  function textNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, list = [];
    while ((n = w.nextNode())) { if (norm(n.nodeValue) && !skipped(n)) list.push(n); }
    return list;
  }
  function isCard(el) {
    var par = el.parentElement;
    if (!par || NOT_CARD[el.tagName]) return false;
    if (!el.querySelector('h1,h2,h3,h4,h5,h6')) return false;
    if (el.textContent.length > 2500) return false;
    for (var i = 0; i < par.children.length; i++) {
      var s = par.children[i];
      if (s !== el && s.tagName === el.tagName && s.className === el.className) return true;
    }
    return false;
  }

  /* ------------------- Tangkap kondisi ASLI halaman (sekali) --------------- */
  function capture() {
    textNodes(document.body).forEach(function (n) { origText.set(n, n.nodeValue); });
    [].forEach.call(document.querySelectorAll('img[src]'), function (i) { i.setAttribute('data-cms-orig-src', i.getAttribute('src')); });
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) { a.setAttribute('data-cms-orig-href', a.getAttribute('href')); });
    var seen = {};
    [].forEach.call(document.body.querySelectorAll('*'), function (el) {
      if (!isCard(el)) return;
      var h = el.querySelector('h1,h2,h3,h4,h5,h6');
      var base = PAGE + '|' + norm(h.textContent), k = base;
      seen[base] = (seen[base] || 0) + 1;
      if (seen[base] > 1) k = base + '#' + seen[base];
      el.setAttribute('data-cms-sig', k);
    });
    if (PAGE === 'quote.html' && typeof VARIANTS !== 'undefined') {
      var sel = document.getElementById('order-item-select');
      quoteBase = {
        SPECS: cloneJSON(SPECS), PER_PRODUCT: cloneJSON(PER_PRODUCT), VARIANTS: cloneJSON(VARIANTS),
        options: sel ? [].map.call(sel.options, function (o) {
          return { value: o.value, label: o.textContent.trim(), category: o.getAttribute('data-category') || '', catLabel: o.getAttribute('data-category-label') || '' };
        }) : []
      };
    }
  }

  /* ------------------------------ Model data ------------------------------ */
  function parse(rows) {
    var m = emptyModel();
    (rows || []).forEach(function (r) {
      var s = r.scope || '';
      if (r.kind === 'clone') { m.clones.push(r); return; }
      if (r.kind === 'config') { try { m.config[r.key] = JSON.parse(r.value_id); } catch (e) {} return; }
      if (r.kind === 'hide') { m.hide[r.key] = true; return; }
      if (r.kind !== 'text' && r.kind !== 'img' && r.kind !== 'href') return;
      var tgt = m;
      if (s) { m.scoped[s] = m.scoped[s] || { text: {}, img: {}, href: {} }; tgt = m.scoped[s]; }
      tgt[r.kind][r.key] = { id: r.value_id, en: r.value_en };
    });
    m.clones.sort(function (a, b) { return (a.position || 0) - (b.position || 0); });
    return m;
  }
  function pick(map, scope, key) {
    if (scope && M.scoped[scope] && M.scoped[scope][map][key]) return M.scoped[scope][map][key];
    return M[map][key] || null;
  }

  /* ---------------------------- Terapkan ke halaman ------------------------ */
  function undoAll() {
    for (var i = undo.length - 1; i >= 0; i--) { try { undo[i](); } catch (e) {} }
    undo = [];
    [].forEach.call(document.querySelectorAll('[data-cms-clone]'), function (c) { c.remove(); });
  }

  function registerDict(m) {
    var D = dict();
    function reg(o) {
      Object.keys(o).forEach(function (k) {
        var v = o[k];
        if (v && v.id != null && v.en) D[norm(v.id)] = v.en;
      });
    }
    reg(m.text);
    Object.keys(m.scoped).forEach(function (s) { reg(m.scoped[s].text); });
  }

  function buildClones() {
    var last = {};
    M.clones.forEach(function (r) {
      var parts = r.key.split('|');
      if (parts[0] !== PAGE) return;
      var tpl = document.querySelector('[data-cms-sig="' + r.key.replace(/"/g, '\\"') + '"]:not([data-cms-clone])');
      if (!tpl) return;
      var c = tpl.cloneNode(true);
      [].forEach.call(c.querySelectorAll('[id]'), function (e) { e.removeAttribute('id'); });
      [c].concat([].slice.call(c.querySelectorAll('.reveal-on-scroll'))).forEach(function (e) {
        e.classList.remove('reveal-on-scroll');
      });
      c.setAttribute('data-cms-clone', r.scope);
      var a = textNodes(tpl), b = textNodes(c);
      b.forEach(function (n, i) { origText.set(n, a[i] ? (origText.get(a[i]) || a[i].nodeValue) : n.nodeValue); });
      var ref = last[r.key] || tpl;
      ref.parentNode.insertBefore(c, ref.nextSibling);
      last[r.key] = c;
    });
  }

  function applyTexts() {
    textNodes(document.body).forEach(function (n) {
      var o = origText.get(n);
      if (o === undefined) return;
      var cl = n.parentElement && n.parentElement.closest('[data-cms-clone]');
      var ov = pick('text', cl ? cl.getAttribute('data-cms-clone') : '', norm(o));
      if (!ov || ov.id == null) return;
      var cur = n.nodeValue;
      var lead = o.match(/^\s*/)[0], trail = o.match(/\s*$/)[0];
      n.nodeValue = lead + ov.id + trail;
      undo.push(function () { n.nodeValue = cur; });
    });
  }

  function applyAttr(sel, attr, origAttr, map) {
    [].forEach.call(document.querySelectorAll(sel), function (el) {
      var o = el.getAttribute(origAttr);
      if (o == null) return;
      var cl = el.closest('[data-cms-clone]');
      var ov = pick(map, cl ? cl.getAttribute('data-cms-clone') : '', o);
      if (!ov || !ov.id || /^\s*javascript:/i.test(ov.id)) return;
      var cur = el.getAttribute(attr);
      el.setAttribute(attr, ov.id);
      if (attr === 'src') { var ss = el.getAttribute('srcset'); if (ss) { el.removeAttribute('srcset'); undo.push(function () { el.setAttribute('srcset', ss); }); } }
      undo.push(function () { el.setAttribute(attr, cur); });
    });
  }

  function applyHide() {
    Object.keys(M.hide).forEach(function (k) {
      if (k.split('|')[0] !== PAGE) return;
      var el = document.querySelector('[data-cms-sig="' + k.replace(/"/g, '\\"') + '"]:not([data-cms-clone])');
      if (!el) return;
      if (EDIT) { el.setAttribute('data-cms-hidden', '1'); undo.push(function () { el.removeAttribute('data-cms-hidden'); }); }
      else { var d = el.style.display; el.style.display = 'none'; undo.push(function () { el.style.display = d; }); }
    });
  }

  /* ----------- Form penawaran: produk tambahan / varian / ukuran ----------- */
  function applyQuote() {
    if (PAGE !== 'quote.html' || !quoteBase) return;
    var sel = document.getElementById('order-item-select');
    if (!sel) return;
    var cfg = M.config.quote || {}, products = cfg.products || [], hidden = cfg.hidden || [], over = cfg.overrides || {};

    [['PER_PRODUCT', PER_PRODUCT], ['VARIANTS', VARIANTS]].forEach(function (p) {
      Object.keys(p[1]).forEach(function (k) { delete p[1][k]; });
      var b = quoteBase[p[0]];
      Object.keys(b).forEach(function (k) { p[1][k] = cloneJSON(b[k]); });
    });

    var keep = sel.value;
    [].slice.call(sel.options).forEach(function (o) {
      if (hidden.indexOf(o.value) !== -1) {
        var par = o.parentNode, nx = o.nextSibling;
        o.remove();
        undo.push(function () { par.insertBefore(o, nx); });
      }
    });
    products.forEach(function (p) {
      if (!p.name || [].some.call(sel.options, function (o) { return o.value === p.name; })) return;
      var o = document.createElement('option');
      o.value = p.name; o.textContent = p.label || p.name;
      o.setAttribute('data-category', p.category || 'gas');
      o.setAttribute('data-category-label', p.catLabel || ({ gas: 'Produk Gas', service: 'Layanan Servis', equipment: 'Perlengkapan Gas' }[p.category] || 'Produk Gas'));
      var same = [].filter.call(sel.options, function (x) { return x.getAttribute('data-category') === (p.category || 'gas'); });
      var ref = same.length ? same[same.length - 1] : null;
      if (ref) ref.parentNode.insertBefore(o, ref.nextSibling); else sel.appendChild(o);
      undo.push(function () { o.remove(); });
      if (p.specs) PER_PRODUCT[p.name] = [{ label: 'Ukuran / Spesifikasi', items: p.specs }];
      if (p.variant && p.variant.items && p.variant.items.length) VARIANTS[p.name] = p.variant;
    });
    Object.keys(over).forEach(function (name) {
      var ov = over[name] || {};
      if (ov.specs) PER_PRODUCT[name] = [{ label: 'Ukuran / Spesifikasi', items: ov.specs }];
      if (ov.variant === false) delete VARIANTS[name];
      else if (ov.variant && ov.variant.items && ov.variant.items.length) VARIANTS[name] = ov.variant;
    });
    if ([].some.call(sel.options, function (o) { return o.value === keep; })) sel.value = keep;
    else if (sel.options.length) sel.selectedIndex = 0;
    sel.dispatchEvent(new Event('change'));
  }

  /* ------------- Pencarian header: produk tambahan ikut muncul ------------- */
  function applyCatalog() {
    var cat; try { cat = candiSearchCatalog; } catch (e) { return; }
    if (!cat) return;
    for (var i = cat.length - 1; i >= 0; i--) if (cat[i].cms) cat.splice(i, 1);
    var cfg = M.config.quote || {};
    (cfg.products || []).forEach(function (p) {
      if (!p.name || p.search === false) return;
      var c = p.category === 'service' ? 'services' : p.category === 'equipment' ? 'equipment' : 'gases';
      cat.push({
        cms: true, id: 'cms-' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), keywords: p.name.toLowerCase(),
        name: p.label || p.name, category: c,
        categoryLabel: { gases: 'PRODUK GAS', services: 'LAYANAN PROFESIONAL', equipment: 'PERLENGKAPAN GAS' }[c],
        desc: p.desc || 'Produk terbaru PT. Candi Oxygen', tag: 'TERBARU',
        target: 'products.html#section-' + c, specTitle: p.label || p.name
      });
    });
  }

  function apply(rows) {
    var lang = window.getLanguage ? window.getLanguage() : 'id';
    if (window.i18n && lang === 'en') window.i18n.setLanguage('id', false);
    undoAll();
    M = parse(rows);
    try { registerDict(M); buildClones(); applyTexts(); applyAttr('img[data-cms-orig-src]', 'src', 'data-cms-orig-src', 'img');
      applyAttr('a[data-cms-orig-href]', 'href', 'data-cms-orig-href', 'href'); applyHide(); applyQuote(); applyCatalog(); }
    catch (e) { console.warn('[CMS] gagal menerapkan perubahan:', e); }
    if (window.i18n && lang === 'en') window.i18n.setLanguage('en', false);
  }

  /* ------------------------------- Ambil data ------------------------------ */
  function fetchRemote() {
    var c = client();
    if (!c) return Promise.resolve(null);
    return c.from('site_content').select('kind,key,scope,value_id,value_en,position').limit(5000)
      .then(function (r) { return (r && !r.error && r.data) ? r.data : null; }, function () { return null; });
  }
  function readCache() { try { return localStorage.getItem(CACHE_KEY) || ''; } catch (e) { return ''; } }
  function writeCache(s) { try { localStorage.setItem(CACHE_KEY, s); } catch (e) {} }

  /* ------------------------------ Mode edit visual ------------------------- */
  function currentText(n, scope) {
    var o = norm(origText.get(n) !== undefined ? origText.get(n) : n.nodeValue);
    var ov = pick('text', scope, o);
    var id = (ov && ov.id != null) ? ov.id : o;
    var en = (ov && ov.en) ? ov.en : (dict()[norm(id)] || '');
    return { orig: o, id: id, en: en.replace(/<[^>]+>/g, '') };
  }
  function inspect(t) {
    var out = { page: PAGE, texts: [], img: null, href: null, card: null, scope: '' };
    var cl = t.closest('[data-cms-clone]');
    out.scope = cl ? cl.getAttribute('data-cms-clone') : '';
    var own = [].filter.call(t.childNodes, function (n) { return n.nodeType === 3 && norm(n.nodeValue) && !skipped(n); });
    var nodes = own.length ? own : textNodes(t).slice(0, 6);
    var seen = {};
    nodes.forEach(function (n) {
      var c = currentText(n, out.scope);
      if (!seen[c.orig]) { seen[c.orig] = 1; out.texts.push(c); }
    });
    var img = t.tagName === 'IMG' ? t : (!out.texts.length && t.querySelector ? t.querySelector('img') : null);
    if (img && img.getAttribute('data-cms-orig-src') != null) {
      var o = img.getAttribute('data-cms-orig-src'), ov = pick('img', out.scope, o);
      out.img = { orig: o, cur: ov && ov.id ? ov.id : o, src: img.currentSrc || img.src };
    }
    var a = t.closest('a[data-cms-orig-href]');
    if (a) {
      var ho = a.getAttribute('data-cms-orig-href'), hv = pick('href', out.scope, ho);
      out.href = { orig: ho, cur: hv && hv.id ? hv.id : ho };
    }
    var card = t.closest('[data-cms-sig]');
    if (card) {
      var h = card.querySelector('h1,h2,h3,h4,h5,h6');
      var sec = card.closest('[data-category]');
      out.card = {
        sig: card.getAttribute('data-cms-sig'), isClone: card.hasAttribute('data-cms-clone'),
        scope: card.getAttribute('data-cms-clone') || '', hidden: card.hasAttribute('data-cms-hidden'),
        title: h ? norm(h.textContent) : '', section: sec ? sec.getAttribute('data-category') : ''
      };
    }
    return out;
  }

  function startEditMode() {
    var st = document.createElement('style');
    st.textContent = '.cms-hover{outline:2px dashed #38bdf8!important;outline-offset:2px;cursor:pointer!important}' +
      '.cms-sel{outline:3px solid #0284c7!important;outline-offset:2px}' +
      '[data-cms-hidden]{opacity:.35!important;outline:2px dashed #ef4444!important}' +
      '[data-cms-clone]{box-shadow:0 0 0 2px #10b981}' +
      '*{scroll-behavior:auto!important}';
    document.head.appendChild(st);
    var prev = null, sel = null;
    document.addEventListener('mouseover', function (e) {
      if (prev) prev.classList.remove('cms-hover');
      prev = e.target; if (prev && prev.classList) prev.classList.add('cms-hover');
    }, true);
    document.addEventListener('mouseout', function () { if (prev) { prev.classList.remove('cms-hover'); prev = null; } }, true);
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.lang-btn')) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (sel) sel.classList.remove('cms-sel');
      sel = e.target; sel.classList.add('cms-sel');
      post({ cms: 'select', data: inspect(e.target) });
    }, true);
    document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.cms === 'reload') fetchRemote().then(function (rows) {
        var y = window.scrollY; if (rows) apply(rows); window.scrollTo(0, y);
        if (sel) sel.classList.remove('cms-sel'); sel = null; post({ cms: 'reloaded' });
      });
    });
  }
  function post(msg) { try { window.parent.postMessage(msg, location.origin); } catch (e) {} }

  /* --------------------------- Pelacak pengunjung -------------------------- */
  var REF_MAP = [
    [/(^|\.)instagram\.com$|^l\.instagram\.com$/, 'instagram', 'social'],
    [/(^|\.)(facebook\.com|fb\.com|fb\.me|l\.facebook\.com|lm\.facebook\.com)$/, 'facebook', 'social'],
    [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin', 'social'],
    [/(^|\.)(tiktok\.com|vm\.tiktok\.com)$/, 'tiktok', 'social'],
    [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube', 'social'],
    [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'x', 'social'],
    [/(^|\.)(wa\.me|whatsapp\.com|web\.whatsapp\.com|api\.whatsapp\.com)$/, 'whatsapp', 'messaging'],
    [/(^|\.)(t\.me|telegram\.org|web\.telegram\.org)$/, 'telegram', 'messaging'],
    [/(^|\.)google\.[a-z.]+$/, 'google', 'search'],
    [/(^|\.)bing\.com$/, 'bing', 'search'],
    [/(^|\.)(yahoo\.com|duckduckgo\.com|yandex\.[a-z]+|baidu\.com|ecosia\.org)$/, 'search-lain', 'search']
  ];
  function detectSource() {
    var utm = (Q.get('utm_source') || Q.get('ref') || '').toLowerCase().trim();
    if (utm) {
      var med = (Q.get('utm_medium') || '').toLowerCase();
      var known = { instagram: 'social', ig: 'social', facebook: 'social', linkedin: 'social', tiktok: 'social', youtube: 'social', whatsapp: 'messaging', wa: 'messaging', google: 'search', email: 'email', brosur: 'offline', qr: 'offline' };
      return { source: utm === 'ig' ? 'instagram' : utm === 'wa' ? 'whatsapp' : utm.slice(0, 60), medium: med || known[utm] || 'campaign', host: '', campaign: (Q.get('utm_campaign') || '').slice(0, 80) };
    }
    var host = '';
    try { host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''; } catch (e) {}
    if (host && host !== location.hostname) {
      for (var i = 0; i < REF_MAP.length; i++) if (REF_MAP[i][0].test(host)) return { source: REF_MAP[i][1], medium: REF_MAP[i][2], host: host, campaign: '' };
      return { source: host.replace(/^www\./, ''), medium: 'referral', host: host, campaign: '' };
    }
    var ua = navigator.userAgent || '';
    if (/Instagram/i.test(ua)) return { source: 'instagram', medium: 'social', host: '', campaign: '' };
    if (/FBAN|FBAV|FB_IAB/i.test(ua)) return { source: 'facebook', medium: 'social', host: '', campaign: '' };
    if (/LinkedInApp/i.test(ua)) return { source: 'linkedin', medium: 'social', host: '', campaign: '' };
    if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return { source: 'tiktok', medium: 'social', host: '', campaign: '' };
    if (/WhatsApp/i.test(ua)) return { source: 'whatsapp', medium: 'messaging', host: '', campaign: '' };
    return { source: 'direct', medium: 'direct', host: '', campaign: '' };
  }
  function rid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function track() {
    if (IN_FRAME || EDIT || PROBE) return;
    var c = client();
    if (!c) return;
    try { if (localStorage.getItem('candiNoTrack') === '1') return; } catch (e) {}
    if (/bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent || '')) return;
    var vid, sid, src;
    try {
      vid = localStorage.getItem('candiVid'); if (!vid) { vid = rid(); localStorage.setItem('candiVid', vid); }
      sid = sessionStorage.getItem('candiSid');
      if (!sid) { sid = rid(); sessionStorage.setItem('candiSid', sid); src = detectSource(); sessionStorage.setItem('candiSrc', JSON.stringify(src)); }
      else src = JSON.parse(sessionStorage.getItem('candiSrc') || 'null');
    } catch (e) { vid = vid || rid(); sid = sid || rid(); }
    src = src || detectSource();
    var w = window.innerWidth || 0;
    c.from('page_views').insert([{
      visitor_id: vid, session_id: sid, path: PAGE, source: src.source, medium: src.medium,
      referrer_host: src.host || null, campaign: src.campaign || null,
      device: w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop',
      lang: (window.getLanguage ? window.getLanguage() : 'id'), screen_w: w
    }]).then(function () {}, function () {});
  }

  /* ---------------------------- Lowongan karir ----------------------------- */
  // Halaman karir membaca daftar lowongan dari tabel job_openings (diatur lewat admin).
  // Selama admin belum mengaktifkan pengaturan ini, kartu lowongan bawaan di HTML tetap dipakai.
  var JOB_KEY = 'candiJobsCache1';
  var JOB_COL = { sky: ['#e0f2fe', '#0369a1'], emerald: ['#d1fae5', '#047857'], purple: ['#f3e8ff', '#7e22ce'], amber: ['#fef3c7', '#b45309'], rose: ['#ffe4e6', '#be123c'], slate: ['#e2e8f0', '#334155'] };
  var jobStatic = null;
  function escH(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bindApply(root) {
    var modal = document.getElementById('career-modal');
    if (!modal) return;
    [].forEach.call(root.querySelectorAll('[data-open-apply]'), function (btn) {
      btn.addEventListener('click', function () {
        var role = btn.getAttribute('data-career-role') || 'Posisi Spesialis';
        var inp = modal.querySelector('#careerPosition'), disp = modal.querySelector('#careerRoleTitle');
        if (inp) inp.value = role; if (disp) disp.textContent = role;
        modal.classList.remove('hidden'); document.body.style.overflow = 'hidden';
      });
    });
  }
  function jobCard(j) {
    var c = JOB_COL[j.color] || JOB_COL.sky;
    return '<div class="p-8 bg-slate-50 rounded-sm border border-slate-200 shadow-luxury-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-sky-500 transition-colors">' +
      '<div class="space-y-3 max-w-2xl"><div class="flex flex-wrap items-center gap-3">' +
      (j.category ? '<span class="px-2.5 py-0.5 rounded font-mono text-[11px] font-bold" style="background:' + c[0] + ';color:' + c[1] + '">' + escH(j.category) + '</span>' : '') +
      (j.location ? '<span class="text-xs text-slate-500"><i class="fa-solid fa-location-dot mr-1 text-sky-600"></i> ' + escH(j.location) + '</span>' : '') + '</div>' +
      '<h3 class="font-luxury-serif text-xl sm:text-2xl font-bold text-navy-900">' + escH(j.title) + '</h3>' +
      (j.description ? '<p class="text-slate-600 text-xs leading-relaxed">' + escH(j.description) + '</p>' : '') +
      ((j.detail1 || j.detail2) ? '<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono pt-1">' + (j.detail1 ? '<span>' + escH(j.detail1) + '</span>' : '') + (j.detail1 && j.detail2 ? '<span>&bull;</span>' : '') + (j.detail2 ? '<span>' + escH(j.detail2) + '</span>' : '') + '</div>' : '') + '</div>' +
      '<button class="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full shrink-0" data-open-apply data-career-role="' + escH(j.apply_role || j.title) + '">Lamar Posisi Ini</button></div>';
  }
  function jobsRender(st) {
    var act = document.getElementById('active-positions-container'), none = document.getElementById('no-positions-container');
    if (!act || !none) return;
    if (!jobStatic) jobStatic = { html: act.innerHTML, actHidden: act.classList.contains('hidden'), noneHidden: none.classList.contains('hidden') };
    if (!st || !st.managed) {            // kembali ke kartu bawaan
      if (act.getAttribute('data-jobs-dyn')) {
        act.innerHTML = jobStatic.html; act.removeAttribute('data-jobs-dyn');
        act.classList.toggle('hidden', jobStatic.actHidden); none.classList.toggle('hidden', jobStatic.noneHidden); bindApply(act);
      }
      return;
    }
    var list = st.jobs || [], d = dict();
    list.forEach(function (j) {
      var en = j.en || {};
      [['title', j.title], ['category', j.category], ['location', j.location], ['description', j.description], ['detail1', j.detail1], ['detail2', j.detail2]].forEach(function (p) {
        if (p[1] && en[p[0]] && String(en[p[0]]).trim()) d[norm(p[1])] = String(en[p[0]]).trim();
      });
    });
    act.setAttribute('data-jobs-dyn', '1');
    if (!list.length) { act.innerHTML = ''; act.classList.add('hidden'); none.classList.remove('hidden'); return; }
    act.innerHTML = list.map(jobCard).join('');
    act.classList.remove('hidden'); none.classList.add('hidden');
    bindApply(act);
  }
  function loadJobs() {
    var c = client(); if (!c) return;
    var cached = null; try { cached = JSON.parse(localStorage.getItem(JOB_KEY) || 'null'); } catch (e) {}
    if (cached) jobsRender(cached);
    Promise.all([
      c.from('site_content').select('value_id').match({ kind: 'config', key: 'careers', scope: '' }).maybeSingle(),
      c.from('job_openings').select('*').eq('is_active', true).order('sort_order', { ascending: true }).order('id', { ascending: true })
    ]).then(function (r) {
      if (r[0].error || r[1].error) return;
      var managed = false; try { managed = !!JSON.parse(r[0].data.value_id).managed; } catch (e) {}
      var st = { managed: managed, jobs: r[1].data || [] }, str = JSON.stringify(st);
      if (str !== JSON.stringify(cached)) { jobsRender(st); try { localStorage.setItem(JOB_KEY, str); } catch (e) {} }
    }, function () {});
  }

  /* ------------------------------- Portofolio ------------------------------ */
  // Halaman portofolio membaca kartu proyek dari tabel portfolio_items (diatur lewat admin).
  // Selama admin belum mengaktifkan pengaturan ini, kartu bawaan di HTML tetap dipakai.
  var PF_KEY = 'candiPortfolioCache1';
  var PF_BADGE = { navy: '#0A192F', sky: '#0284c7', emerald: '#047857', amber: '#b45309', rose: '#be123c', slate: '#334155' };
  var PF_TXT = { emerald: '#059669', sky: '#0284c7', amber: '#d97706', rose: '#e11d48', slate: '#475569', navy: '#0A192F' };
  var pfStatic = null, pfItems = [];
  function pfCard(p) {
    var bc = PF_BADGE[p.badge_color] || PF_BADGE.navy, sc = PF_TXT[p.status_color] || PF_TXT.emerald, fc = PF_TXT[p.foot_color] || PF_TXT.emerald;
    return '<div class="portfolio-item luxury-image-card bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shadow-luxury-sm group transition-all duration-300 cursor-pointer" tabindex="0" role="button" data-pf-id="' + p.id + '" data-category="' + escH(p.category || 'industri') + '">' +
      '<div class="relative h-64 overflow-hidden bg-slate-200">' + (p.image_url ? '<img src="' + escH(p.image_url) + '" alt="' + escH(p.image_alt || p.title) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">' : '') +
      (p.badge ? '<div class="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm" style="background:' + bc + '">' + escH(p.badge) + '</div>' : '') + '</div>' +
      '<div class="p-8 space-y-4">' +
      ((p.location || p.status) ? '<div class="flex items-center justify-between gap-3 text-xs text-slate-400"><span>' + escH(p.location || '') + '</span><span class="font-mono font-semibold text-right" style="color:' + sc + '">' + escH(p.status || '') + '</span></div>' : '') +
      '<h3 class="font-luxury-serif text-xl font-bold text-navy-900 group-hover:text-sky-600 transition-colors">' + escH(p.title) + '</h3>' +
      (p.description ? '<p class="text-slate-600 text-xs leading-relaxed">' + escH(p.description) + '</p>' : '') +
      ((p.foot_left || p.foot_right) ? '<div class="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 text-[11px] text-slate-500 font-mono"><span>' + escH(p.foot_left || '') + '</span><span class="font-bold text-right" style="color:' + fc + '">' + escH(p.foot_right || '') + '</span></div>' : '') +
      '<div class="pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600 group-hover:text-navy-900 transition-colors">Lihat Detail →</div>' +
      '</div></div>';
  }
  // Tombol filter: bawaan (Medis, Filling Station, Industri) + filter tambahan dari admin + "Lainnya" (paling akhir)
  function pfFilterBar(st) {
    var base = document.querySelector('.portfolio-filter-btn[data-filter="industri"]'); if (!base) return;
    [].forEach.call(document.querySelectorAll('.portfolio-filter-btn[data-pf-extra]'), function (b) { b.remove(); });
    if (!st || !st.managed) return;
    var d = dict(), last = base;
    var list = (st.filters || []).filter(function (f) { return f && f.key && f.label; }).concat([{ key: 'lainnya', label: 'Lainnya' }]);
    list.forEach(function (f) {
      var b = base.cloneNode(false);
      b.removeAttribute('data-i18n'); b.setAttribute('data-filter', f.key); b.setAttribute('data-pf-extra', '1');
      b.className = 'portfolio-filter-btn px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.16em] transition-all bg-white text-navy-900 border border-slate-200 hover:border-navy-900';
      b.textContent = f.label;
      if (f.en && String(f.en).trim()) d[norm(f.label)] = String(f.en).trim();
      last.parentNode.insertBefore(b, last.nextSibling); last = b;
    });
    if (!d[norm('Lainnya')]) d[norm('Lainnya')] = 'Others';
  }
  function pfRender(st) {
    pfFilterBar(st);
    var box = document.getElementById('portfolio-container'); if (!box) return;
    if (!pfStatic) pfStatic = box.innerHTML;
    if (!st || !st.managed) {
      if (box.getAttribute('data-pf-dyn')) { box.innerHTML = pfStatic; box.removeAttribute('data-pf-dyn'); }
      return;
    }
    var list = st.items || [], d = dict(); pfItems = list;
    [['Lihat Detail →', 'View Details →'], ['Ikhtisar Proyek', 'Project Overview'], ['Penjelasan', 'Description'], ['Galeri Foto', 'Photo Gallery'], ['Tutup', 'Close']].forEach(function (x) { d[norm(x[0])] = x[1]; });
    list.forEach(function (p) {
      var en = p.en || {};
      [['title', p.title], ['badge', p.badge], ['location', p.location], ['status', p.status], ['description', p.description], ['foot_left', p.foot_left], ['foot_right', p.foot_right]].forEach(function (x) {
        if (x[1] && en[x[0]] && String(en[x[0]]).trim()) d[norm(x[1])] = String(en[x[0]]).trim();
      });
    });
    box.setAttribute('data-pf-dyn', '1');
    box.innerHTML = list.length ? list.map(pfCard).join('') :
      '<div class="col-span-full text-center text-slate-500 text-sm py-16">Daftar proyek segera diperbarui.</div>';
    var act = document.querySelector('.portfolio-filter-btn.bg-navy-900'); // pertahankan filter yang sedang aktif
    if (act && act.getAttribute('data-filter') !== 'all') act.click();
  }
  /* Detail proyek: klik kartu -> ikhtisar, penjelasan, galeri foto */
  function pfLines(t) { return escH(t).replace(/\n/g, '<br>'); }
  function pfFromDom(el) {
    var q = function (sel) { var n = el.querySelector(sel); return n ? n.textContent.trim() : ''; };
    var im = el.querySelector('img'), sp = el.querySelectorAll('.p-8 > div > span'), ft = el.querySelectorAll('.border-t span');
    return { title: q('h3'), image_url: im ? im.getAttribute('src') : '', image_alt: im ? im.alt : '', badge: q('.absolute.top-4'), location: sp[0] ? sp[0].textContent.trim() : '', status: sp[1] ? sp[1].textContent.trim() : '',
      description: q('.p-8 > p'), foot_left: ft[0] ? ft[0].textContent.trim() : '', foot_right: ft[1] ? ft[1].textContent.trim() : '', badge_color: 'navy', status_color: 'emerald', foot_color: 'emerald', detail: '', gallery: [] };
  }
  function pfOpen(p) {
    pfClose();
    var bc = PF_BADGE[p.badge_color] || PF_BADGE.navy, sc = PF_TXT[p.status_color] || PF_TXT.emerald;
    var g = (p.gallery || []).filter(Boolean), d = dict(), en = p.en || {};
    if (en.detail && String(en.detail).trim() && p.detail) {      // diterjemahkan per baris (tiap baris menjadi teks sendiri di halaman)
      var a = String(p.detail).split('\n'), z = String(en.detail).split('\n');
      if (a.length === z.length) a.forEach(function (ln, i) { if (ln.trim() && z[i].trim()) d[norm(ln)] = z[i].trim(); });
      else d[norm(p.detail)] = String(en.detail).trim();
    }
    var chips = [p.foot_left, p.foot_right].filter(Boolean).map(function (x) { return '<span class="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">' + escH(x) + '</span>'; }).join(' ');
    var h = '<div id="pf-detail" class="fixed inset-0 z-[70] bg-navy-950/80 backdrop-blur-sm overflow-y-auto" style="padding:1rem">' +
      '<div class="relative bg-white rounded-sm shadow-2xl max-w-4xl mx-auto my-4 sm:my-8 overflow-hidden" role="dialog" aria-modal="true">' +
      '<button type="button" data-pfx="close" class="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 text-navy-900 shadow flex items-center justify-center text-xl leading-none" aria-label="Tutup">&times;</button>' +
      (p.image_url ? '<div class="relative h-56 sm:h-80 bg-slate-200"><img src="' + escH(p.image_url) + '" alt="' + escH(p.image_alt || p.title) + '" class="w-full h-full object-cover">' +
        (p.badge ? '<div class="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase font-mono px-3 py-1 rounded-sm" style="background:' + bc + '">' + escH(p.badge) + '</div>' : '') + '</div>' : '') +
      '<div class="p-6 sm:p-10 space-y-8">' +
      '<div class="space-y-3"><span class="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono">Ikhtisar Proyek</span>' +
      ((p.location || p.status) ? '<div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500"><span>' + escH(p.location || '') + '</span><span class="font-mono font-semibold" style="color:' + sc + '">' + escH(p.status || '') + '</span></div>' : '') +
      '<h2 class="font-luxury-serif text-2xl sm:text-3xl font-bold text-navy-900 leading-snug">' + escH(p.title) + '</h2>' +
      (p.description ? '<p class="text-slate-600 text-sm leading-relaxed">' + escH(p.description) + '</p>' : '') + (chips ? '<div class="flex flex-wrap gap-2 pt-1">' + chips + '</div>' : '') + '</div>' +
      (p.detail ? '<div class="space-y-3 pt-6 border-t border-slate-200"><span class="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono">Penjelasan</span><div class="text-slate-700 text-sm leading-7">' + pfLines(p.detail) + '</div></div>' : '') +
      (g.length ? '<div class="space-y-3 pt-6 border-t border-slate-200"><span class="text-xs uppercase tracking-[0.3em] text-sky-600 font-bold font-mono">Galeri Foto</span><div class="grid grid-cols-2 sm:grid-cols-3 gap-3">' +
        g.map(function (u, i) { return '<button type="button" data-pfx="zoom" data-i="' + i + '" class="block h-36 sm:h-44 overflow-hidden rounded-sm bg-slate-200 group"><img src="' + escH(u) + '" alt="" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></button>'; }).join('') + '</div></div>' : '') +
      '<div class="pt-2 text-center"><button type="button" data-pfx="close" class="btn-rolex-pill-dark px-8 py-3 text-xs uppercase tracking-widest rounded-full">Tutup</button></div>' +
      '</div></div></div>';
    var w = document.createElement('div'); w.id = 'pf-detail-wrap'; w.innerHTML = h; document.body.appendChild(w);
    w._g = g; document.documentElement.style.overflow = 'hidden';
  }
  function pfClose() { var w = document.getElementById('pf-detail-wrap'); if (w) w.remove(); var z = document.getElementById('pf-zoom'); if (z) z.remove(); document.documentElement.style.overflow = ''; }
  function pfZoom(list, i) {
    var z = document.getElementById('pf-zoom'); if (z) z.remove();
    i = (i + list.length) % list.length;
    z = document.createElement('div'); z.id = 'pf-zoom'; z.className = 'fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4'; z._l = list; z._i = i;
    z.innerHTML = '<img src="' + escH(list[i]) + '" alt="" class="max-w-full max-h-full object-contain">' +
      '<button type="button" data-pfz="close" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-xl leading-none" aria-label="Tutup">&times;</button>' +
      (list.length > 1 ? '<button type="button" data-pfz="prev" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label="Sebelumnya">‹</button><button type="button" data-pfz="next" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label="Berikutnya">›</button>' : '');
    document.body.appendChild(z);
  }
  function pfBind() {
    var box = document.getElementById('portfolio-container'); if (!box || box._pfb) return; box._pfb = 1;
    function open(e) {
      var el = e.target.closest('.portfolio-item'); if (!el) return;
      var id = el.getAttribute('data-pf-id'), p = null;
      if (id) pfItems.forEach(function (x) { if (String(x.id) === id) p = x; });
      pfOpen(p || pfFromDom(el));
    }
    box.addEventListener('click', open);
    box.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('portfolio-item')) { e.preventDefault(); open(e); } });
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-pfx],[data-pfz]') : null, w = document.getElementById('pf-detail-wrap');
      if (t && t.getAttribute('data-pfz')) {
        var z = document.getElementById('pf-zoom'), a = t.getAttribute('data-pfz');
        if (a === 'close') z.remove(); else pfZoom(z._l, z._i + (a === 'next' ? 1 : -1));
      } else if (t && t.getAttribute('data-pfx') === 'close') pfClose();
      else if (t && t.getAttribute('data-pfx') === 'zoom' && w) pfZoom(w._g, Number(t.getAttribute('data-i')));
      else if (w && e.target.id === 'pf-detail') pfClose();
      else if (e.target.id === 'pf-zoom') e.target.remove();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return; var z = document.getElementById('pf-zoom'); if (z) z.remove(); else pfClose();
    });
  }

  function loadPortfolio() {
    var c = client(); if (!c) return;
    var cached = null; try { cached = JSON.parse(localStorage.getItem(PF_KEY) || 'null'); } catch (e) {}
    if (cached) pfRender(cached);
    Promise.all([
      c.from('site_content').select('value_id').match({ kind: 'config', key: 'portfolio', scope: '' }).maybeSingle(),
      c.from('portfolio_items').select('*').eq('is_active', true).order('sort_order', { ascending: true }).order('id', { ascending: true })
    ]).then(function (r) {
      if (r[0].error || r[1].error) return;
      var managed = false; try { managed = !!JSON.parse(r[0].data.value_id).managed; } catch (e) {}
      var filters = []; try { filters = JSON.parse(r[0].data.value_id).filters || []; } catch (e) {}
      var st = { managed: managed, filters: filters, items: r[1].data || [] }, str = JSON.stringify(st);
      if (str !== JSON.stringify(cached)) { pfRender(st); try { localStorage.setItem(PF_KEY, str); } catch (e) {} }
    }, function () {});
  }

  /* --------------------------------- Mulai --------------------------------- */
  function boot() {
    capture();
    if (PROBE) post({ cms: 'quoteBase', base: quoteBase });
    var cachedStr = EDIT ? '' : readCache();
    if (cachedStr) { try { apply(JSON.parse(cachedStr)); } catch (e) {} }
    fetchRemote().then(function (rows) {
      if (EDIT) { apply(rows || []); if (window.i18n) window.i18n.setLanguage('id', false); post({ cms: 'ready', page: PAGE }); return; }
      if (!rows) return;
      var s = JSON.stringify(rows);
      if (s !== cachedStr) { apply(rows); writeCache(s); }
    });
    if (EDIT) { startEditMode(); }
    if (PAGE === 'career.html' && !EDIT && !PROBE) loadJobs();
    if (PAGE === 'portfolio.html' && !EDIT && !PROBE) { pfBind(); loadPortfolio(); }
    track();
  }
  window.CandiCMS = { reload: function () { return fetchRemote().then(function (r) { if (r) apply(r); }); } };
  boot();
})();
