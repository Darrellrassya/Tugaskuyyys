# PRD – Aplikasi Web Catatan & Reminder Tugas

**Nama Produk (sementara):** TugasKu **Versi Dokumen:** 1.0 **Tanggal:** 12 November 2026 **Status:** Draft **Tech Stack Utama:** React.js

## 1. Ringkasan Produk

TugasKu adalah aplikasi web untuk mencatat tugas, mengatur pengingat (reminder), dan menandai tugas yang sudah selesai melalui checklist. Aplikasi ini ditujukan bagi pelajar, mahasiswa, dan pekerja yang ingin mengelola kewajiban harian dengan cara sederhana, cepat, dan tidak membingungkan.

## 2. Latar Belakang & Masalah

Banyak orang mencatat tugas di berbagai tempat (chat, kertas, catatan ponsel) sehingga mudah lupa dan terlewat tenggat. Aplikasi to-do yang ada sering terlalu kompleks atau penuh fitur yang tidak dibutuhkan. Dibutuhkan aplikasi yang ringan, fokus pada tiga hal inti: **catat, ingatkan, selesaikan**.

## 3. Tujuan Produk

- Memudahkan pengguna mencatat tugas dalam waktu kurang dari 10 detik.
- Mengurangi tugas yang terlewat melalui reminder tepat waktu.
- Memberi rasa progres lewat checklist dan statistik penyelesaian.
- Menyediakan pengalaman yang responsif di desktop maupun ponsel.

## 4. Target Pengguna

| Persona | Deskripsi | Kebutuhan Utama |
| --- | --- | --- |
| Pelajar/Mahasiswa | Memiliki banyak tugas dan tenggat berbeda | Reminder tenggat, pengelompokan per mata kuliah |
| Pekerja Kantoran | Mengelola pekerjaan harian dan rapat | Prioritas, kategori, tampilan kalender |
| Freelancer | Mengurus banyak klien dan proyek | Label proyek, tenggat, tugas berulang |
| Ibu Rumah Tangga/Umum | Mengatur urusan rumah dan pribadi | Daftar sederhana, reminder harian |

## 5. Ruang Lingkup

### 5.1 Dalam Lingkup (MVP)

- Autentikasi pengguna (daftar, masuk, keluar)
- Catat tugas (CRUD)
- Reminder tugas
- Checklist tugas selesai
- Filter, pencarian, dan pengurutan
- Responsif dan mode gelap

### 5.2 Di Luar Lingkup (Versi Awal)

- Aplikasi mobile native
- Integrasi pihak ketiga (Google Calendar, WhatsApp)

## 6. Fitur & Kebutuhan Fungsional

### 6.1 Catat Tugas (Prioritas: Wajib)

**Deskripsi:** Pengguna dapat membuat, melihat, mengubah, dan menghapus tugas.

**Atribut tugas:**

- Judul (wajib, maks. 120 karakter)
- Deskripsi / catatan (opsional)
- Tanggal & jam tenggat (opsional)
- Prioritas: Rendah, Sedang, Tinggi
- Kategori / label (opsional)
- Status: Belum selesai, Selesai

**Kriteria Penerimaan:**

- Pengguna dapat menambah tugas melalui form singkat (quick add) dan form lengkap.
- Pengguna dapat mengedit semua atribut tugas.
- Penghapusan meminta konfirmasi dan menyediakan opsi *undo* selama beberapa detik.
- Tugas tersimpan dan tampil kembali setelah halaman dimuat ulang.

### 6.2 Reminder Tugas (Prioritas: Wajib)

**Deskripsi:** Pengguna menerima pengingat sebelum atau saat tenggat tugas.

**Opsi reminder:**

- Saat tenggat tiba
- 10 menit, 1 jam, 1 hari sebelum tenggat
- Waktu kustom (pilih tanggal & jam sendiri)
- Reminder berulang (harian, mingguan, bulanan)

**Kanal notifikasi:**

- Notifikasi browser (Web Push / Notification API)
- Notifikasi dalam aplikasi (banner/toast dan badge)
- Email (tahap lanjutan)

**Kriteria Penerimaan:**

- Pengguna dimintai izin notifikasi browser dengan penjelasan yang jelas.
- Reminder muncul sesuai waktu yang diatur (toleransi maks. 1 menit).
- Pengguna dapat menunda (*snooze*) reminder 5, 10, atau 30 menit.
- Reminder otomatis dibatalkan jika tugas ditandai selesai.
- Tugas yang melewati tenggat ditandai sebagai "Terlambat".

### 6.3 Checklist Tugas (Prioritas: Wajib)

