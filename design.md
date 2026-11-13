# DESIGN.md – TugasKu (Web Catatan & Reminder Tugas)

**Versi:** 1.0 · **Tanggal:** 12 November 2026
**Referensi visual:** https://www.mosbyfiles.com/ (analisis dari 3 tangkapan layar: halaman utama "American Modernism", halaman artikel, halaman detail "Irving Gill")
**Dokumen pendamping:** PRD TugasKu

> Catatan: nilai warna dan ukuran di bawah ini diperkirakan dari screenshot, bukan diambil dari kode situs referensi. Sesuaikan setelah prototipe jadi.

---

## 1. Konsep Desain

**Metafora: "Arsip tugas".** Tugas diperlakukan seperti berkas di laci arsip. Kategori menjadi tab map berwarna yang bertumpuk, tugas menjadi kertas, catatan tempel, dan klip yang tersebar di meja. Mosby's Files memakai metafora yang sama untuk arsip arsitektur; TugasKu meminjamnya untuk pekerjaan sehari-hari.

**Satu hal yang paling diingat:** tumpukan tab map berwarna di halaman utama. Semua elemen lain dibuat tenang agar tab map menjadi pusat perhatian.

### Apa yang diambil dari referensi

| Pengamatan pada referensi | Diterapkan di TugasKu |
|---|---|
| Latar hampir hitam, warna jenuh hanya muncul pada blok konten | Latar gelap netral; warna hanya dipakai di tab map, kertas, dan tombol utama |
| Judul raksasa, sans-serif tebal dan sempit, huruf kapital, spasi rapat | Judul halaman memakai gaya yang sama, hanya untuk judul besar |
| Subjudul dan teks panjang bergaya serif klasik | Nama tab, judul tugas, dan teks bacaan memakai serif |
| Label kecil dan deskripsi memakai monospace, rata kanan dengan panah ekspansi | Metadata (tenggat, kategori, status) memakai monospace |
| Tab map bertumpuk, tiap tab punya warna dan sudut atas membulat; klik membuka isi | Kategori/daftar tugas ditampilkan sebagai laci akordeon bertab |
| Halaman detail berlatar satu warna penuh, berisi kolase foto polaroid, kertas sobek, cetak biru, klip kertas, kartu PDF, dan catatan kuning | Halaman detail tugas berupa meja dengan kertas dan catatan tempel |
| Tombol "Next" berbentuk pil kuning di pojok kanan bawah, dengan kartu kecil pratinjau bagian berikutnya | Tombol pil kuning untuk tugas berikutnya, dengan kartu pratinjau |
| Halaman artikel putih seperti kertas: judul tebal, teks serif berkolom, gambar bersama keterangan, tombol tutup bulat | Mode "Kertas" (tema terang) dan panel catatan panjang |

### Prinsip

1. **Warna adalah kategori, bukan hiasan.** Setiap warna mewakili satu hal (daftar, kategori, atau status) dan konsisten di seluruh aplikasi.
2. **Tipografi membawa kepribadian.** Tiga keluarga huruf dengan peran yang jelas dan berbeda.
3. **Gerak menjawab tindakan.** Membuka laci, mencentang, dan menunda reminder punya animasi yang menunjukkan perubahan. Tidak ada animasi masuk berlebihan pada setiap bagian.
4. **Dekorasi harus berfungsi.** Klip kertas berarti ada lampiran, kertas sobek berarti ada reminder, cetak biru berarti ada sub-tugas. Tidak ada elemen hanya untuk hias.
5. **Cepat dulu, gaya kemudian.** Membuat tugas harus tetap di bawah 10 detik meski tampilannya ekspresif.

---

## 2. Framework & Library

