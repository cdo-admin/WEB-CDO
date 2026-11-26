// Judul kartu di halaman Produk -> nama produk di sistem pesanan (sama dengan value di QUOTE_GROUPS).
export const NAME_MAP = {
  'Oksigen (O2) Industri': 'Oksigen Industri', 'Oksigen (O2) Medis': 'Oksigen Medis', 'Nitrogen (N2)': 'Nitrogen (N2)', 'Argon (Ar)': 'Argon (Ar)',
  'Karbon Dioksida (CO2)': 'Karbon Dioksida (CO2)', 'Asetilen (C2H2)': 'Asetilen (C2H2)', 'Mixed Gases': 'Mixed Gases',
  'Special Gases': 'Special Gases', 'Amonia (NH3)': 'Amonia (NH3)', 'LPG': 'LPG', 'VGL': 'VGL',
  'Filling Station': 'Filling Station', 'Delivery Service': 'Delivery Service', 'Gas Piping System Sentral': 'Gas Piping System',
  'Purging Pipelines with Nitrogen': 'Purging Pipelines with Nitrogen', 'Spare Parts & Komponen': 'Spare Parts',
  'Maintenance Tabung': 'Maintenance Bejana Tekan',
  'Valve Tabung': 'High Pressure Valve', 'Cryogenic Dewars': 'Cryogenic Dewars', 'Cryogenic Regulator': 'Cryogenic Regulator',
  'Cylinder (Tabung Gas)': 'Gas Cylinder Baru', 'Regulator Gas': 'Regulator Gas', 'Cradle (Rak Tabung)': 'Cradle (Rak Tabung)',
  'Flowmeter Oksigen': 'Flowmeter Oksigen', 'Gas Outlet Panel': 'Gas Outlet Panel', 'Bed Head Panel': 'Bed Head Panel', 'Humidifier Bottle': 'Humidifier Bottle', 'Alarm Gas Medis': 'Alarm Gas Medis',
};
export const CAT_LABEL = { gas: 'Produk Gas', service: 'Layanan Servis', equipment: 'Perlengkapan' };

/** Produk dari judul bebas (tombol di Beranda). */
export function productByTitle(idTitle, img) {
  const cat = /^(Filling|Delivery|Gas Piping|Purging|Spare|Maintenance)/.test(idTitle) ? 'service'
    : /^(Valve|Cryogenic|Cylinder|Regulator|Cradle|Flowmeter|Gas Outlet|Bed Head|Humidifier|Alarm)/.test(idTitle) ? 'equipment' : 'gas';
  return { idTitle, name: NAME_MAP[idTitle] || idTitle, category: cat, categoryLabel: CAT_LABEL[cat], img: img || '' };
}