**Deskripsi:** Pengguna dapat menandai tugas selesai dan membagi tugas besar menjadi sub-tugas.

**Kriteria Penerimaan:**

- Satu klik pada kotak centang menandai tugas selesai (judul dicoret, pindah ke bagian "Selesai").
- Pengguna dapat membatalkan status selesai.
- Sub-tugas (subtask) dapat ditambahkan dengan indikator progres, misalnya 3/5 selesai.
- Tugas induk otomatis ditawarkan untuk selesai bila seluruh sub-tugas selesai.
- Waktu penyelesaian tercatat.

### 6.4 Fitur Tambahan yang Berguna (Peningkatan)

| No | Fitur | Manfaat | Prioritas |
| --- | --- | --- | --- |
| 1 | Pencarian & filter (status, prioritas, kategori, tanggal) | Menemukan tugas dengan cepat | Tinggi |
| 2 | Tampilan "Hari Ini", "Mendatang", "Terlambat" | Fokus pada yang mendesak | Tinggi |
| 3 | Kategori / label berwarna | Pengelompokan tugas | Tinggi |
| 4 | Mode gelap / terang | Kenyamanan visual | Sedang |
| 5 | Tampilan kalender (bulanan/mingguan) | Gambaran beban kerja | Sedang |
| 6 | Tugas berulang | Rutinitas tidak perlu dibuat ulang | Sedang |
| 7 | Statistik produktivitas (grafik tugas selesai per minggu, streak harian) | Motivasi dan evaluasi | Sedang |
| 8 | Drag & drop untuk urutan dan pindah status | Pengaturan yang intuitif | Sedang |
| 9 | Ekspor / impor data (CSV/JSON) | Cadangan dan portabilitas | Rendah |
| 10 | Pintasan keyboard (misal N = tugas baru) | Kecepatan pengguna mahir | Rendah |
| 11 | PWA (dapat diinstal, bisa offline) | Terasa seperti aplikasi | Sedang |
| 12 | Lampiran / tautan pada tugas | Menyimpan referensi | Rendah |
| 13 | Arsip tugas selesai & tempat sampah (pulihkan) | Menghindari kehilangan data | Rendah |
| 14 | Dukungan bahasa (Indonesia & Inggris) | Jangkauan lebih luas | Rendah |

## 7. Alur Pengguna (User Flow)

1. Pengguna membuka aplikasi dan mendaftar atau masuk.
2. Dashboard menampilkan tugas "Hari Ini", "Mendatang", dan "Terlambat".
3. Pengguna menekan **+ Tugas Baru**, mengisi judul, tenggat, prioritas, dan reminder, lalu menyimpan.
4. Tugas muncul di daftar; reminder terjadwal.
5. Saat waktunya, notifikasi muncul; pengguna dapat membuka, menunda, atau menandai selesai.
6. Pengguna mencentang tugas; tugas pindah ke "Selesai" dan statistik diperbarui.

## 8. Kebutuhan Non-Fungsional

- **Performa:** halaman utama termuat < 2 detik pada jaringan 4G; interaksi terasa instan.
- **Responsif:** nyaman digunakan mulai lebar layar 360 px.
- **Aksesibilitas:** mengikuti WCAG 2.1 AA (kontras warna, navigasi keyboard, label ARIA).
- **Keamanan:** kata sandi di-hash, komunikasi lewat HTTPS, proteksi XSS dan CSRF, token autentikasi aman.
- **Keandalan:** reminder tidak boleh hilang saat browser ditutup (didukung service worker/server).
- **Privasi:** data tugas hanya dapat diakses oleh pemiliknya.
- **Kompatibilitas:** Chrome, Edge, Firefox, Safari versi terbaru.

## 9. Rekomendasi Tech Stack

### 9.1 Frontend

| Kebutuhan | Rekomendasi |
| --- | --- |
| Framework | React.js (dengan Vite) |
| Bahasa | TypeScript (disarankan) atau JavaScript |
| Routing | React Router |
| State management | Zustand atau Redux Toolkit; TanStack Query untuk data server |
| Styling | Tailwind CSS (+ shadcn/ui atau komponen sejenis) |
| Form & validasi | React Hook Form + Zod |
| Tanggal & waktu | date-fns atau Day.js |
| Drag & drop | dnd-kit |
| Grafik | Recharts |
| Notifikasi | Notification API + Service Worker (Web Push) |
| PWA | vite-plugin-pwa |
| Testing | Vitest, React Testing Library, Playwright |

### 9.2 Backend (Opsional / Rekomendasi)

Untuk MVP, ada dua pilihan:

