/* ==========================================================================
   product-specs.js — Isi pop-up "Spesifikasi" pada halaman Produk & Layanan
   --------------------------------------------------------------------------
   Cara mengubah (tidak perlu mengerti JavaScript):
     - Kunci (kiri) = judul kartu produk di products.html, persis sama.
     - rows : tabel spesifikasi. Setiap baris = [ "Label", "isi (Indonesia)", "isi (Inggris)" ]
     - uses : daftar penggunaan / aplikasi, { id: [...], en: [...] }
     - note : catatan kecil di bawah tabel (opsional), { id: "...", en: "..." }
   Semua isi pop-up ditulis di sini. Daftar ukuran tabung sengaja tidak ditampilkan.
   Produk baru: tambah satu blok seperti contoh di bawah.
   ========================================================================== */
var SPEC_LABELS = {
  formula:   ['Rumus Kimia', 'Chemical Formula'],
  purity:    ['Tingkat Kemurnian', 'Purity Grade'],
  pressure:  ['Tekanan', 'Pressure'],
  container: ['Pilihan Wadah', 'Container Options'],
  standard:  ['Standar / Acuan', 'Standard / Reference'],
  nature:    ['Sifat', 'Nature'],
  boiling:   ['Titik Didih', 'Boiling Point'],
  gas:       ['Jenis Gas', 'Gas Type'],
  scope:     ['Lingkup', 'Scope'],
  area:      ['Area Layanan', 'Service Area'],
  material:  ['Material', 'Material'],
  capacity:  ['Kapasitas', 'Capacity'],
  feature:   ['Fitur', 'Features'],
  items:     ['Isi Paket', 'Includes'],
  location:  ['Lokasi', 'Location'],
  media:     ['Media', 'Medium'],
  fire:      ['Suhu Nyala', 'Flame Temperature']
};

