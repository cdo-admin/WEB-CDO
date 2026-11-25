/* Galeri Kegiatan — memuat foto kegiatan dari tabel gallery_items (Supabase) dan menampilkannya
   sebagai kisi foto. Klik foto → jendela dengan gambar besar + deskripsi. Jika kosong: pesan ramah. */
(function () {
  'use strict';
  var grid = document.getElementById('gl-grid'), state = document.getElementById('gl-state');
  if (!grid || !state) return;
  var items = [], ready = false, cur = null, curPhoto = 0;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lang() { try { return window.getLanguage ? window.getLanguage() : 'id'; } catch (e) { return 'id'; } }
  function tr(s) { return lang() === 'en' && window.t ? window.t(s) : s; }
  function pick(it, k) { var en = it.en || {}; return lang() === 'en' && en[k] && String(en[k]).trim() ? String(en[k]).trim() : (it[k] || ''); }
  function fmtDate(d) {
    if (!d) return '';
    var dt = new Date(String(d).slice(0, 10) + 'T00:00:00'); if (isNaN(dt)) return '';
    try { return dt.toLocaleDateString(lang() === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return String(d); }
  }
  function photosOf(it) { var a = [it.image_url].concat(Array.isArray(it.photos) ? it.photos : []).filter(Boolean); return a.filter(function (u, i) { return a.indexOf(u) === i; }); }

  function empty() {
    grid.innerHTML = '';
    state.className = 'text-center py-16';
    state.innerHTML = '<div class="max-w-md mx-auto">' +
      '<div class="w-20 h-20 mx-auto rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-3xl"><i class="fa-regular fa-images"></i></div>' +
      '<h2 class="mt-6 text-xl font-bold text-navy-900">' + esc(tr('Oops, sepertinya belum ada kegiatan yang dipost di sini')) + '</h2>' +
      '<p class="mt-2 text-sm text-slate-500 leading-relaxed">' + esc(tr('Foto-foto keseruan kegiatan kantor kami akan tampil di halaman ini. Silakan kembali lagi nanti ya!')) + '</p>' +
      '<a href="index.html" class="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-navy-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-sky-600 transition-colors">' + esc(tr('Kembali ke Beranda')) + '</a></div>';
  }

  function render() {
    if (!ready) return;
    if (!items.length) { empty(); return; }
    state.className = 'hidden'; state.innerHTML = '';
    grid.innerHTML = items.map(function (it, i) {
      var ph = photosOf(it), d = fmtDate(it.event_date), desc = pick(it, 'description');
      return '<button type="button" data-gi="' + i + '" class="group text-left bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">' +
        '<div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">' +
        (ph[0] ? '<img src="' + esc(ph[0]) + '" alt="' + esc(pick(it, 'title')) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">' : '<div class="w-full h-full flex items-center justify-center text-slate-300 text-4xl"><i class="fa-regular fa-image"></i></div>') +
        (ph.length > 1 ? '<span class="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2 py-1 rounded-full"><i class="fa-regular fa-images mr-1"></i>' + ph.length + '</span>' : '') +
        '</div><div class="p-5">' +
        (d ? '<div class="text-[11px] font-mono uppercase tracking-widest text-sky-600 mb-1">' + esc(d) + '</div>' : '') +
        '<h3 class="font-bold text-navy-900 leading-snug">' + esc(pick(it, 'title')) + '</h3>' +
        (desc ? '<p class="text-sm text-slate-500 mt-2 leading-relaxed" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + esc(desc) + '</p>' : '') +
        '</div></button>';
    }).join('');
    if (document.getElementById('gl-modal')) openModal(cur, curPhoto);
  }

  function close() { var m = document.getElementById('gl-modal'); if (m) m.remove(); document.documentElement.style.overflow = ''; cur = null; }
  function openModal(i, p) {
    var it = items[i]; if (!it) return;
    cur = i; curPhoto = p || 0;
    var ph = photosOf(it); if (curPhoto >= ph.length) curPhoto = 0;
    var old = document.getElementById('gl-modal'); if (old) old.remove();
    var d = fmtDate(it.event_date), desc = pick(it, 'description');
    var m = document.createElement('div'); m.id = 'gl-modal';
    m.className = 'fixed inset-0 z-[80] bg-navy-950/90 backdrop-blur-sm overflow-y-auto'; m.style.padding = '1rem';
    m.innerHTML = '<div class="relative bg-white rounded-sm shadow-2xl max-w-4xl mx-auto my-4 sm:my-8 overflow-hidden" role="dialog" aria-modal="true">' +
      '<button type="button" data-gx="close" class="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 text-navy-900 shadow flex items-center justify-center text-xl leading-none" aria-label="' + esc(tr('Tutup')) + '">&times;</button>' +
      (ph.length ? '<div class="relative bg-black flex items-center justify-center" style="min-height:14rem"><img src="' + esc(ph[curPhoto]) + '" alt="' + esc(pick(it, 'title')) + '" class="max-w-full object-contain" style="max-height:70vh">' +
        (ph.length > 1 ? '<button type="button" data-gx="prev" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label="' + esc(tr('Sebelumnya')) + '">‹</button>' +
          '<button type="button" data-gx="next" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-xl" aria-label="' + esc(tr('Berikutnya')) + '">›</button>' : '') + '</div>' : '') +
      (ph.length > 1 ? '<div class="flex gap-2 overflow-x-auto p-3 bg-slate-100">' + ph.map(function (u, k) {
        return '<button type="button" data-gx="th" data-k="' + k + '" class="shrink-0 w-16 h-12 rounded overflow-hidden border-2 ' + (k === curPhoto ? 'border-sky-500' : 'border-transparent opacity-70') + '"><img src="' + esc(u) + '" alt="" class="w-full h-full object-cover"></button>'; }).join('') + '</div>' : '') +
      '<div class="p-6 sm:p-8 space-y-3">' +
      (d ? '<div class="text-xs font-mono uppercase tracking-widest text-sky-600">' + esc(d) + '</div>' : '') +
      '<h2 class="font-luxury-serif text-2xl sm:text-3xl font-bold text-navy-900 leading-snug">' + esc(pick(it, 'title')) + '</h2>' +
      (desc ? '<div class="text-slate-600 text-sm leading-7">' + desc.split(/\n+/).filter(function (x) { return x.trim(); }).map(function (x) { return '<p class="mb-3">' + esc(x) + '</p>'; }).join('') + '</div>' : '') +
      '</div></div>';
    document.body.appendChild(m); document.documentElement.style.overflow = 'hidden';
  }
  function step(n) { var it = items[cur]; if (!it) return; var L = photosOf(it).length; if (L < 2) return; openModal(cur, (curPhoto + n + L) % L); }

  grid.addEventListener('click', function (e) { var b = e.target.closest('[data-gi]'); if (b) openModal(Number(b.dataset.gi), 0); });
  document.addEventListener('click', function (e) {
    var m = document.getElementById('gl-modal'); if (!m) return;
    if (e.target === m) return close();
    var b = e.target.closest('[data-gx]'); if (!b || !m.contains(b)) return; var a = b.dataset.gx;
    if (a === 'close') close(); else if (a === 'prev') step(-1); else if (a === 'next') step(1); else if (a === 'th') openModal(cur, Number(b.dataset.k));
  });
  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('gl-modal')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
  });
  document.addEventListener('languagechange', function () { render(); });

  function load() {
    var c = null; try { c = typeof supabaseClient !== 'undefined' ? supabaseClient : null; } catch (e) {}
    if (!c) { ready = true; render(); return; }
    c.from('gallery_items').select('*').eq('is_active', true).order('sort_order', { ascending: true }).order('id', { ascending: false })
      .then(function (r) { items = (r && !r.error && r.data) || []; ready = true; render(); },
            function () { ready = true; render(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})();
