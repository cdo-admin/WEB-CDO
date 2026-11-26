/* =============================================================================
   PT. CANDI OXYGEN — PENGATURAN OPSI FORM "AJUKAN PENAWARAN" (halaman /quote)
   =============================================================================
   File ini mengatur DUA hal:
     1. Pilihan "Spesifikasi / Ukuran" yang muncul, tergantung kategori produk
        yang dipilih user (Gas / Layanan / Perlengkapan).
     2. Aturan: kalau user memilih spesifikasi "Kustom", kolom Catatan jadi WAJIB.

   Kamu cukup mengedit bagian "PENGATURAN" di bawah. Bagian "MESIN" tidak perlu disentuh.

   -----------------------------------------------------------------------------
   STRUKTUR (dibaca dari atas ke bawah)
   -----------------------------------------------------------------------------
   SPECS = {
     gas:       [ KELOMPOK, KELOMPOK, ... ],   <- untuk produk gas
     service:   [ ... ],                       <- untuk layanan
     equipment: [ ... ]                        <- untuk perlengkapan (kosong = hanya Kustom)
   }

   KELOMPOK = { label: "Judul kelompok di dropdown", items: [ ISI, ISI, ... ] }

   ISI cukup berupa teks:           "Tabung 6m³"
   (teks itu dipakai sebagai nilai sekaligus tulisan di dropdown). Kalau nilai
   dan tulisannya ingin berbeda:    ["nilai yang dikirim", "tulisan di dropdown"]

   -----------------------------------------------------------------------------
   CARA MENGUBAH (contoh)
   -----------------------------------------------------------------------------
   A) MENAMBAH UKURAN BARU      -> tambahkan satu baris di items yang sesuai:
                                      "Tabung 3m³",
   B) MENGHAPUS UKURAN          -> hapus barisnya.
   C) MENGUBAH URUTAN           -> pindahkan barisnya ke atas / bawah.
   D) MEMBUAT KELOMPOK BARU     -> salin satu blok { label: ..., items: [...] }
                                   lalu tempel di dalam kategori yang sama.
   E) HANYA UNTUK SATU PRODUK   -> isi PER_PRODUCT (contohnya ada di bawah).
                                   Nama produk harus sama persis dengan
                                   value="..." di <option> produk pada quote.html.
   F) MENAMBAH PRODUK BARU      -> tambahkan ke QUOTE_PRODUCTS di bawah dengan
                                   data-category="gas" | "service" | "equipment".
                                   Daftar spesifikasinya otomatis mengikuti kategori itu.

   G) SUB-PILIHAN (VARIAN) PRODUK  -> isi VARIANTS di bawah. Produk yang terdaftar
                                   di sana akan memunculkan dropdown tambahan
                                   (mis. Mixed Gases -> ArO / ArCO) yang WAJIB dipilih.
                                   Kunci = value="..." produk di quote.html.
                                   Format item:  ["nilai di tabel", "tulisan di dropdown"]

   Penting: setiap baris diakhiri koma (,) kecuali baris terakhir dalam satu daftar.
   Opsi "Kustom" ditambahkan otomatis di akhir semua daftar.
   ============================================================================= */

/* ============================== PENGATURAN ================================ */

// Nilai opsi "Kustom" (harus sama dengan <option> Kustom di sistem pesanan).
export const CUSTOM_SPEC = ["Kustom / Sesuai Catatan", "Kustom / Sesuai Catatan Khusus"];

export const SPECS = {

  // ---- Kategori: Produk Gas (tabung, cradle, dewar) ----
  gas: [
    {
      label: "Ukuran Tabung (Silinder)",
      items: [
        "Tabung 1m³",
        "Tabung 2m³",
        "Tabung 6m³",
        "Tabung 7m³",
        "Tabung 10m³"
      ]
    },
    {
      label: "Cradle, Dewar & Silinder Khusus",
      items: [
        "Cradle 2x2",
        "Cradle 2x3",
        "Cradle 3x3",
        "Cradle 3x4",
        "Cradle 4x4",
        "Dewar Liquid 175 Liter",
        "Silinder 50 kg",
        "Silinder 12 kg"
      ]
    }
  ],

  // ---- Kategori: Layanan Profesional ----
  service: [],

  // ---- Kategori: Perlengkapan Gas (hanya Kustom, sengaja kosong) ----
  equipment: []
};

