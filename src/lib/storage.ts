import { Task, Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-kuliah',
    name: 'Kuliah & Riset',
    colorName: 'map-ungu',
    hex: '#52006B',
    isDefault: true,
  },
  {
    id: 'cat-kerja',
    name: 'Pekerjaan Kantor',
    colorName: 'map-biru',
    hex: '#2A1FE0',
    isDefault: true,
  },
  {
    id: 'cat-pribadi',
    name: 'Urusan Pribadi',
    colorName: 'map-hijau',
    hex: '#00705A',
    isDefault: true,
  },
  {
    id: 'cat-proyek',
    name: 'Proyek Sampingan',
    colorName: 'map-merah',
    hex: '#E30000',
    isDefault: true,
  },
];

const now = new Date();
const todayEvening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0);
const todayLate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30);
const tomorrowMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 14, 0);
const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 12, 0);

export const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalisasi Draf Bab 3 Metodologi Penelitian Arsitektur',
    description: 'Pastikan referensi studi kasus Irving Gill dan American Modernism dimasukkan secara kronologis.',
    dueAt: todayEvening.toISOString().slice(0, 16),
    priority: 'tinggi',
    categoryId: 'cat-kuliah',
    status: 'belum_selesai',
    subtasks: [
      { id: 'sub-1', title: 'Periksa daftar pustaka format APA', isDone: true },
      { id: 'sub-2', title: 'Lampirkan sketsa denah lantai dasar', isDone: true },
      { id: 'sub-3', title: 'Koreksi typo dan tata bahasa draf akhir', isDone: false },
    ],
    reminder: {
      id: 'rem-1',
      remindAt: new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 16), // in 10 mins
      offset: '1_hour',
      isTriggered: false,
    },
    attachments: [
      { id: 'att-1', title: 'Draf_Bab3_Revisi.pdf', url: '#', type: 'pdf' },
      { id: 'att-2', title: 'Catatan Referensi Mosby Files', url: 'https://www.mosbyfiles.com', type: 'link' },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Kirim Invoice Termin 1 ke Klien Studio Desain',
    description: 'Sertakan rincian milestone pengerjaan wireframe dan token desain sistem.',
    dueAt: todayLate.toISOString().slice(0, 16),
    priority: 'sedang',
    categoryId: 'cat-proyek',
    status: 'belum_selesai',
    subtasks: [
      { id: 'sub-4', title: 'Generate PDF faktur pajak', isDone: true },
      { id: 'sub-5', title: 'Kirim email dengan tembusan finance', isDone: false },
    ],
    reminder: {
      id: 'rem-2',
      remindAt: todayLate.toISOString().slice(0, 16),
      offset: 'at_due',
      isTriggered: false,
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Evaluasi Mingguan Tim UI/UX Sprint 14',
    description: 'Bahas backlog perbaikan kontras WCAG 2.1 AA dan pengujian form di mobile 360px.',
    dueAt: tomorrowMorning.toISOString().slice(0, 16),
    priority: 'sedang',
    categoryId: 'cat-kerja',
    status: 'belum_selesai',
    subtasks: [
      { id: 'sub-6', title: 'Siapkan slide presentasi 5 menit', isDone: false },
      { id: 'sub-7', title: 'Kumpulkan metrik penyelesaian tugas', isDone: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Koreksi Laporan Anggaran Bulanan Departemen',
    description: 'Periksa selisih pengeluaran operasional dan langganan server cloud.',
    dueAt: yesterday.toISOString().slice(0, 16), // Overdue!
    priority: 'tinggi',
    categoryId: 'cat-kerja',
    status: 'belum_selesai',
    subtasks: [
      { id: 'sub-8', title: 'Minta nota fisik dari tim operasional', isDone: true },
      { id: 'sub-9', title: 'Update spreadsheet konsolidasi', isDone: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Beli Kertas Sketsa A3 dan Refill Tinta Printer',
    description: 'Toko alat tulis dekat kampus tutup jam 19.00.',
    dueAt: nextWeek.toISOString().slice(0, 16),
    priority: 'rendah',
    categoryId: 'cat-pribadi',
    status: 'belum_selesai',
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Setup Repositori Proyek TugasKu dan Konfigurasi Tailwind',
    description: 'Gunakan Vite React TS, import font Anton, EB Garamond, JetBrains Mono.',
    dueAt: yesterday.toISOString().slice(0, 16),
    priority: 'sedang',
    categoryId: 'cat-proyek',
    status: 'selesai',
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    subtasks: [
      { id: 'sub-10', title: 'Inisialisasi Tailwind v4 theme', isDone: true },
      { id: 'sub-11', title: 'Import font keluarga berkas', isDone: true },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const STORAGE_KEYS = {
  TASKS: 'tugasku_tasks_v1',
  CATEGORIES: 'tugasku_categories_v1',
  THEME: 'tugasku_theme_v1',
  SOUND_ENABLED: 'tugasku_sound_enabled_v1',
};

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveTasksToStorage(SEED_TASKS);
      return SEED_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadCategoriesFromStorage(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      saveCategoriesToStorage(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategoriesToStorage(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories', err);
  }
}
