import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, Bell, Calendar, CheckSquare, MoreVertical, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Task, Category } from '../../types';
import { Checkbox } from '../ui/Checkbox';
import { formatDueLabel, getTaskRotation, cn } from '../../lib/utils';
import { useTaskStore } from '../../features/tasks/taskStore';

interface TaskNoteProps {
  task: Task;
  category?: Category;
  onEdit?: (task: Task) => void;
}

export const TaskNote: React.FC<TaskNoteProps> = ({ task, category, onEdit }) => {
  const navigate = useNavigate();
  const { toggleTaskStatus, deleteTask } = useTaskStore();
  const rotation = getTaskRotation(task.id);
  const isDone = task.status === 'selesai';
  const { label: dueLabel, isOverdue } = formatDueLabel(task.dueAt);

  // Background color based on priority as per design.md 5.2
  const bgStyle =
    task.priority === 'tinggi'
      ? 'bg-catatan text-arsip border-amber-400'
      : task.priority === 'sedang'
      ? 'bg-krem text-arsip border-orange-200'
      : 'bg-kertas text-arsip border-stone-300';

  const completedSubtasks = task.subtasks.filter((s) => s.isDone).length;
  const totalSubtasks = task.subtasks.length;

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on checkbox or dropdown, don't navigate
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('a')) {
      return;
    }
    navigate(`/tugas/${task.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotation,
      }}
      whileHover={{
        rotate: 0,
        y: -4,
        scale: 1.01,
        transition: { duration: 0.18 },
      }}
      className={cn(
        'group relative p-5 rounded-[2px] shadow-kertas border transition-shadow cursor-pointer select-none flex flex-col justify-between min-h-[160px]',
        bgStyle,
        isDone && 'opacity-70 grayscale-[0.3]'
      )}
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/tugas/${task.id}`);
      }}
    >
      {/* Paperclip visual if attachments exist */}
      {task.attachments && task.attachments.length > 0 && (
        <div
          className="absolute -top-3.5 right-6 w-5 h-8 pointer-events-none text-arsip/70 drop-shadow-sm rotate-6"
          title="Terdapat lampiran berkas"
        >
          <Paperclip className="w-6 h-6 stroke-[2.2]" />
        </div>
      )}

      {/* Top Header: Checkbox & Dropdown Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Checkbox
            checked={isDone}
            onCheckedChange={() => toggleTaskStatus(task.id)}
            aria-label={`Tandai "${task.title}" sebagai selesai`}
          />

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {task.reminder && (
              <span
                className="text-arsip/70"
                title={`Reminder aktif: ${task.reminder.remindAt}`}
              >
                <Bell className="w-3.5 h-3.5" />
              </span>
            )}

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="p-1 rounded hover:bg-black/10 text-arsip transition-colors cursor-pointer"
                  aria-label="Menu tindakan tugas"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[150px] bg-white rounded shadow-lg border border-black/10 p-1 z-50 font-mono text-xs text-arsip"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    onClick={() => navigate(`/tugas/${task.id}`)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/5 cursor-pointer outline-none"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Buka Detail</span>
                  </DropdownMenu.Item>

                  {onEdit && (
                    <DropdownMenu.Item
                      onClick={() => onEdit(task)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-black/5 cursor-pointer outline-none"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah Berkas</span>
                    </DropdownMenu.Item>
                  )}

                  <DropdownMenu.Separator className="h-px bg-black/10 my-1" />

                  <DropdownMenu.Item
                    onClick={() => deleteTask(task.id)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer outline-none font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Tugas</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Task Title in Serif with strike-through animation */}
        <h3
          className={cn(
            'font-serif text-lg leading-snug tracking-tight text-arsip font-medium transition-all duration-300',
            isDone && 'line-through text-black/45'
          )}
        >
          {task.title}
        </h3>

        {/* Short description preview */}
        {task.description && (
          <p className="mt-1 font-serif text-sm text-black/70 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom Metadata: Due date, Subtask count, Category Tag */}
      <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-black/75">
        <div className="flex items-center gap-3">
          {/* Due date indicator */}
          <span
            className={cn(
              'flex items-center gap-1',
              isOverdue && !isDone
                ? 'text-map-merah font-bold bg-red-100/80 px-1.5 py-0.5 rounded'
                : 'text-black/70'
            )}
            title={isOverdue ? 'Tugas terlambat!' : 'Tenggat waktu'}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{dueLabel}</span>
          </span>

          {/* Subtask count if any */}
          {totalSubtasks > 0 && (
            <span
              className="flex items-center gap-1 text-[11px] bg-black/5 px-1.5 py-0.5 rounded"
              title={`${completedSubtasks} dari ${totalSubtasks} sub-tugas selesai`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </span>
          )}
        </div>

        {/* Category tag */}
        {category && (
          <span
            className="text-[11px] px-2 py-0.5 rounded font-mono font-medium border"
            style={{
              backgroundColor: `${category.hex}15`,
              color: category.hex,
              borderColor: `${category.hex}40`,
            }}
          >
            {category.name}
          </span>
        )}
      </div>
    </motion.div>
  );
};
