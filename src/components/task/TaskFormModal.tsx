import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bell, Calendar, Trash2, Tag, Flag, Paperclip, Repeat } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { PilButton } from '../ui/PilButton';
import { useTaskStore } from '../../features/tasks/taskStore';
import { Task, Priority, RecurrenceRule, ReminderOffset } from '../../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Judul tugas wajib diisi').max(120, 'Judul maksimal 120 karakter'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  priority: z.enum(['rendah', 'sedang', 'tinggi'] as const),
  dueAt: z.string().optional(),
  recurrenceRule: z.enum(['none', 'harian', 'mingguan', 'bulanan'] as const).optional(),
  enableReminder: z.boolean().default(false),
  reminderOffset: z.enum(['at_due', '10_min', '1_hour', '1_day', 'custom'] as const).default('1_hour'),
  customReminderTime: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onOpenChange,
  taskToEdit,
}) => {
  const { categories, addTask, updateTask } = useTaskStore();
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; isDone: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachments, setAttachments] = useState<Task['attachments']>([]);

  const defaultCategory = categories[0]?.id || 'cat-kuliah';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: defaultCategory,
      priority: 'sedang',
      dueAt: '',
      recurrenceRule: 'none',
      enableReminder: false,
      reminderOffset: '1_hour',
      customReminderTime: '',
    },
  });

  const watchEnableReminder = watch('enableReminder');
  const watchReminderOffset = watch('reminderOffset');
  const watchDueAt = watch('dueAt');

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        categoryId: taskToEdit.categoryId,
        priority: taskToEdit.priority,
        dueAt: taskToEdit.dueAt || '',
        recurrenceRule: taskToEdit.recurrenceRule || 'none',
        enableReminder: !!taskToEdit.reminder,
        reminderOffset: taskToEdit.reminder?.offset || '1_hour',
        customReminderTime: taskToEdit.reminder?.offset === 'custom' ? taskToEdit.reminder.remindAt : '',
      });
      setSubtasks(taskToEdit.subtasks || []);
      setAttachments(taskToEdit.attachments || []);
    } else {
      reset({
        title: '',
        description: '',
        categoryId: defaultCategory,
        priority: 'sedang',
        dueAt: '',
        recurrenceRule: 'none',
        enableReminder: false,
        reminderOffset: '1_hour',
        customReminderTime: '',
      });
      setSubtasks([]);
      setAttachments([]);
    }
  }, [taskToEdit, open, reset, defaultCategory]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        title: newSubtaskTitle.trim(),
        isDone: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddAttachment = () => {
    if (!attachmentTitle.trim()) return;
    const url = attachmentUrl.trim() || '#';
    const isPdf = url.toLowerCase().endsWith('.pdf') || attachmentTitle.toLowerCase().includes('pdf');
    setAttachments((prev) => [
      ...(prev || []),
      {
        id: `att-${Date.now()}`,
        title: attachmentTitle.trim(),
        url,
        type: isPdf ? 'pdf' : url.startsWith('http') ? 'link' : 'doc',
      },
    ]);
    setAttachmentTitle('');
    setAttachmentUrl('');
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => (prev || []).filter((a) => a.id !== id));
  };

  const onSubmit = (data: TaskFormData) => {
    let reminderData: Task['reminder'] = undefined;

    if (data.enableReminder) {
      let remindAt = data.dueAt;
      if (data.reminderOffset === 'custom' && data.customReminderTime) {
        remindAt = data.customReminderTime;
      } else if (data.dueAt) {
        const dueDate = new Date(data.dueAt);
        if (data.reminderOffset === '10_min') {
          dueDate.setMinutes(dueDate.getMinutes() - 10);
        } else if (data.reminderOffset === '1_hour') {
          dueDate.setHours(dueDate.getHours() - 1);
        } else if (data.reminderOffset === '1_day') {
          dueDate.setDate(dueDate.getDate() - 1);
        }
        remindAt = dueDate.toISOString().slice(0, 16);
      }

      if (remindAt) {
        reminderData = {
          id: taskToEdit?.reminder?.id || `rem-${Date.now()}`,
          remindAt,
          offset: data.reminderOffset as ReminderOffset,
          isTriggered: false,
        };
      }
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priority: data.priority as Priority,
        dueAt: data.dueAt || undefined,
        recurrenceRule: (data.recurrenceRule as RecurrenceRule) || 'none',
        subtasks,
        attachments,
        reminder: reminderData,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priority: data.priority as Priority,
        dueAt: data.dueAt || undefined,
        recurrenceRule: (data.recurrenceRule as RecurrenceRule) || 'none',
        subtasks,
        attachments,
        reminder: reminderData,
      });
    }

    onOpenChange(false);
  };

  return (
    <Panel
      open={open}
      onOpenChange={onOpenChange}
      title={taskToEdit ? 'Ubah Berkas Tugas' : 'Catat Tugas Baru'}
      description="Form arsip lengkap untuk tugas, tenggat, pengingat, dan sub-tugas."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-mono text-xs font-bold text-arsip uppercase tracking-wider mb-1">
            Judul Tugas <span className="text-map-merah">*</span>
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="Misal: Selesaikan Bab 3 Skripsi..."
            className="w-full bg-white border-2 border-arsip/20 focus:border-arsip px-3.5 py-2.5 rounded-[2px] font-serif text-lg text-arsip placeholder:text-black/40 focus:outline-none transition-colors"
          />
          {errors.title && (
            <p className="mt-1 font-mono text-xs text-map-merah">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-mono text-xs font-bold text-arsip uppercase tracking-wider mb-1">
            Catatan / Deskripsi Tambahan
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Rincian catatan, instruksi, atau referensi penting..."
            className="w-full bg-white border-2 border-arsip/20 focus:border-arsip px-3.5 py-2 rounded-[2px] font-serif text-base text-arsip placeholder:text-black/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold text-arsip uppercase tracking-wider mb-1">
              <Tag className="w-3.5 h-3.5 inline mr-1" />
              Kategori Arsip
            </label>
            <select
              {...register('categoryId')}
              className="w-full bg-white border-2 border-arsip/20 focus:border-arsip px-3 py-2 rounded-[2px] font-mono text-xs text-arsip focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-arsip uppercase tracking-wider mb-1">
              <Flag className="w-3.5 h-3.5 inline mr-1" />
              Tingkat Prioritas
            </label>
            <select
              {...register('priority')}
              className="w-full bg-white border-2 border-arsip/20 focus:border-arsip px-3 py-2 rounded-[2px] font-mono text-xs text-arsip focus:outline-none"
            >
              <option value="rendah">Rendah (Kertas)</option>
              <option value="sedang">Sedang (Krem)</option>
              <option value="tinggi">Tinggi (Catatan Kuning)</option>
            </select>
          </div>
        </div>

        {/* Due Date & Recurrence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold text-arsip uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              Tenggat Waktu
            </label>
            <input
              type="datetime-local"
              {...register('dueAt')}
              className="w-full bg-white border-2 border-arsip/20 focus:border-arsip px-3 py-2 rounded-[2px] font-mono text-xs text-arsip focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-arsip uppercase tracking-wider mb-1">
              <Repeat className="w-3.5 h-3.5 inline mr-1" />
              Tugas Berulang
            </label>
            <select
              {...register('recurrenceRule')}
              className="w-full bg-white border-2 border-arsip/20 focus:border-arsip px-3 py-2 rounded-[2px] font-mono text-xs text-arsip focus:outline-none"
            >
              <option value="none">Tidak berulang</option>
              <option value="harian">Harian</option>
              <option value="mingguan">Mingguan</option>
              <option value="bulanan">Bulanan</option>
            </select>
          </div>
        </div>

        {/* Reminder Settings Box */}
        <div className="p-4 bg-black/5 rounded-[2px] border border-black/10">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-arsip cursor-pointer">
              <input
                type="checkbox"
                {...register('enableReminder')}
                className="w-4 h-4 accent-map-kuning rounded cursor-pointer"
              />
              <Bell className="w-4 h-4" />
              <span>Aktifkan Pengingat (Reminder)</span>
            </label>
          </div>

          {watchEnableReminder && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-black/10">
              <div>
                <label className="block font-mono text-[11px] text-black/70 mb-1">
                  Kapan diingatkan?
                </label>
                <select
                  {...register('reminderOffset')}
                  className="w-full bg-white border border-arsip/30 px-2.5 py-1.5 rounded font-mono text-xs text-arsip"
                >
                  <option value="at_due" disabled={!watchDueAt}>
                    Saat tenggat tiba
                  </option>
                  <option value="10_min" disabled={!watchDueAt}>
                    10 menit sebelum tenggat
                  </option>
                  <option value="1_hour" disabled={!watchDueAt}>
                    1 jam sebelum tenggat
                  </option>
                  <option value="1_day" disabled={!watchDueAt}>
                    1 hari sebelum tenggat
                  </option>
                  <option value="custom">Waktu kustom sendiri</option>
                </select>
              </div>

              {watchReminderOffset === 'custom' && (
                <div>
                  <label className="block font-mono text-[11px] text-black/70 mb-1">
                    Pilih Waktu Kustom
                  </label>
                  <input
                    type="datetime-local"
                    {...register('customReminderTime')}
                    className="w-full bg-white border border-arsip/30 px-2.5 py-1.5 rounded font-mono text-xs text-arsip"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subtasks Box */}
        <div className="p-4 bg-white rounded-[2px] border border-black/15">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-arsip mb-2">
            Sub-Tugas (Daftar Periksa)
          </h4>

          {subtasks.length > 0 && (
            <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-1.5 bg-black/5 rounded text-xs font-serif"
                >
                  <span className={st.isDone ? 'line-through text-black/40' : 'text-arsip'}>
                    {st.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-black/40 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="Tambah langkah sub-tugas..."
              className="flex-1 bg-black/5 border border-black/20 px-3 py-1.5 rounded font-serif text-sm focus:outline-none focus:border-arsip"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3 py-1.5 bg-black/10 hover:bg-black/20 text-arsip font-mono text-xs font-bold rounded cursor-pointer transition-colors"
            >
              + Tambah
            </button>
          </div>
        </div>

        {/* Attachments / References */}
        <div className="p-4 bg-white rounded-[2px] border border-black/15">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-arsip mb-2 flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" />
            <span>Lampiran & Tautan Referensi</span>
          </h4>

          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 px-2.5 py-1 bg-krem rounded border border-black/10 font-mono text-xs"
                >
                  <span className="font-semibold uppercase text-[10px] bg-black/10 px-1 rounded">
                    {att.type}
                  </span>
                  <span className="truncate max-w-[150px]">{att.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="text-black/40 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={attachmentTitle}
              onChange={(e) => setAttachmentTitle(e.target.value)}
              placeholder="Nama berkas / dokumen"
              className="bg-black/5 border border-black/20 px-2.5 py-1.5 rounded font-serif text-xs focus:outline-none"
            />
            <div className="flex gap-1.5">
              <input
                type="text"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="URL atau path berkas"
                className="flex-1 bg-black/5 border border-black/20 px-2.5 py-1.5 rounded font-mono text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-1.5 bg-black/10 hover:bg-black/20 text-arsip font-mono text-xs font-bold rounded cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-black/10 flex items-center justify-end gap-3">
          <PilButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </PilButton>
          <PilButton type="submit" variant="primary" size="md">
            {taskToEdit ? 'Simpan Perubahan' : 'Simpan Tugas ke Arsip'}
          </PilButton>
        </div>
      </form>
    </Panel>
  );
};
