export default function Help() {
  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Bantuan</h2>
      <div className="card p-5 max-w-3xl text-sm space-y-3 leading-relaxed">
        <p><b>Mengubah teks:</b> Menu <i>Edit Website</i> → pilih halaman → klik teks → ubah kolom Indonesia dan English → Simpan.</p>
        <p><b>Mengganti foto:</b> klik gambar → Unggah gambar. Gunakan foto JPG/PNG/WebP di bawah 2 MB agar website tetap cepat.</p>
        <p><b>Ganti nomor WhatsApp / link sosial media:</b> klik ikon atau tombolnya → ubah kolom Link. Format WhatsApp: <code>https://wa.me/628123456789</code>. Teks nomor yang tampil diubah dengan mengklik tulisannya.</p>
        <p><b>Menambah produk / proyek:</b> klik kartu yang mirip → Duplikat kartu → klik teks dan foto kartu baru untuk mengubahnya. Centang opsi form penawaran agar produk bisa dipesan.</p>
        <p><b>Menyembunyikan produk:</b> klik kartu → Sembunyikan. Kartu tampak pudar di editor, tidak tampil di website, dan bisa ditampilkan lagi.</p>
        <p><b>Kembali ke aslinya:</b> klik bagian yang diubah → tombol "Kembalikan ke asli".</p>
        <p><b>Kunjungan Anda sendiri</b> tidak dihitung di statistik pada browser ini setelah Anda login.</p>
        <p><b>Menambah admin:</b> di server jalankan <code>php artisan admin:create email@anda.com</code> (folder backend).</p>
        <p className="text-xs text-slate-500">Catatan: perubahan hanya mengganti isi yang ada di halaman. Kalau teks asli di kode halaman diubah developer, buka lagi halaman terkait untuk memeriksanya.</p>
      </div>
    </>
  );
}