var PRODUCT_SPECS = {
  "Oksigen (O2) Industri": {
    rows: [['formula', 'O2', 'O2'], ['purity', 'WG / HP / UHP', 'WG / HP / UHP'], ['pressure', 'Pengisian hingga 150 Bar', 'Filling up to 150 Bar']],
    uses: { id: ['Pengelasan dan pemotongan logam', 'Laser cutting presisi tinggi', 'Proses pembakaran dan produksi industri'], en: ['Metal welding and cutting', 'High-precision laser cutting', 'Industrial combustion and production processes'] }
  },
  "Oksigen (O2) Medis": {
    rows: [['formula', 'O2', 'O2'], ['pressure', 'Pengisian hingga 150 Bar', 'Filling up to 150 Bar']],
    uses: { id: ['Terapi pernapasan di rumah sakit dan klinik', 'Kebutuhan homecare'], en: ['Respiratory therapy in hospitals and clinics', 'Homecare needs'] }
  },
  "Nitrogen (N2)": {
    rows: [['formula', 'N2', 'N2'], ['nature', 'Gas inert', 'Inert gas'], ['purity', 'WG / HP / UHP / FG (Food Grade)', 'WG / HP / UHP / FG (Food Grade)'], ['boiling', '−196 °C (bentuk cair)', '−196 °C (liquid form)']],
    uses: { id: ['Purging pipa', 'Pembekuan kriogenik makanan & minuman', 'Perlakuan panas logam', 'Pengisian ban pesawat/otomotif'], en: ['Pipeline purging', 'Cryogenic freezing of food & beverages', 'Metal heat treatment', 'Aircraft/automotive tire inflation'] }
  },
  "Argon (Ar)": {
    rows: [['formula', 'Ar', 'Ar'], ['nature', 'Gas inert (mulia)', 'Inert (noble) gas'], ['purity', 'WG / HP / UHP', 'WG / HP / UHP'], ['boiling', '−186 °C (bentuk cair)', '−186 °C (liquid form)']],
    uses: { id: ['Pengelasan TIG/MIG stainless steel & aluminium', 'Perakitan presisi pesawat terbang', 'Spektrometri laboratorium'], en: ['TIG/MIG welding of stainless steel & aluminium', 'Precision aircraft assembly', 'Laboratory spectrometry'] }
  },
  "Karbon Dioksida (CO2)": {
    rows: [['formula', 'CO2', 'CO2'], ['nature', 'Gas tidak mudah terbakar', 'Non-flammable gas']],
    uses: { id: ['Pengelasan MIG/MAG baja konstruksi', 'Karbonasi minuman ringan', 'Pemadam kebakaran', 'Pendinginan cepat'], en: ['MIG/MAG welding of structural steel', 'Soft drink carbonation', 'Fire extinguishing', 'Rapid cooling'] }
  },
  "Asetilen (C2H2)": {
    rows: [['formula', 'C2H2', 'C2H2'], ['purity', 'Standar / HP (High Purity)', 'Standard / HP (High Purity)'], ['fire', 'Hingga 3.100 °C', 'Up to 3,100 °C']],
    uses: { id: ['Pemotongan logam baja tebal', 'Brazing', 'Flame hardening'], en: ['Cutting thick steel', 'Brazing', 'Flame hardening'] },
    note: { id: 'Gas mudah terbakar. Simpan dan gunakan dalam posisi tegak.', en: 'Flammable gas. Store and use upright.' }
  },
  "Mixed Gases": {
    rows: [['gas', 'ArO, ArCO, Arnitro, ArHidro, ArHeli, N2O2, N2CO2, OCO', 'ArO, ArCO, Arnitro, ArHidro, ArHeli, N2O2, N2CO2, OCO']],
    note: { id: 'Komposisi dipilih saat memesan. Komposisi lain tersedia melalui opsi Kustom.', en: 'Composition is selected when ordering. Other compositions are available via the Custom option.' }
  },
  "Special Gases": {
    rows: [['gas', 'Helium (He), Hidrogen (H2), Nitrous Oxide (N2O), Karbon Monoksida (CO)', 'Helium (He), Hydrogen (H2), Nitrous Oxide (N2O), Carbon Monoxide (CO)']],
    note: { id: 'Spesifikasi lain tersedia sesuai permintaan melalui opsi Kustom.', en: 'Other specifications are available on request via the Custom option.' }
  },
  "Amonia (NH3)": {
    rows: [['formula', 'NH3', 'NH3']]
  },
  "LPG": {
    rows: [['gas', 'Propana–Butana', 'Propane–Butane']],
    uses: { id: ['Dapur komersial hotel/restoran', 'Pemanas oven industri', 'Boiler'], en: ['Commercial hotel/restaurant kitchens', 'Industrial oven heating', 'Boilers'] }
  },
  "VGL": {
    rows: [['gas', 'O2, N2, Ar, CO2 (cair)', 'O2, N2, Ar, CO2 (liquid)'], ['material', 'Tabung kriogenik, isolasi vakum tinggi', 'Cryogenic vessel, high-vacuum insulation'], ['capacity', 'Setara hingga 22 tabung gas konvensional', 'Equivalent to up to 22 conventional cylinders']],
    note: { id: 'Ukuran kapasitas VGL diajukan melalui opsi Kustom.', en: 'VGL capacity sizes are requested via the Custom option.' }
  },
  "Valve Tabung": {
    rows: [['pressure', 'Hingga 300 Bar', 'Up to 300 Bar'], ['feature', 'Pengaman bursting disc', 'Bursting disc safety']]
  },
  "Cryogenic Dewars": {
    rows: [['capacity', '175 L – 500 L', '175 L – 500 L'], ['gas', 'Nitrogen, Oksigen, atau Argon cair', 'Liquid nitrogen, oxygen, or argon'], ['material', 'Bejana vakum suhu ekstrem', 'Extreme-temperature vacuum vessel']]
  },
  "Cryogenic Regulator": {
    rows: [['scope', 'Regulator reduksi aliran gas cair', 'Liquid gas flow reducing regulator'], ['feature', 'Pemanas elektrik internal (mencegah pembekuan uap)', 'Internal electric heater (prevents vapor freezing)']],
    uses: { id: ['Sistem pipa gasifikasi'], en: ['Gasification piping systems'] }
  },
  "Cylinder (Tabung Gas)": {
    rows: [['capacity', 'Ukuran tersedia: 1 m³, 2 m³, 6 m³, 7 m³, 10 m³', 'Available sizes: 1 m³, 2 m³, 6 m³, 7 m³, 10 m³'], ['material', 'Baja tanpa sambungan (seamless)', 'Seamless steel']]
  },
  "Regulator Gas": {
    rows: [['material', 'Kuningan tempa padat', 'Solid forged brass']]
  },
  "Cradle (Rak Tabung)": {
    rows: [['capacity', 'Ukuran tersedia: 2x2, 2x3, 3x3, 3x4, 4x4', 'Available sizes: 2x2, 2x3, 3x3, 3x4, 4x4'], ['feature', 'Manifold sentral, lubang forklift', 'Central manifold, forklift pockets']],
    uses: { id: ['Pasokan berkelanjutan volume tinggi'], en: ['Continuous high-volume supply'] }
  },
  "Flowmeter Oksigen": {
    rows: [['scope', 'Pengukur dan pengatur aliran oksigen medis', 'Medical oxygen flow meter and regulator'], ['feature', 'Pembacaan aliran dalam liter per menit', 'Flow reading in liters per minute']],
    uses: { id: ['Terapi pernapasan pasien', 'Terpasang pada outlet gas atau regulator tabung'], en: ['Patient respiratory therapy', 'Mounted on a gas outlet or cylinder regulator'] }
  },
  "Gas Outlet Panel": {
    rows: [['scope', 'Outlet gas medis dari sistem pipa sentral', 'Medical gas outlet from the central piping system'], ['feature', 'Pemasangan di dinding atau bed head unit', 'Wall or bed head unit mounting']],
    uses: { id: ['Ruang perawatan rumah sakit dan klinik'], en: ['Hospital and clinic treatment rooms'] }
  },
  "Bed Head Panel": {
    rows: [['scope', 'Panel outlet gas medis di kepala tempat tidur pasien', 'Medical gas outlet panel at the patient bed head'], ['gas', 'Oksigen, vakum, dan udara medis', 'Oxygen, vacuum, and medical air']],
    uses: { id: ['Ruang perawatan rumah sakit dan klinik'], en: ['Hospital and clinic treatment rooms'] }
  },
  "Humidifier Bottle": {
    rows: [['scope', 'Botol pelembap aliran oksigen medis', 'Medical oxygen humidifier bottle'], ['feature', 'Melembapkan gas sebelum dihirup pasien', 'Humidifies gas before it is inhaled by the patient']],
    uses: { id: ['Terapi oksigen bersama flowmeter'], en: ['Oxygen therapy together with a flowmeter'] }
  },
  "Alarm Gas Medis": {
    rows: [['scope', 'Alarm tekanan sistem pipa gas medis', 'Medical gas piping system pressure alarm'], ['feature', 'Peringatan suara dan visual saat tekanan terlalu rendah atau tinggi', 'Audible and visual warning when pressure is too low or too high']],
    uses: { id: ['Pemantauan pasokan gas medis ke pasien'], en: ['Monitoring medical gas supply to patients'] }
  }
};
