import { create } from 'zustand';
import { Task, Category, Priority, TaskStatus } from '../../types';
import { loadTasksFromStorage, saveTasksToStorage, loadCategoriesFromStorage, saveCategoriesToStorage } from '../../lib/storage';
import { playCompleteSound, playTickSound } from '../../lib/audio';
import { reminderService } from '../reminders/reminderService';
import { toast } from 'sonner';

interface TaskStoreState {
  tasks: Task[];
  categories: Category[];
  searchQuery: string;
  filterPriority: Priority | 'all';
  filterCategory: string | 'all';
  activeDrawerId: string;
  recentlyCompletedId: string | null;
  lastDeletedTask: Task | null;

  // Actions
  addTask: (data: Partial<Task> & { title: string; categoryId: string }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  snoozeReminder: (taskId: string, minutes: number) => void;
  dismissReminder: (taskId: string) => void;
  setActiveDrawerId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: Priority | 'all') => void;
  setFilterCategory: (categoryId: string | 'all') => void;
  addCategory: (name: string, colorName: Category['colorName'], hex: string) => void;
  undoDelete: () => void;
  importTasks: (jsonStr: string) => boolean;
  exportTasks: () => string;
}

export const useTaskStore = create<TaskStoreState>((set, get) => {
  const initialTasks = loadTasksFromStorage();
  const initialCategories = loadCategoriesFromStorage();

  return {
    tasks: initialTasks,
    categories: initialCategories,
    searchQuery: '',
    filterPriority: 'all',
    filterCategory: 'all',
    activeDrawerId: 'hari-ini', // Default as per design.md section 4.1
    recentlyCompletedId: null,
    lastDeletedTask: null,

    addTask: (data) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title.trim(),
        description: data.description?.trim() || '',
        dueAt: data.dueAt,
        priority: data.priority || 'sedang',
        categoryId: data.categoryId,
        status: 'belum_selesai',
        subtasks: data.subtasks || [],
        recurrenceRule: data.recurrenceRule || 'none',
        attachments: data.attachments || [],
        reminder: data.reminder,
        createdAt: now,
        updatedAt: now,
      };

      const updated = [newTask, ...get().tasks];
      saveTasksToStorage(updated);
      set({ tasks: updated });
      playTickSound();
      toast.success('Tugas baru disimpan ke arsip.');
      return newTask;
    },

    updateTask: (id, updates) => {
      const updated = get().tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      saveTasksToStorage(updated);
      set({ tasks: updated });
      toast.success('Perubahan berkas disimpan.');
    },

    deleteTask: (id) => {
      const toDelete = get().tasks.find((t) => t.id === id);
      if (!toDelete) return;

      const remaining = get().tasks.filter((t) => t.id !== id);
      saveTasksToStorage(remaining);
      set({ tasks: remaining, lastDeletedTask: toDelete });

      playTickSound();
      toast('Tugas dipindahkan ke tempat sampah', {
        action: {
          label: 'Urungkan (Undo)',
          onClick: () => get().undoDelete(),
        },
        duration: 6000,
      });
    },

    undoDelete: () => {
      const deleted = get().lastDeletedTask;
      if (!deleted) return;

      const restored = [deleted, ...get().tasks];
      saveTasksToStorage(restored);
      set({ tasks: restored, lastDeletedTask: null });
      playTickSound();
      toast.success('Tugas dipulihkan kembali ke arsip.');
    },

    toggleTaskStatus: (id) => {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;

      const nextStatus: TaskStatus = task.status === 'selesai' ? 'belum_selesai' : 'selesai';
      const now = new Date().toISOString();

      if (nextStatus === 'selesai') {
        playCompleteSound();
        set({ recentlyCompletedId: id });
        setTimeout(() => {
          set({ recentlyCompletedId: null });
        }, 600);
      } else {
        playTickSound();
      }

      // Check for recurrence: if recurring and finished, we can auto-reschedule or mark finished
      const updated = get().tasks.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'selesai' ? now : undefined,
            // If completed, cancel pending reminder triggers
            reminder: t.reminder
              ? {
                  ...t.reminder,
                  isTriggered: nextStatus === 'selesai' ? true : t.reminder.isTriggered,
                }
              : undefined,
            updatedAt: now,
          };
        }
        return t;
      });

      saveTasksToStorage(updated);
      set({ tasks: updated });

      if (nextStatus === 'selesai') {
        toast.success(`"${task.title}" selesai & dipindahkan ke laci Selesai`, {
          action: {
            label: 'Urungkan',
            onClick: () => get().toggleTaskStatus(id),
          },
          duration: 6000,
        });
      } else {
        toast('Tugas dikembalikan ke daftar belum selesai');
      }
    },

    toggleSubtask: (taskId, subtaskId) => {
      let allDone = false;
      const updated = get().tasks.map((task) => {
        if (task.id === taskId) {
          const nextSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, isDone: !sub.isDone } : sub
          );
          allDone = nextSubtasks.length > 0 && nextSubtasks.every((s) => s.isDone);
          return {
            ...task,
            subtasks: nextSubtasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });

      saveTasksToStorage(updated);
      set({ tasks: updated });
      playTickSound();

      if (allDone) {
        toast.info('Semua sub-tugas selesai! Tandai seluruh tugas selesai?', {
          action: {
            label: 'Selesaikan Tugas',
            onClick: () => get().toggleTaskStatus(taskId),
          },
          duration: 5000,
        });
      }
    },

    addSubtask: (taskId, title) => {
      if (!title.trim()) return;
      const updated = get().tasks.map((task) => {
        if (task.id === taskId) {
          const newSub: Task['subtasks'][number] = {
            id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            title: title.trim(),
            isDone: false,
          };
          return {
            ...task,
            subtasks: [...task.subtasks, newSub],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      saveTasksToStorage(updated);
      set({ tasks: updated });
      playTickSound();
    },

    deleteSubtask: (taskId, subtaskId) => {
      const updated = get().tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      saveTasksToStorage(updated);
      set({ tasks: updated });
    },

    snoozeReminder: (taskId, minutes) => {
      const snoozeTarget = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      const updated = get().tasks.map((task) => {
        if (task.id === taskId && task.reminder) {
          return {
            ...task,
            reminder: {
              ...task.reminder,
              isSnoozed: true,
              isTriggered: false,
              snoozedUntil: snoozeTarget,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });

      saveTasksToStorage(updated);
      set({ tasks: updated });
      toast.success(`Pengingat ditunda ${minutes} menit.`);
    },

    dismissReminder: (taskId) => {
      const updated = get().tasks.map((task) => {
        if (task.id === taskId && task.reminder) {
          return {
            ...task,
            reminder: {
              ...task.reminder,
              isTriggered: true,
              isSnoozed: false,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      saveTasksToStorage(updated);
      set({ tasks: updated });
    },

    setActiveDrawerId: (id) => {
      set({ activeDrawerId: id });
      playTickSound();
    },

    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilterPriority: (priority) => set({ filterPriority: priority }),
    setFilterCategory: (categoryId) => set({ filterCategory: categoryId }),

    addCategory: (name, colorName, hex) => {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        colorName,
        hex,
      };
      const updated = [...get().categories, newCat];
      saveCategoriesToStorage(updated);
      set({ categories: updated });
      toast.success(`Kategori "${name}" ditambahkan.`);
    },

    exportTasks: () => {
      const data = {
        app: 'TugasKu',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        categories: get().categories,
        tasks: get().tasks,
      };
      return JSON.stringify(data, null, 2);
    },

    importTasks: (jsonStr) => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed.tasks)) {
          saveTasksToStorage(parsed.tasks);
          if (Array.isArray(parsed.categories)) {
            saveCategoriesToStorage(parsed.categories);
            set({ categories: parsed.categories });
          }
          set({ tasks: parsed.tasks });
          toast.success('Data arsip berhasil diimpor!');
          return true;
        }
        toast.error('Format berkas arsip tidak valid.');
        return false;
      } catch {
        toast.error('Gagal membaca berkas JSON.');
        return false;
      }
    },
  };
});

// Setup reminder checker
if (typeof window !== 'undefined') {
  reminderService.startChecking(
    () => useTaskStore.getState().tasks,
    (task) => {
      useTaskStore.getState().updateTask(task.id, {
        reminder: task.reminder ? { ...task.reminder, isTriggered: true } : undefined,
      });
    }
  );
}
