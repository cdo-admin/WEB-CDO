/**
 * ==============================================================================
 * PT. CANDI OXYGEN — INTERNATIONAL PHONE INPUT & REGION VALIDATOR
 * ==============================================================================
 * Komponen resmi pemilih kode negara (region) dan validasi nomor telepon:
 * - Pilihan negara: Indonesia (+62), Singapura (+65), Malaysia (+60), AS (+1), dll.
 * - Otomatis memblokir karakter huruf/simbol non-digit.
 * - Otomatis membersihkan awalan 0 bila memilih +62 (0812 -> 812).
 * - Format tampilan rapi per 3-4 digit.
 * - Validasi panjang dan format nomor saat formulir dikirim.
 * - Menghasilkan format internasional E.164 (+628113739800) untuk Supabase & WhatsApp.
 * ==============================================================================
 */

(function (window) {
  'use strict';

  var COUNTRIES = [
    { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia', min: 9, max: 13, placeholder: '811-3739-800' },
    { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapura', min: 8, max: 8, placeholder: '8123-4567' },
    { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia', min: 8, max: 11, placeholder: '12-345-6789' },
    { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia', min: 9, max: 10, placeholder: '412-345-678' },
    { code: 'US', dial: '+1', flag: '🇺🇸', name: 'Amerika Serikat', min: 10, max: 10, placeholder: '202-555-0123' },
    { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Jepang', min: 10, max: 11, placeholder: '90-1234-5678' },
    { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China', min: 11, max: 11, placeholder: '138-0013-8000' },
    { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'Korea Selatan', min: 9, max: 11, placeholder: '10-1234-5678' },
    { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Inggris Raya', min: 10, max: 10, placeholder: '7911-123456' },
    { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Jerman', min: 10, max: 12, placeholder: '151-23456789' },
    { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Belanda', min: 9, max: 9, placeholder: '6-12345678' },
    { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Arab Saudi', min: 9, max: 9, placeholder: '50-123-4567' },
    { code: 'OTHER', dial: '+', flag: '🌐', name: 'Negara Lainnya', min: 7, max: 15, placeholder: 'Nomor telepon internasional' }
  ];

  function formatDigits(val) {
    if (!val) return '';
    var parts = [];
    if (val.length <= 4) return val;
    if (val.length <= 8) return val.slice(0, 4) + ' ' + val.slice(4);
    if (val.length <= 11) return val.slice(0, 4) + ' ' + val.slice(4, 8) + ' ' + val.slice(8);
    return val.slice(0, 4) + ' ' + val.slice(4, 8) + ' ' + val.slice(8, 12) + ' ' + val.slice(12);
  }

  function CandiPhoneInput(inputEl, options) {
    if (!inputEl || inputEl._candiPhone) return inputEl ? inputEl._candiPhone : null;
    this.input = inputEl;
    this.options = options || {};
    this.currentCountry = COUNTRIES[0]; // default Indonesia
    this.init();
    inputEl._candiPhone = this;
  }

  CandiPhoneInput.prototype.init = function () {
    var self = this;
    var inp = this.input;

    // Buat wrapper container
    var wrapper = document.createElement('div');
    wrapper.className = 'candi-phone-wrapper w-full';
    inp.parentNode.insertBefore(wrapper, inp);

    var group = document.createElement('div');
    group.className = 'candi-phone-group flex items-stretch rounded-sm border border-slate-300 bg-white focus-within:border-sky-600 focus-within:ring-1 focus-within:ring-sky-600 transition-all shadow-sm';

    // Dropdown negara
    var picker = document.createElement('div');
    picker.className = 'candi-country-picker relative shrink-0';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'candi-country-btn flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border-r border-slate-200 text-xs font-semibold text-slate-700 h-full rounded-l-sm transition-colors cursor-pointer select-none';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.title = 'Pilih Kode Negara / Region';
    btn.innerHTML = '<span class="candi-flag text-sm">' + self.currentCountry.flag + '</span>' +
      '<span class="candi-dial font-mono">' + self.currentCountry.dial + '</span>' +
      '<i class="fa-solid fa-chevron-down text-[9px] text-slate-400 ml-0.5"></i>';

    var menu = document.createElement('div');
    menu.className = 'candi-country-menu hidden absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-sm shadow-xl z-50 text-xs py-1';
    menu.setAttribute('role', 'listbox');

    COUNTRIES.forEach(function (c) {
      var opt = document.createElement('div');
      opt.className = 'candi-country-item flex items-center justify-between px-3 py-2 hover:bg-sky-50 cursor-pointer transition-colors ' + (c.code === self.currentCountry.code ? 'bg-sky-50 font-bold text-sky-900' : 'text-slate-700');
      opt.setAttribute('role', 'option');
      opt.innerHTML = '<span class="flex items-center gap-2"><span class="text-sm">' + c.flag + '</span><span>' + c.name + '</span></span><span class="font-mono text-slate-500">' + c.dial + '</span>';
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        self.setCountry(c);
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        inp.focus();
      });
      menu.appendChild(opt);
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.contains('hidden');
      document.querySelectorAll('.candi-country-menu').forEach(function (m) { m.classList.add('hidden'); });
      if (open) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function () {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });

    picker.appendChild(btn);
    picker.appendChild(menu);

    // Style input asli agar menyatu
    inp.classList.remove('form-input-luxury');
    inp.className = 'candi-phone-input flex-1 px-3 py-2.5 text-xs text-navy-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none font-mono';
    inp.setAttribute('autocomplete', 'tel');
    inp.setAttribute('inputmode', 'numeric');
    inp.placeholder = self.currentCountry.placeholder;

    // Error helper
    var errEl = document.createElement('div');
    errEl.className = 'candi-phone-error hidden text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1.5';
    errEl.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-500"></i><span class="candi-err-text">Nomor telepon tidak valid.</span>';

    // Rangkai elemen
    group.appendChild(picker);
    group.appendChild(inp);
    wrapper.appendChild(group);
    wrapper.appendChild(errEl);

    self.btn = btn;
    self.menu = menu;
    self.group = group;
    self.errEl = errEl;

    // Event listener: Blokir huruf & karakter selain angka
    inp.addEventListener('input', function () {
      var raw = inp.value.replace(/\D/g, '');
      // jika indonesia (+62) dan ketik 0 di depan (contoh: 0812...), hapus 0 di depan
      if (self.currentCountry.dial === '+62' && raw.indexOf('0') === 0) {
        raw = raw.replace(/^0+/, '');
      }
      inp.value = formatDigits(raw);
      self.hideError();
    });

    inp.addEventListener('blur', function () {
      if (inp.value.trim()) {
        self.validate();
      } else {
        self.hideError();
      }
    });
  };

  CandiPhoneInput.prototype.setCountry = function (country) {
    this.currentCountry = country;
    this.btn.querySelector('.candi-flag').textContent = country.flag;
    this.btn.querySelector('.candi-dial').textContent = country.dial;
    this.input.placeholder = country.placeholder;
    // update active state di menu
    var items = this.menu.querySelectorAll('.candi-country-item');
    COUNTRIES.forEach(function (c, i) {
      if (items[i]) {
        var on = c.code === country.code;
        items[i].className = 'candi-country-item flex items-center justify-between px-3 py-2 hover:bg-sky-50 cursor-pointer transition-colors ' + (on ? 'bg-sky-50 font-bold text-sky-900' : 'text-slate-700');
      }
    });
    // trigger input format ulang
    this.input.dispatchEvent(new Event('input'));
  };

  CandiPhoneInput.prototype.getRawDigits = function () {
    return this.input.value.replace(/\D/g, '');
  };

  CandiPhoneInput.prototype.getInternationalNumber = function () {
    var raw = this.getRawDigits();
    if (!raw) return '';
    var dial = this.currentCountry.dial;
    if (dial === '+') return '+' + raw;
    return dial + raw;
  };

  CandiPhoneInput.prototype.validate = function () {
    var raw = this.getRawDigits();
    var c = this.currentCountry;

    // Kosong dan tidak required
    if (!raw && !this.input.required) {
      this.hideError();
      return true;
    }

    // Kosong tapi required
    if (!raw && this.input.required) {
      this.showError('Nomor telepon wajib diisi.');
      return false;
    }

    // Terlalu pendek
    if (raw.length < c.min) {
      this.showError('Nomor telepon terlalu pendek (minimal ' + c.min + ' digit untuk ' + c.name + ').');
      return false;
    }

    // Terlalu panjang
    if (raw.length > c.max) {
      this.showError('Nomor telepon terlalu panjang (maksimal ' + c.max + ' digit untuk ' + c.name + ').');
      return false;
    }

    // Angka kembar tidak wajar (contoh: 00000000, 11111111)
    if (/^(\d)\1{6,}$/.test(raw)) {
      this.showError('Nomor telepon tidak valid. Masukkan nomor yang benar.');
      return false;
    }

    this.hideError();
    return true;
  };

  CandiPhoneInput.prototype.showError = function (msg) {
    this.group.classList.add('border-red-500', 'ring-1', 'ring-red-500');
    this.group.classList.remove('border-slate-300');
    this.errEl.querySelector('.candi-err-text').textContent = msg || 'Nomor telepon tidak valid.';
    this.errEl.classList.remove('hidden');
  };

  CandiPhoneInput.prototype.hideError = function () {
    this.group.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    this.group.classList.add('border-slate-300');
    this.errEl.classList.add('hidden');
  };

  // Helper pasang otomatis ke semua input telepon di halaman
  function initAllPhoneInputs() {
    var selector = '#quotePhone, #shippingPhone, #phone, #careerPhone';
    var els = document.querySelectorAll(selector);
    els.forEach(function (el) {
      new CandiPhoneInput(el);
    });
  }

  // Ekspor global
  window.CandiPhoneInput = CandiPhoneInput;
  window.initAllPhoneInputs = initAllPhoneInputs;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllPhoneInputs);
  } else {
    initAllPhoneInputs();
  }
})(window);