### 2.1 Stack yang dipakai

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Framework UI | **React.js** + **Vite** + **TypeScript** | Sesuai PRD; build cepat |
| Styling | **Tailwind CSS v4** (konfigurasi lewat CSS `@theme`) | Token desain langsung jadi utility class |
| Komponen aksesibel tanpa gaya | **Radix UI Primitives** (Dialog, Checkbox, Dropdown, Tooltip, Collapsible) | Fokus keyboard dan ARIA sudah benar; tampilan bebas dibuat sendiri |
| Animasi | **Motion** (`motion/react`, sebelumnya Framer Motion) | Animasi layout untuk laci akordeon, drag kartu, dan transisi halaman |
| Drag & drop | **dnd-kit** | Menyusun ulang tugas dan memindahkan antar laci |
| Routing | **React Router** | Halaman daftar, detail, kalender, statistik |
| State | **Zustand** (UI) + **TanStack Query** (data server) | Ringan dan jelas pembagiannya |
| Form | **React Hook Form** + **Zod** | Validasi form tugas |
| Tanggal | **date-fns** (locale `id`) | Format tanggal Indonesia |
| Ikon | **Lucide React** | Garis tipis, cocok dengan gaya arsip |
| Grafik | **Recharts** | Halaman statistik |
| Toast | **Sonner** | Notifikasi dalam aplikasi dan *undo* |
| Utilitas class | **clsx** + **tailwind-merge** | Menggabungkan class bersyarat |
| PWA | **vite-plugin-pwa** | Bisa dipasang dan berjalan offline |
| Font | **@fontsource** | Font di-host sendiri; tidak bergantung CDN |

Opsional: **GSAP** bila nanti butuh animasi berurutan yang rumit (misalnya intro halaman). Untuk MVP, Motion sudah cukup.

### 2.2 Instalasi

```bash
npm create vite@latest tugasku -- --template react-ts
cd tugasku

# Runtime
npm i react-router-dom zustand @tanstack/react-query \
  react-hook-form zod @hookform/resolvers date-fns \
  motion @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
  lucide-react recharts sonner clsx tailwind-merge \
  @radix-ui/react-dialog @radix-ui/react-checkbox \
  @radix-ui/react-collapsible @radix-ui/react-dropdown-menu \
  @radix-ui/react-tooltip

# Font
npm i @fontsource/anton @fontsource-variable/eb-garamond \
  @fontsource-variable/jetbrains-mono

# Dev
npm i -D tailwindcss @tailwindcss/vite vite-plugin-pwa \
  vitest @testing-library/react @testing-library/jest-dom \
  @playwright/test
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## 3. Token Desain

### 3.1 Warna

**Inti (tema gelap, bawaan):**

| Nama | Hex | Peran |
|---|---|---|
| `arsip` | `#141414` | Latar halaman |
| `tinta` | `#FFFFFF` | Teks utama dan judul |
| `abu` | `#8C8C8C` | Teks sekunder, subjudul |
| `kertas` | `#F4F1EA` | Permukaan kertas, panel bacaan, tema terang |
| `krem` | `#F6EBD9` | Kartu dokumen dan lampiran |

**Warna map (kategori dan status):**

| Nama | Hex | Dipakai untuk |
|---|---|---|
| `map-merah` | `#E30000` | Hari ini; aksen mendesak |
| `map-biru` | `#2A1FE0` | Mendatang |
| `map-hijau` | `#00705A` | Selesai |
| `map-ungu` | `#52006B` | Kategori pengguna (contoh: Kuliah) |
| `map-hitam` | `#000000` | Arsip dan tempat sampah |
| `map-kuning` | `#FFE600` | Tombol utama, sorotan tindakan |
| `kertas-teal` | `#6BB5B0` | Kertas sobek untuk reminder |
| `catatan` | `#FFC93C` | Catatan tempel (tugas prioritas) |

**Aturan penggunaan warna:**

- Teks di atas `map-merah`, `map-biru`, `map-hijau`, `map-ungu`, dan `map-hitam` selalu putih.
- Teks di atas `map-kuning`, `catatan`, `kertas`, dan `krem` selalu hitam (`#141414`).
- Terlambat memakai `map-merah`. Karena Hari ini juga merah, bedakan dengan ikon dan label teks, jangan hanya warna.
- Pengguna boleh membuat kategori sendiri dari palet map di atas (maksimal 6 warna agar tetap konsisten).

### 3.2 Tipografi

