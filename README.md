# TugasKu — Aplikasi Web Catatan & Reminder Tugas

Aplikasi web modern untuk mencatat tugas, mengatur pengingat (reminder), dan menandai tugas yang sudah selesai dengan metafora **"Arsip Tugas"** (laci berkas dan meja kerja), terinspirasi dari konsep visual [Mosby's Files](https://www.mosbyfiles.com/).

Dokumen spesifikasi:
- **PRD**: [PRD – Aplikasi Web Catatan & Reminder Tugas.md](file:///Users/Projeccct/ProjectNovember/PRD%20–%20Aplikasi%20Web%20Catatan%20&%20Reminder%20Tugas.md)
- **Desain**: [design.md](file:///Users/Projeccct/ProjectNovember/design.md)

---

## Fitur Utama yang Telah Diimplementasikan

### 1. Metafora "Laci Arsip" (Folder Drawer Stack)
- **Tumpukan Tab Map Berwarna**:
  - 🔴 **Hari Ini** (`#E30000` / `map-merah`) — terbuka secara bawaan
  - 🔵 **Mendatang** (`#2A1FE0` / `map-biru`)
  - 🔴 **Terlambat** (`#A30000` dengan lencana peringatan)
  - 🟢 **Selesai** (`#00705A` / `map-hijau`)
  - 🟣 **Kategori Kustom** (Kuliah & Riset, Pekerjaan Kantor, Urusan Pribadi, Proyek Sampingan, dll.)
- **Perilaku Akordeon Tunggal**: Membuka satu laci dengan animasi mulus (`motion/react` layout transition).

### 2. Catatan Tempel & Checklist Taktil
- **Kartu Tugas (`TaskNote`)**:
  - Warna kartu berdasarkan prioritas: **Tinggi** (`catatan` kuning `#FFC93C`), **Sedang** (`krem` `#F6EBD9`), **Rendah** (`kertas` `#F4F1EA`).
  - Rotasi tetap berdasarkan hash ID tugas (-3° s.d. 3°), berotasi ke 0° dan terangkat saat di-hover.
  - Ornamen klip kertas saat memiliki lampiran / tautan referensi.
  - Checklist dengan animasi coret dan efek suara centang taktil (Web Audio API synthesis).
  - Opsi **Urungkan (Undo)** melalui toast Sonner selama 6 detik.

### 3. Tambah Cepat (< 10 Detik) & Form Lengkap
- **`QuickAdd`**: Baris input langsung di dasar laci aktif dengan opsi tenggat cepat (Hari Ini, Besok, +7 Hari), siklus prioritas, dan tombol simpan cepat.
- **Pintasan Keyboard Global `N`**: Tekan huruf **N** di halaman mana saja untuk membuka form tugas lengkap.
- **Form Berkas Lengkap (`TaskFormModal`)**: Validasi Zod + React Hook Form, judul, deskripsi, kategori, prioritas, tenggat waktu, pengulangan (harian, mingguan, bulanan), sub-tugas, lampiran dokumen/tautan, dan konfigurasi reminder.

### 4. Meja Kerja Kolase Detail Tugas (`TaskDetailDesk`)
- Latar warna penuh mengikuti laci/kategori tugas.
- **Catatan Tempel Kuning**: Judul raksasa font display **Anton**, isi catatan serif **EB Garamond**, checkbox penyelesaian.
- **Cetak Biru (`SubtaskBlueprint`)**: Sub-tugas dengan gaya cetak biru bergaris grid biru, progress bar (misal `2/3 (67%)`), dan tambah langkah sub-tugas langsung di meja.
- **Kertas Sobek Teal (`ReminderPaper`)**: Tepi atas bergerigi (*torn edge polygon clip-path*), penunda reminder (+5m, +10m, +30m), dan waktu pengingat.
- **Kartu Dokumen Krem**: Pratinjau lampiran PDF dan tautan referensi.
- **Tombol Pil Kuning "Berikutnya"**: Mengambang di pojok kanan bawah dengan kartu pratinjau tugas berikutnya dalam antrean.

### 5. Sistem Reminder Cerdas & Notifikasi
- Dukungan **Browser Notification API** + **In-App Reminder Banner** (kertas sobek teal bergetar halus di pojok kanan atas).
- Tombol tunda (*snooze*) 5, 10, atau 30 menit.
- Suara lonceng (*chime*) menggunakan Web Audio API tanpa perlu aset eksternal.
- Reminder otomatis dibatalkan jika tugas sudah ditandai selesai.

### 6. Kalender & Statistik Produktivitas
- **Kalender Bulanan**: Grid kalender elegan dengan titik warna penanda tugas dan panel kertas detail hari yang diklik.
- **Statistik Mingguan**: Kartu metrik kelulusan tugas, grafik batang interaktif Recharts (`map-hijau` vs `map-merah`), dan tab konsistensi streak harian Senin–Minggu.

### 7. Tema & Portabilitas Data
- **Tema Ganda**:
  - **Arsip** (Gelap, default, `#141414`)
  - **Kertas** (Terang, `#F4F1EA`)
- **Ekspor & Impor Data**: Format JSON cadangan penuh.
- **Penyimpanan Lokal**: Tersimpan otomatis di `localStorage` dengan data awal (*seed data*) realistis.

---

## Cara Menjalankan

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
2. **Build untuk Produksi**:
   ```bash
   npm run build
   ```
3. **Pratinjau Hasil Build**:
   ```bash
   npm run preview
   ```
