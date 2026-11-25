/**
 * ==============================================================================
 * PT. CANDI OXYGEN - SUPABASE CONFIGURATION & DATA SERVICE
 * ==============================================================================
 * Integrasi backend resmi untuk formulir Kontak, Permintaan Penawaran (RFQ),
 * dan Pendaftaran Karir PT. Candi Oxygen (Supplier Gas sejak 1980).
 * 
 * PANDUAN PENGATURAN SUPABASE:
 * 1. Buka dashboard Supabase (https://app.supabase.com)
 * 2. Salin Project URL dan Project Anon Key dari menu Settings > API
 * 3. Gantikan nilai konstanta SUPABASE_URL dan SUPABASE_ANON_KEY di bawah ini:
 */

// ==========================================
// [!] GANTI DENGAN KREDENSIAL SUPABASE ANDA:
// ==========================================
const SUPABASE_URL = 'https://lqktorkepruhvgxbhdbb.supabase.co'; // Masukkan Supabase URL Anda di sini
const SUPABASE_ANON_KEY = 'sb_publishable_lq4MmZFltkWDSzWzTROmZg_aJxG1IPd' ;     // Masukkan Supabase Anon Key Anda di sini

// ==========================================
// Inisialisasi Supabase Client
// ==========================================
let supabaseClient = null;

const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
    !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY_HERE')
  );
};

// Inisialisasi client jika Supabase SDK CDN tersedia
if (typeof supabase !== 'undefined') {
  if (isSupabaseConfigured()) {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ [PT. Candi Oxygen] Supabase Client berhasil terhubung.');
    } catch (err) {
      console.error('❌ [PT. Candi Oxygen] Gagal menginisialisasi Supabase:', err);
    }
  } else {
    console.info(
      'ℹ️ [PT. Candi Oxygen] Supabase belum dikonfigurasi live. Menggunakan Luxury Fallback Mode (simulasi penyimpanan lokal untuk preview).'
    );
  }
}

/**
 * 1. Helper untuk Formulir Kontak Resmi (contact.html)
 * Tabel target Supabase: 'contact_messages'
 */
async function submitContactMessage(formData) {
  if (isSupabaseConfigured() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('contact_messages')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            subject: formData.subject || 'Inquiry Kontak',
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase Error (Contact):', error);
      throw error;
    }
  } else {
    const existing = JSON.parse(localStorage.getItem('candi_oxygen_contacts') || '[]');
    existing.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('candi_oxygen_contacts', JSON.stringify(existing));
    await new Promise((resolve) => setTimeout(resolve, 750));
    return { success: true, isMock: true };
  }
}

/**
 * 2. Helper untuk Formulir Ajukan Penawaran / RFQ Resmi (quote.html)
 * Tabel target Supabase: 'quote_requests'
 */
async function submitQuoteRequest(formData) {
  if (isSupabaseConfigured() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('quote_requests')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || null,
            client_type: formData.clientType || 'Industri Bisnis',
            category: formData.category || 'Industrial & Medical Gases',
            selected_items: formData.selectedItems || [],
            estimated_volume: formData.estimatedVolume || 'Standard',
            delivery_location: formData.deliveryLocation || '',
            notes: formData.notes || '',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase Error (Quote RFQ):', error);
      throw error;
    }
  } else {
    const existing = JSON.parse(localStorage.getItem('candi_oxygen_quotes') || '[]');
    existing.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('candi_oxygen_quotes', JSON.stringify(existing));
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, isMock: true };
  }
}

/**
 * 3. Helper untuk Pendaftaran Karir (career.html)
 * Tabel target Supabase: 'career_applications'
 */
async function submitCareerApplication(formData) {
  if (isSupabaseConfigured() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('career_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            linkedin_url: formData.linkedin || null,
            portfolio_url: formData.portfolio || null,
            cover_letter: formData.coverLetter || '',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Supabase Error (Career):', error);
      throw error;
    }
  } else {
    const existing = JSON.parse(localStorage.getItem('candi_oxygen_careers') || '[]');
    existing.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('candi_oxygen_careers', JSON.stringify(existing));
    await new Promise((resolve) => setTimeout(resolve, 850));
    return { success: true, isMock: true };
  }
}