| Peran | Keluarga | Alternatif | Gaya |
|---|---|---|---|
| **Judul (display)** | Anton | Bebas Neue, Oswald | Huruf kapital, `letter-spacing: -0.01em`, `line-height: 0.95` |
| **Teks & nama (serif)** | EB Garamond | Cormorant Garamond | Sentence case; `line-height: 1.5` |
| **Metadata (mono)** | JetBrains Mono | IBM Plex Mono | 12–13 px; sentence case, tidak dikapitalkan |

Tiga keluarga dipakai karena referensi memang memadukan ketiganya dengan peran jelas. Batasi diri: huruf kapital hanya untuk judul besar. Label dan tombol memakai sentence case agar tetap mudah dibaca.

**Skala tipe:**

| Token | Ukuran | Dipakai untuk |
|---|---|---|
| `text-hero` | `clamp(3.5rem, 12vw, 9rem)` | Judul halaman (Anton) |
| `text-title` | `clamp(2rem, 5vw, 3.5rem)` | Judul tugas di halaman detail (Anton) |
| `text-tab` | `1.5rem` / `1.25rem` di mobile | Nama di tab map (serif) |
| `text-body` | `1.125rem` | Isi catatan dan deskripsi (serif) |
| `text-sub` | `1rem` | Subjudul halaman (serif, warna `abu`) |
| `text-meta` | `0.8125rem` | Tenggat, kategori, status (mono) |

**Panjang baris:** teks bacaan maksimal 65–72 karakter (`max-w-prose`).

### 3.3 Bentuk, jarak, bayangan

| Token | Nilai | Catatan |
|---|---|---|
| `radius-tab` | `28px 28px 0 0` | Sudut atas tab map; bawah lurus |
| `radius-pil` | `9999px` | Tombol aksi utama |
| `radius-kertas` | `2px` | Kertas hampir tajam, seperti kertas asli |
| Jarak dasar | `4px` | Kelipatan 4 |
| Lebar maks. konten | `1200px` | Pusat halaman |
| Bayangan kertas | `0 6px 14px rgb(0 0 0 / .35)` | Hanya untuk kertas dan catatan, bukan semua elemen |
| Rotasi kertas | `-4°` s.d. `4°` | Tetap per tugas (berdasar id), bukan acak setiap render |

### 3.4 Kode token (Tailwind v4)

`src/index.css`:

```css
@import "tailwindcss";
@import "@fontsource/anton";
@import "@fontsource-variable/eb-garamond";
@import "@fontsource-variable/jetbrains-mono";

@theme {
  /* Warna */
  --color-arsip: #141414;
  --color-tinta: #ffffff;
  --color-abu: #8c8c8c;
  --color-kertas: #f4f1ea;
  --color-krem: #f6ebd9;

  --color-map-merah: #e30000;
  --color-map-biru: #2a1fe0;
  --color-map-hijau: #00705a;
  --color-map-ungu: #52006b;
  --color-map-hitam: #000000;
  --color-map-kuning: #ffe600;
  --color-kertas-teal: #6bb5b0;
  --color-catatan: #ffc93c;

  /* Font */
  --font-display: "Anton", "Oswald", Impact, sans-serif;
  --font-serif: "EB Garamond Variable", "Cormorant Garamond", Georgia, serif;
  --font-mono: "JetBrains Mono Variable", "IBM Plex Mono", ui-monospace, monospace;

  /* Bentuk */
  --radius-tab: 28px 28px 0 0;
  --radius-kertas: 2px;
  --shadow-kertas: 0 6px 14px rgb(0 0 0 / 0.35);
}

@layer base {
  html { background: var(--color-arsip); color: var(--color-tinta); }
  body { font-family: var(--font-serif); font-size: 1.125rem; line-height: 1.5; }
  :focus-visible { outline: 3px solid var(--color-map-kuning); outline-offset: 3px; }
}

/* Tema "Kertas" (terang) */
[data-theme="kertas"] {
  --color-arsip: #f4f1ea;
  --color-tinta: #141414;
  --color-abu: #5c5c5c;
}
```

---

## 4. Tata Letak Halaman

### 4.1 Beranda (Laci Arsip)

Halaman utama meniru struktur referensi: judul besar, subjudul kecil, lalu tumpukan tab map.

