export type Priority = 'rendah' | 'sedang' | 'tinggi';

export type TaskStatus = 'belum_selesai' | 'selesai';

export type RecurrenceRule = 'none' | 'harian' | 'mingguan' | 'bulanan';

export interface Subtask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface TaskAttachment {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'image' | 'doc';
}

export type ReminderOffset = 'at_due' | '10_min' | '1_hour' | '1_day' | 'custom';

export interface TaskReminder {
  id: string;
  remindAt: string; // ISO date-time string
  offset: ReminderOffset;
  isTriggered: boolean;
  isSnoozed?: boolean;
  snoozedUntil?: string; // ISO date-time string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueAt?: string; // ISO string YYYY-MM-DDTHH:mm
  priority: Priority;
  categoryId: string;
  status: TaskStatus;
  completedAt?: string;
  subtasks: Subtask[];
  recurrenceRule?: RecurrenceRule;
  attachments?: TaskAttachment[];
  reminder?: TaskReminder;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  colorName: 'map-merah' | 'map-biru' | 'map-hijau' | 'map-ungu' | 'map-kuning' | 'map-hitam';
  hex: string;
  isDefault?: boolean;
}

export type DrawerFilter = 'hari-ini' | 'mendatang' | 'terlambat' | 'selesai' | string; // category id or built-in filter