// Daftar khusus untuk SATU produk (opsional). Produk yang tidak ditulis di sini
// memakai daftar kategorinya. Hapus tanda // untuk mengaktifkan contoh ini:
export const PER_PRODUCT = {
  // VGL (tabung kriogenik cair): belum ada ukuran baku, jadi hanya "Kustom" (catatan wajib).
  // Setelah ukuran VGL pasti, ganti [] dengan daftar, contoh:
  //   "VGL": [ { label: "Kapasitas VGL", items: ["VGL 175 Liter", "VGL 230 Liter"] } ]
  "VGL": [],

  // LPG: ukuran tabung 12 kg dan 50 kg (+ Kustom otomatis)
  "LPG": [
    { label: "Ukuran LPG", items: ["Silinder 12 kg", "Silinder 50 kg"] }
  ],

  // Asetilen: silinder 4 kg (+ Kustom otomatis)
  "Asetilen (C2H2)": [
    { label: "Ukuran Silinder", items: ["Silinder 4 kg"] }
  ],

  // Karbon Dioksida: silinder 20 / 25 / 45 kg (+ Kustom otomatis)
  "Karbon Dioksida (CO2)": [
    { label: "Ukuran Silinder", items: ["Silinder 20 kg", "Silinder 25 kg", "Silinder 45 kg"] }
  ],

  // Ukuran khusus untuk SATU VARIAN: tulis "NamaProduk (Varian)" persis seperti yang tercatat di pesanan.
  // Amonia (NH3) punya kartu sendiri: silinder 50 / 55 / 60 kg (+ Kustom otomatis)
  "Amonia (NH3)": [
    { label: "Ukuran Silinder", items: ["Silinder 50 kg", "Silinder 55 kg", "Silinder 60 kg"] }
  ],

  // Mixed Gases: setelah memilih jenis campuran, muncul pilihan komposisi (+ Kustom otomatis).
  // Kunci: "Mixed Gases (KodeVarian)". Jenis tanpa daftar (ArO, Arnitro) memakai ukuran tabung biasa.
  "Mixed Gases (N2O2)": [
    { label: "Komposisi Campuran", items: ["Nitrogen 98% + Oksigen 2%", "Nitrogen 95% + Oksigen 5%", "Synthetic Air / Compressed Air (N2 79% + O2 21%)"] }
  ],
  "Mixed Gases (N2CO2)": [
    { label: "Komposisi Campuran", items: ["Nitrogen 50% + Karbondioksida 50%", "Nitrogen 60% + Karbondioksida 40%"] }
  ],
  "Mixed Gases (ArCO)": [
    { label: "Komposisi Campuran", items: [
      ["ArCO 2,5", "ArCO 2,5 (Argon 97,5% + Karbondioksida 2,5%)"],
      ["ArCO 18",  "ArCO 18 (Argon 82% + Karbondioksida 18%)"],
      ["ArCO 20",  "ArCO 20 (Argon 80% + Karbondioksida 20%)"],
      ["ArCO 25",  "ArCO 25 (Argon 75% + Karbondioksida 25%)"] ] }
  ],
  "Mixed Gases (ArHidro)": [
    { label: "Komposisi Campuran", items: [["ArHidro 05", "ArHidro 05 (Argon 95% + Hidrogen 5%)"]] }
  ],
  "Mixed Gases (ArHeli)": [
    { label: "Komposisi Campuran", items: [
      ["ArHeli 10", "ArHeli 10 (Argon 90% + Helium 10%)"],
      ["ArHeli 30", "ArHeli 30 (Argon 70% + Helium 30%)"] ] }
  ],
  "Mixed Gases (OCO)": [
    { label: "Komposisi Campuran", items: ["Oksigen 70% + Karbondioksida 30%"] }
  ]
};

// Sub-pilihan per PRODUK. Nama produk (kiri) harus sama persis dengan value="..." di quote.html.
// Hasilnya tampil di tabel pesanan, contoh: "Mixed Gases (ArO)".
export const VARIANTS = {
  "VGL": {
    label: "Jenis Gas Cair *",
    placeholder: "Pilih jenis gas cair...",
    items: [
      ["Oksigen",         "Oksigen (O2)"],
      ["Nitrogen",        "Nitrogen (N2)"],
      ["Argon",           "Argon (Ar)"],
      ["Karbon Dioksida", "Karbon Dioksida (CO2)"]
    ]
  },
  "Oksigen Industri": {
    label: "Tingkat Kemurnian *",
    placeholder: "Pilih tingkat kemurnian...",
    items: [
      ["WG",  "WG (Welding Grade)"],
      ["HP",  "HP (High Purity)"],
      ["UHP", "UHP (Ultra High Purity)"]
    ]
  },
  "Nitrogen (N2)": {
    label: "Tingkat Kemurnian *",
    placeholder: "Pilih tingkat kemurnian...",
    items: [
      ["WG",  "WG (Welding Grade)"],
      ["HP",  "HP (High Purity)"],
      ["UHP", "UHP (Ultra High Purity)"],
      ["FG",  "FG (Food Grade)"]
    ]
  },
  "Argon (Ar)": {
    label: "Tingkat Kemurnian *",
    placeholder: "Pilih tingkat kemurnian...",
    items: [
      ["WG",  "WG (Welding Grade)"],
      ["HP",  "HP (High Purity)"],
      ["UHP", "UHP (Ultra High Purity)"]
    ]
  },
  "Asetilen (C2H2)": {
    label: "Tingkat Kemurnian *",
    placeholder: "Pilih tingkat kemurnian...",
    items: [
      ["Standar", "Standar"],
      ["HP",      "HP (High Purity)"]
    ]
  },
  "Mixed Gases": {
    label: "Jenis Campuran *",
    placeholder: "Pilih jenis campuran...",
    items: [
      ["ArO",     "ArO (Argon-Oksigen)"],
      ["ArCO",    "ArCO (Argon-CO2)"],
      ["Arnitro", "Arnitro (Argon-Nitrogen)"],
      ["ArHidro", "ArHidro (Argon-Hidrogen)"],
      ["ArHeli",  "ArHeli (Argon-Helium)"],
      ["N2O2",    "N2O2 (Nitrogen-Oksigen)"],
      ["N2CO2",   "N2CO2 (Nitrogen-Karbon Dioksida)"],
      ["OCO",     "OCO (Oksigen-Karbon Dioksida)"]
    ]
  },
  "Special Gases": {
    label: "Jenis Gas Spesial *",
    placeholder: "Pilih jenis gas...",
    items: [
      ["Helium",   "Helium (He)"],
      ["Hidrogen", "Hidrogen (H2)"],
      ["Nitrous Oxide",     "Nitrous Oxide (N2O)"],
      ["Karbon Monoksida",  "Karbon Monoksida (CO)"]
    ]
  }
};