```
┌──────────────────────────────────────────────────────────┐
│ TUGASKU                                  Statistik  Akun │  ← bilah atas, 1 baris
├──────────────────────────────────────────────────────────┤
│                                                          │
│                  KAMIS, 12 NOVEMBER                      │  ← judul besar (Anton)
│          3 tugas hari ini, 1 terlambat, 2 selesai        │  ← subjudul serif abu
│                                                          │
│  ╭─Mendatang─╮ ╭─Kuliah─╮                                │  ← tab map bertumpuk
│ ┌┴───────────┴─┴────────┴────────────────────────────┐   │
│ │▓▓▓ biru ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Mendatang · 2 tugas  ▾│   │
│ ├────────────────────────────────────────────────────┤   │
│ │▓▓▓ hijau ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Selesai · 2          ▸│   │
│ ├────────────────────────────────────────────────────┤   │
│ │▓▓▓ ungu ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Kuliah · 4           ▸│   │
│ ├────────────────────────────────────────────────────┤   │
│ │███ merah (laci terbuka) ██  Hari ini · 3            ▾│   │
│ │  [catatan tempel][catatan tempel][catatan tempel]   │   │
│ │   + Tugas baru                                      │   │
│ └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

- Tab map bertumpuk vertikal; satu laci terbuka pada satu waktu (akordeon tunggal) agar tumpukan tetap terbaca.
- Laci **Hari ini** terbuka secara bawaan.
- Tab di bagian atas laci menampilkan nama kategori/tugas yang bisa langsung diklik (seperti nama arsitek pada referensi).
- Di sisi kanan setiap laci: label monospace (nama + jumlah) dan panah ekspansi.
- Tombol **+ Tugas baru** berada di dalam laci terbuka, sekaligus tersedia lewat pintasan `N`.

### 4.2 Detail Tugas (Meja Kerja)

Meniru halaman "Irving Gill": satu warna penuh sebagai latar dan kolase kertas di atasnya. Warna latar mengikuti warna laci asal tugas.

```
┌──────────────────────────────────────────────────────────┐
│ NAMA TUGAS (kecil, kiri atas)                       ✕    │
├──────────────────────────────────────────────────────────┤
│        ┌─────────────┐ ┌──────────────┐                  │
│  ╔═══╗ │ kertas sobek │ │  cetak biru  │  📎              │
│  ║foto║ │ teal: Remin- │ │  Sub-tugas   │                  │
│  ╚═══╝ │ der 1 jam    │ │  ☑ ☑ ☐ ☐     │                  │
│        └─────────────┘ └──────────────┘                  │
│   ┌──────────────┐   ┌────────────────┐   ┌───────────┐  │
│   │ kartu krem   │   │ catatan kuning │   │ Berikutnya│  │
│   │ Lampiran/PDF │   │ Deskripsi tugas│   │ pratinjau │  │
│   └──────────────┘   └────────────────┘   └───[Next]──┘  │
└──────────────────────────────────────────────────────────┘
```

| Elemen kolase | Isi tugas | Gaya |
|---|---|---|
| Catatan tempel kuning | Judul dan deskripsi | Judul Anton, isi mono |
| Kertas sobek teal | Pengaturan reminder (waktu, ulangi, snooze) | Tepi bergerigi (CSS `clip-path`), teks mono |
| Cetak biru | Daftar sub-tugas dan progres | Latar biru muda dengan garis grid halus |
| Kartu krem | Lampiran dan tautan | Label `[PDF]`, `[Tautan]` seperti kartu pada referensi |
| Foto polaroid | Gambar lampiran (opsional) | Bingkai putih, sedikit miring |
| Klip kertas | Penanda bahwa ada lampiran | Ikon SVG di sudut kertas |
| Pil kuning **Berikutnya** | Pindah ke tugas berikutnya dalam laci | Pojok kanan bawah, tetap saat digulir |
| Kartu pratinjau | Nama dan kategori tugas berikutnya | Warna sesuai laci tujuan |

Pada mobile, kolase berubah menjadi satu kolom: tumpukan kertas vertikal dengan sedikit rotasi.

### 4.3 Kalender

Grid bulanan di atas latar `arsip`. Hari memakai garis tipis, tugas muncul sebagai titik berwarna map. Klik hari membuka panel kertas (gaya halaman artikel) berisi daftar tugas hari itu.

### 4.4 Statistik

Judul besar "MINGGU INI" dengan angka tugas selesai. Grafik batang Recharts memakai warna `map-hijau` (selesai) dan `map-merah` (terlambat) di atas permukaan `kertas`. Streak harian ditampilkan sebagai deretan tab kecil, satu tab per hari.

### 4.5 Panel Kertas (Catatan Panjang & Pengaturan)

Meniru halaman artikel: panel putih kertas dari kanan atau tengah layar, judul Anton tebal, teks serif, tombol tutup bulat di pojok kanan atas. Dipakai untuk pengaturan, bantuan, dan deskripsi tugas yang panjang.

---

## 5. Komponen

### 5.1 `FolderTab` (tab map)

- Bentuk: `radius-tab`, tinggi 44–52 px, teks serif `text-tab` putih.
- Tab tumpang-tindih sedikit (margin negatif −12 px) sehingga terlihat seperti tumpukan berkas.
- Tab aktif naik 4 px dan warnanya penuh; tab lain sedikit lebih redup.
- Radix `Collapsible` untuk perilaku buka-tutup; Motion `layout` untuk transisi tinggi.

```tsx
// Kerangka komponen
<Collapsible.Root open={open} onOpenChange={setOpen}>
  <Collapsible.Trigger className="flex w-full items-center justify-between px-6 py-3
      font-mono text-[0.8125rem] text-tinta" style={{ background: warna }}>
    <span>{nama} · {jumlah}</span>
    <ChevronDown className={open ? 'rotate-180' : ''} />
  </Collapsible.Trigger>
  <Collapsible.Content asChild>
    <motion.div layout initial={{ height: 0 }} animate={{ height: 'auto' }}
                exit={{ height: 0 }} style={{ background: warna }}>
      {children}
    </motion.div>
  </Collapsible.Content>
