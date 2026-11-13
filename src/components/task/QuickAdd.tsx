import React, { useState } from 'react';
import { Plus, Calendar, Flag } from 'lucide-react';
import { useTaskStore } from '../../features/tasks/taskStore';
import { Priority } from '../../types';
import { cn } from '../../lib/utils';

interface QuickAddProps {
  categoryId?: string;
  defaultDueOffset?: 'hari-ini' | 'besok' | 'minggu-depan' | 'none';
}

export const QuickAdd: React.FC<QuickAddProps> = ({
  categoryId,
  defaultDueOffset = 'hari-ini',
}) => {
  const { addTask, categories } = useTaskStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('sedang');
  const [selectedDue, setSelectedDue] = useState<'hari-ini' | 'besok' | 'minggu-depan' | 'none'>(
    defaultDueOffset
  );

  const targetCategoryId = categoryId || (categories[0] ? categories[0].id : 'cat-kuliah');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let dueAt: string | undefined = undefined;
    const now = new Date();

    if (selectedDue === 'hari-ini') {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0);
      dueAt = d.toISOString().slice(0, 16);
    } else if (selectedDue === 'besok') {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);
      dueAt = d.toISOString().slice(0, 16);
    } else if (selectedDue === 'minggu-depan') {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 18, 0);
      dueAt = d.toISOString().slice(0, 16);
    }

    addTask({
      title: title.trim(),
      categoryId: targetCategoryId,
      priority,
      dueAt,
      // Default reminder 1 hour before due if dueAt set
      reminder: dueAt
        ? {
            id: `rem-${Date.now()}`,
            remindAt: new Date(new Date(dueAt).getTime() - 60 * 60 * 1000).toISOString().slice(0, 16),
            offset: '1_hour',
            isTriggered: false,
          }
        : undefined,
    });

    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 pt-4 border-t border-white/20 flex flex-col md:flex-row items-stretch md:items-center gap-3"
    >
      {/* Input row with white underline */}
      <div className="relative flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="+ Tulis tugas baru lalu tekan Enter... (kurang dari 10 detik)"
          className="w-full bg-transparent border-b-2 border-white/40 focus:border-map-kuning px-2 py-2 text-white placeholder:text-white/60 font-serif text-lg focus:outline-none transition-colors"
        />
      </div>

      {/* Quick controls */}
      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
        {/* Due options */}
        <div className="flex items-center bg-black/20 rounded p-0.5 border border-white/20">
          <Calendar className="w-3.5 h-3.5 text-white/70 ml-1.5 mr-1" />
          <button
            type="button"
            onClick={() => setSelectedDue('hari-ini')}
            className={cn(
              'px-2 py-1 rounded transition-colors text-white',
              selectedDue === 'hari-ini' ? 'bg-white/30 font-bold' : 'hover:bg-white/10'
            )}
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => setSelectedDue('besok')}
            className={cn(
              'px-2 py-1 rounded transition-colors text-white',
              selectedDue === 'besok' ? 'bg-white/30 font-bold' : 'hover:bg-white/10'
            )}
          >
            Besok
          </button>
          <button
            type="button"
            onClick={() => setSelectedDue('minggu-depan')}
            className={cn(
              'px-2 py-1 rounded transition-colors text-white',
              selectedDue === 'minggu-depan' ? 'bg-white/30 font-bold' : 'hover:bg-white/10'
            )}
          >
            +7 Hari
          </button>
        </div>

        {/* Priority cycle */}
        <button
          type="button"
          onClick={() => {
            const next: Priority =
              priority === 'rendah' ? 'sedang' : priority === 'sedang' ? 'tinggi' : 'rendah';
            setPriority(next);
          }}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1.5 rounded border border-white/20 transition-colors',
            priority === 'tinggi'
              ? 'bg-catatan text-arsip font-bold'
              : priority === 'sedang'
              ? 'bg-white/20 text-white'
              : 'bg-black/20 text-white/80'
          )}
          title="Ubah prioritas"
        >
          <Flag className="w-3 h-3" />
          <span className="capitalize">{priority}</span>
        </button>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-1.5 bg-map-kuning text-arsip font-bold rounded hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Simpan</span>
        </button>
      </div>
    </form>
  );
};