// Teks-teks yang dilihat user
export const TEXT = {
  notesOptional: "Catatan Tambahan Spesifik Item Ini (Opsional)",
  notesRequired: "Catatan Spesifik Item Ini (WAJIB untuk spesifikasi Kustom) *",
  placeholderOptional: "Contoh: sewa tabung atau tabung milik sendiri...",
  placeholderRequired: "Wajib diisi: jelaskan ukuran / spesifikasi kustom yang Anda butuhkan...",
  error: "Catatan wajib diisi untuk spesifikasi Kustom. Jelaskan ukuran atau kebutuhan Anda.",
  variantError: "Pilih jenis terlebih dahulu sebelum menambahkan item."
};


// Daftar produk di dropdown "Produk / Layanan" (dulu <option> di quote.html).
// value = nama yang tercatat di pesanan, label = tulisan di dropdown, category = gas | service | equipment.
export const QUOTE_GROUPS = [
  { label: 'Industrial & Medical Gases', category: 'gas', catLabel: 'Produk Gas', items: [
    ['Oksigen Medis', 'Oksigen Medis'], ['Oksigen Industri', 'Oksigen Industri'], ['Nitrogen (N2)', 'Nitrogen'], ['Argon (Ar)', 'Argon'],
    ['Asetilen (C2H2)', 'Asetilen'], ['Karbon Dioksida (CO2)', 'Karbon Dioksida'], ['Mixed Gases', 'Mixed Gases'], ['Special Gases', 'Special Gases'],
    ['Amonia (NH3)', 'Amonia (NH3)'], ['LPG', 'LPG'], ['VGL', 'VGL (Vessel Gas Liquid)'] ] },
  { label: 'Layanan Profesional (Services)', category: 'service', catLabel: 'Layanan Servis', items: [
    ['Filling Station', 'Filling Station'], ['Delivery Service', 'Delivery Service'], ['Gas Piping System', 'Gas Piping System'],
    ['Purging Pipelines with Nitrogen', 'Purging Pipelines with Nitrogen'], ['Spare Parts', 'Spare Parts Penggantian Suku Cadang'],
    ['Maintenance Bejana Tekan', 'Maintenance Tabung'] ] },
  { label: 'Perlengkapan Gas (Gas Equipment)', category: 'equipment', catLabel: 'Perlengkapan', items: [
    ['High Pressure Valve', 'High Pressure Valve'], ['Cryogenic Dewars', 'Cryogenic Dewars Tank'], ['Cryogenic Regulator', 'Cryogenic Regulator'],
    ['Gas Cylinder Baru', 'Gas Cylinder Baru'], ['Regulator Gas', 'Regulator Gas'], ['Cradle (Rak Tabung)', 'Cradle (Rak Tabung)'],
    ['Flowmeter Oksigen', 'Flowmeter Oksigen'], ['Gas Outlet Panel', 'Gas Outlet Panel'], ['Bed Head Panel', 'Bed Head Panel'],
    ['Humidifier Bottle', 'Humidifier Bottle'], ['Alarm Gas Medis', 'Alarm Gas Medis'] ] },
];

/** Daftar datar semua produk bawaan: { value, label, category, catLabel } */
export const QUOTE_BASE_OPTIONS = QUOTE_GROUPS.flatMap((g) =>
  g.items.map(([value, label]) => ({ value, label, category: g.category, catLabel: g.catLabel, group: g.label })));