</Collapsible.Root>
```

### 5.2 `TaskNote` (catatan tempel / kartu tugas)

- Latar `catatan` (prioritas tinggi), `krem` (sedang), `kertas` (rendah).
- Bagian atas: kotak centang, judul serif (dicoret saat selesai).
- Bagian bawah: metadata mono (tenggat, kategori).
- Rotasi tetap −3° s.d. 3°; saat hover/fokus berotasi ke 0° dan naik 4 px.
- Klip kertas muncul bila ada lampiran; ikon lonceng bila ada reminder.
- Dapat diseret dengan dnd-kit (handle di tepi kiri; tersedia juga tombol "Pindah ke…" untuk pengguna keyboard).

### 5.3 `Checkbox` (checklist)

- Radix `Checkbox`, ukuran 28 px, garis tebal 2 px, sudut tajam.
- Saat dicentang: tanda centang tergambar (animasi *stroke*, 200 ms), judul tugas dicoret dengan garis yang memanjang dari kiri ke kanan (300 ms), lalu kertas meluncur ke laci **Selesai**.
- Mencentang adalah momen animasi terbesar di aplikasi ini; jangan tambahkan animasi besar lain.
- Tersedia **Urungkan** lewat toast Sonner selama 6 detik.

### 5.4 `PilButton` (tombol aksi)

| Varian | Gaya | Contoh teks |
|---|---|---|
| Utama | Latar `map-kuning`, teks hitam, `radius-pil`, padding 12×24 px | Simpan tugas |
| Sekunder | Garis putih 2 px, tanpa latar | Batal |
| Bahaya | Latar `map-merah`, teks putih | Hapus tugas |
| Berikutnya | Seperti utama, tetap di pojok kanan bawah | Berikutnya |

Teks tombol memakai kata kerja yang spesifik ("Simpan tugas", bukan "Kirim") dan tidak diakhiri tanda panah.

### 5.5 `ReminderPaper` (kertas sobek)

- Latar `kertas-teal`, tepi atas bergerigi dengan `clip-path: polygon(...)`.
- Isi: waktu reminder (mono, besar), pengulangan, dan tombol **Tunda 10 menit**.
- Saat reminder aktif di dalam aplikasi, kertas ini muncul sebagai toast dari kanan atas dan bergetar ringan sekali.

### 5.6 `QuickAdd` (tambah cepat)

- Satu baris input di dasar laci terbuka: judul, pilihan tenggat cepat (Hari ini, Besok, Minggu depan), tekan Enter untuk menyimpan.
- Input memakai garis bawah putih, tanpa kotak, font serif.
- Mengurai teks alami sederhana (opsional tahap lanjut): "Laporan besok 09.00".

### 5.7 `Panel` (dialog kertas)

- Radix `Dialog`; latar `kertas`, teks hitam, judul Anton, tombol tutup bulat di pojok kanan atas.
- Overlay `rgb(0 0 0 / .6)`.
- Fokus terkunci di dalam panel; `Esc` menutup.

### 5.8 Status kosong dan pesan galat

Pesan menjelaskan apa yang bisa dilakukan, tanpa basa-basi.

| Situasi | Teks |
|---|---|
| Laci Hari ini kosong | "Belum ada tugas hari ini. Tekan N untuk menambah tugas." |
| Semua tugas selesai | "Semua tugas hari ini selesai." |
| Izin notifikasi ditolak | "Notifikasi browser dimatikan. Reminder tetap muncul di dalam aplikasi. Aktifkan lewat pengaturan browser." |
| Gagal menyimpan | "Tugas belum tersimpan. Periksa koneksi, lalu coba lagi." |

---

## 6. Gerak (Motion)

| Momen | Animasi | Durasi |
|---|---|---|
| Buka/tutup laci | Tinggi berubah dengan `layout`; panah berputar | 350 ms, `easeOut` |
| Mencentang tugas | Centang tergambar, judul dicoret, kertas pindah ke Selesai | 200 + 300 ms |
| Membuat tugas | Kertas jatuh ke laci dengan sedikit rotasi | 300 ms |
| Membuka detail | Warna latar laci memenuhi layar dari posisi tab yang diklik, lalu kolase muncul | 450 ms |
| Reminder aktif | Kertas teal masuk, bergetar sekali | 400 ms |
| Berikutnya | Kartu pratinjau bergeser, kolase berganti | 400 ms |

**Aturan:**

- Satu momen besar per tindakan; jangan menumpuk animasi.
- Tidak ada animasi masuk otomatis pada setiap bagian halaman saat dimuat.
- Hormati `prefers-reduced-motion`: ganti semua gerak dengan *fade* 100 ms.

```tsx
import { MotionConfig } from 'motion/react'
<MotionConfig reducedMotion="user">{/* seluruh aplikasi */}</MotionConfig>
```

---

## 7. Responsif

| Breakpoint | Perilaku |
|---|---|
| < 640 px (mobile) | Tab map tetap bertumpuk; judul besar `clamp` mengecil; catatan tempel satu kolom; tombol **+ Tugas baru** mengambang di kanan bawah (pil kuning); kolase detail jadi satu kolom |
| 640–1024 px | Catatan tempel dua kolom; kolase detail dua kolom |
| > 1024 px | Catatan tempel tiga kolom; kolase penuh; pratinjau tugas berikutnya tampil |

- Target sentuh minimal 44×44 px.
- Konten tidak boleh menggulir ke samping pada lebar 360 px.

---

## 8. Aksesibilitas

- Standar target: **WCAG 2.1 AA**.
- Kombinasi warna sudah dipilih agar teks besar (≥ 24 px) di atas `map-merah` tetap terbaca; **teks kecil mono di atas `map-merah` dan `map-hijau` harus putih dan diperiksa dengan alat kontras** sebelum rilis.
- Warna tidak pernah menjadi satu-satunya penanda: status "Terlambat" selalu disertai ikon dan kata, bukan hanya merah.
- Fokus keyboard terlihat jelas (garis kuning 3 px); semua aksi seret-lepas punya alternatif keyboard.
- Laci akordeon memakai atribut `aria-expanded` (otomatis dari Radix).
- Kertas yang dirotasi hanya dekoratif; urutan baca DOM tetap logis.
- Reminder dan toast diumumkan dengan `aria-live="polite"`.
- Dukungan `prefers-reduced-motion` dan `prefers-color-scheme` (mengatur tema awal).

---

## 9. Mode Tema

| Tema | Latar | Teks | Kapan |
|---|---|---|---|
| **Arsip** (gelap, bawaan) | `#141414` | Putih | Bawaan; mengikuti referensi |
| **Kertas** (terang) | `#F4F1EA` | `#141414` | Mengikuti halaman artikel referensi; dipilih pengguna atau mengikuti sistem |