- **Opsi A – Tanpa backend (cepat):** data disimpan di IndexedDB/LocalStorage. Cocok untuk prototipe, tetapi reminder hanya berjalan selama browser/service worker aktif dan data tidak tersinkron antar perangkat.
- **Opsi B – Dengan backend (disarankan):** Node.js (Express/NestJS) atau BaaS seperti Firebase/Supabase, dengan database PostgreSQL atau Firestore. Mendukung login, sinkronisasi antar perangkat, dan reminder sisi server (Web Push, email).

### 9.3 Deployment

Vercel atau Netlify untuk frontend; Railway, Render, atau Supabase untuk backend/database; CI/CD melalui GitHub Actions.

## 10. Model Data (Draft)

**User:** id, nama, email, password\_hash, created\_at

**Task:** id, user\_id, title, description, due\_at, priority, category\_id, status, completed\_at, recurrence\_rule, created\_at, updated\_at

**Subtask:** id, task\_id, title, is\_done

**Category:** id, user\_id, name, color

**Reminder:** id, task\_id, remind\_at, channel, status (pending/sent/snoozed/cancelled)

## 11. Rancangan Halaman (Sitemap)

- **Landing / Login / Daftar**
- **Dashboard** (Hari Ini, Mendatang, Terlambat, ringkasan progres)
- **Semua Tugas** (daftar dengan filter dan pencarian)
- **Kalender**
- **Statistik**
- **Pengaturan** (profil, tema, notifikasi, kategori, ekspor data)

## 12. Metrik Keberhasilan

| Metrik | Target (3 bulan setelah rilis) |
| --- | --- |
| Waktu membuat tugas | < 10 detik |
| Pengguna aktif mingguan (WAU) | Sesuai target internal, misal 500 pengguna |
| Tingkat penyelesaian tugas | > 60% tugas selesai sebelum tenggat |
| Retensi minggu ke-4 | > 30% |
| Opt-in notifikasi | > 50% pengguna mengizinkan |
| Skor Lighthouse (Performance & Accessibility) | > 90 |

## 13. Rencana Rilis (Roadmap)

| Fase | Durasi Perkiraan | Cakupan |
| --- | --- | --- |
| Fase 0 – Persiapan | 1 minggu | Desain UI/UX, wireframe, setup proyek |
| Fase 1 – MVP | 3–4 minggu | Autentikasi, CRUD tugas, checklist, reminder dalam aplikasi, filter dasar |
| Fase 2 – Reminder Lanjutan | 2 minggu | Web Push, snooze, tugas berulang, PWA |
| Fase 3 – Peningkatan | 2–3 minggu | Kalender, statistik, drag & drop, mode gelap, ekspor data |
| Fase 4 – Penyempurnaan | 1–2 minggu | Pengujian, optimasi performa, aksesibilitas, peluncuran |

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Pengguna menolak izin notifikasi | Reminder tidak efektif | Edukasi sebelum meminta izin; sediakan notifikasi dalam aplikasi dan email |
| Reminder tidak jalan saat browser tertutup | Tugas terlewat | Gunakan service worker dan push dari server |
| Safari/iOS membatasi Web Push | Jangkauan terbatas | Dukungan PWA terinstal; info kompatibilitas jelas |
| Kehilangan data (hanya penyimpanan lokal) | Kepercayaan menurun | Gunakan backend, sediakan ekspor/cadangan |
| Cakupan fitur membengkak | Jadwal molor | Disiplin pada MVP, fitur tambahan masuk fase berikutnya |

## 15. Pertanyaan Terbuka

- Apakah aplikasi memerlukan akun dan sinkronisasi antar perangkat sejak MVP?
- Apakah reminder via email atau WhatsApp dibutuhkan dalam waktu dekat?
- Apakah akan ada rencana kolaborasi atau berbagi tugas di masa depan?
- Apakah ada model bisnis (gratis, freemium) yang direncanakan?

## 16. Lampiran: Contoh User Story

- Sebagai pengguna, saya ingin menambah tugas dengan cepat agar tidak lupa hal yang harus dikerjakan.
- Sebagai pengguna, saya ingin diingatkan 1 jam sebelum tenggat agar sempat menyelesaikannya.
- Sebagai pengguna, saya ingin mencentang tugas yang sudah selesai agar melihat progres saya.
- Sebagai pengguna, saya ingin memfilter tugas berdasarkan prioritas agar fokus pada yang paling penting.
- Sebagai pengguna, saya ingin membuat tugas berulang agar rutinitas mingguan tidak perlu dibuat ulang.
- Sebagai pengguna, saya ingin melihat statistik mingguan agar termotivasi menjaga konsistensi.
