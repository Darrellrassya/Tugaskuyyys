import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Task } from '../../types';
import { useTaskStore } from '../../features/tasks/taskStore';
import { Checkbox } from '../ui/Checkbox';

interface SubtaskBlueprintProps {
  task: Task;
}

export const SubtaskBlueprint: React.FC<SubtaskBlueprintProps> = ({ task }) => {
  const { toggleSubtask, addSubtask, deleteSubtask } = useTaskStore();
  const [newTitle, setNewTitle] = useState('');

  const completed = task.subtasks.filter((s) => s.isDone).length;
  const total = task.subtasks.length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addSubtask(task.id, newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="relative blueprint-grid text-white p-6 rounded-[2px] shadow-kertas border-2 border-blue-400/40 select-none overflow-hidden">
      {/* Header with blueprint badge */}
      <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded text-blue-200">
            CETAK BIRU SUB-TUGAS
          </span>
          <h4 className="font-display text-xl sm:text-2xl tracking-wide uppercase mt-1">
            DAFTAR SPESIFIKASI KERJA
          </h4>
        </div>
        <div className="text-right font-mono text-xs">
          <span className="text-blue-200">Progres: </span>
          <span className="font-bold text-map-kuning">
            {completed}/{total} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-blue-950/60 rounded-full mb-5 overflow-hidden border border-white/20">
        <div
          className="h-full bg-map-kuning transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Subtasks list */}
      <div className="space-y-2.5 mb-5 max-h-64 overflow-y-auto pr-1">
        {task.subtasks.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between gap-3 p-2.5 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-400/20 rounded-[2px] transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                checked={sub.isDone}
                onCheckedChange={() => toggleSubtask(task.id, sub.id)}
                size={22}
                className="border-white/60 bg-blue-950/80"
              />
              <span
                className={`font-serif text-base truncate ${
                  sub.isDone ? 'line-through text-white/50' : 'text-white'
                }`}
              >
                {sub.title}
              </span>
            </div>

            <button
              onClick={() => deleteSubtask(task.id, sub.id)}
              className="text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
              title="Hapus sub-tugas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {task.subtasks.length === 0 && (
          <div className="text-center py-6 font-serif italic text-blue-200 text-sm">
            Belum ada perincian sub-tugas. Tambahkan langkah pengerjaan di bawah.
          </div>
        )}
      </div>

      {/* Inline add form */}
      <form onSubmit={handleAdd} className="flex gap-2 pt-2 border-t border-white/20">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="+ Tambah butir spesifikasi baru..."
          className="flex-1 bg-blue-950/60 border border-blue-300/40 px-3 py-1.5 rounded-[2px] font-serif text-sm text-white placeholder:text-blue-300/50 focus:outline-none focus:border-map-kuning"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-[2px] disabled:opacity-40 transition-colors cursor-pointer"
        >
          + Tambah
        </button>
      </form>
    </div>
  );
};