Warna map tetap sama di kedua tema. Hanya latar dan teks dasar yang berubah (lihat `[data-theme="kertas"]` di bagian 3.4).

---

## 10. Struktur Folder

```
src/
├─ assets/              # tekstur kertas, SVG klip, polaroid
├─ components/
│  ├─ folder/           # FolderTab, FolderDrawer, DrawerStack
│  ├─ task/             # TaskNote, TaskForm, QuickAdd, SubtaskBlueprint
│  ├─ reminder/         # ReminderPaper, SnoozeMenu
│  ├─ ui/               # PilButton, Panel, Checkbox, Toast
│  └─ layout/           # TopBar, DeskLayout
├─ features/
│  ├─ tasks/            # store, hooks, api
│  ├─ reminders/        # penjadwal, service worker, push
│  └─ stats/
├─ pages/               # Home, TaskDetail, Calendar, Stats, Settings
├─ lib/                 # cn(), tanggal, id-warna
├─ styles/              # index.css (token Tailwind)
└─ main.tsx
```

---

## 11. Pemetaan ke Fitur PRD

| Fitur PRD | Wujud desain |
|---|---|
| Catat tugas | `QuickAdd` di dalam laci + `TaskForm` di Panel Kertas |
| Reminder tugas | `ReminderPaper` (kertas teal) pada detail; ikon lonceng di `TaskNote`; toast kertas saat reminder aktif |
| Checklist tugas | `Checkbox` dengan animasi coret; sub-tugas pada kertas cetak biru |
| Filter & pencarian | Kolom cari di bilah atas; filter berupa tab map kecil |
| Kategori/label | Warna map-ungu dan kustom; tab per kategori |
| Mode gelap/terang | Tema Arsip dan Kertas |
| Kalender | Halaman Kalender (4.3) |
| Statistik | Halaman Statistik (4.4) |
| Drag & drop | dnd-kit pada `TaskNote` |
| PWA | `vite-plugin-pwa`, ikon aplikasi berbentuk tab map |

---

## 12. Daftar Periksa Implementasi

- [ ] Inisialisasi Vite + React + TypeScript, pasang Tailwind v4 dan token di `index.css`
- [ ] Pasang font Anton, EB Garamond, JetBrains Mono lewat `@fontsource`
- [ ] Bangun `FolderTab` dan `DrawerStack` (akordeon tunggal)
- [ ] Bangun `TaskNote` dengan rotasi tetap berdasar id
- [ ] Bangun `Checkbox` dengan animasi coret dan pindah ke Selesai
- [ ] Bangun `QuickAdd` dan `TaskForm` (React Hook Form + Zod)
- [ ] Bangun halaman Detail Tugas (kolase) dan tombol **Berikutnya**
- [ ] Bangun `ReminderPaper`, penjadwal reminder, dan izin notifikasi
- [ ] Terapkan `MotionConfig reducedMotion="user"`
- [ ] Uji kontras warna, fokus keyboard, dan lebar 360 px
- [ ] Uji Lighthouse (Performance dan Accessibility > 90)

---

## 13. Hal yang Perlu Dikonfirmasi

- Apakah tumpukan tab map cukup jelas untuk pengguna baru, atau perlu pilihan tampilan daftar biasa sebagai alternatif?
- Apakah kolase di halaman detail dipertahankan penuh, atau disederhanakan agar membuat dan membaca tugas tetap cepat?
- Apakah aset visual seperti polaroid dan tekstur kertas dibuat sendiri, dibeli, atau memakai ilustrasi vektor?
