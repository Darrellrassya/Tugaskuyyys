import React from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import { Task } from '../../types';
import { formatDateTime, cn } from '../../lib/utils';
import { useTaskStore } from '../../features/tasks/taskStore';

interface ReminderPaperProps {
  task: Task;
  onSnooze?: (minutes: number) => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

export const ReminderPaper: React.FC<ReminderPaperProps> = ({
  task,
  onSnooze,
  onDismiss,
  className,
  compact = false,
}) => {
  const { snoozeReminder, dismissReminder, toggleTaskStatus } = useTaskStore();

  const handleSnooze = (minutes: number) => {
    if (onSnooze) {
      onSnooze(minutes);
    } else {
      snoozeReminder(task.id, minutes);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      dismissReminder(task.id);
    }
  };

  const handleComplete = () => {
    toggleTaskStatus(task.id);
    if (onDismiss) onDismiss();
  };

  const remindIso = task.reminder?.isSnoozed && task.reminder?.snoozedUntil
    ? task.reminder.snoozedUntil
    : task.reminder?.remindAt || task.dueAt;

  return (
    <div
      className={cn(
        'relative bg-kertas-teal text-arsip p-5 shadow-kertas torn-paper-edge border-b-2 border-teal-800/20 select-none transition-transform',
        compact ? 'p-3' : 'p-5',
        className
      )}
    >
      {/* Tape or pin visual at top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-white/40 border border-white/60 shadow-xs rotate-[-1deg]" />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal-950">
          <Bell className="w-4 h-4 text-teal-950 animate-bounce" />
          <span>Pengingat Tugas</span>
        </div>
        {task.reminder?.isSnoozed && (
          <span className="font-mono text-[10px] bg-teal-900/15 px-2 py-0.5 rounded-full font-semibold">
            Ditunda
          </span>
        )}
      </div>

      <div className="my-3">
        <h4 className="font-serif font-bold text-lg leading-snug text-black">
          {task.title}
        </h4>
        <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-teal-950/80">
          <Clock className="w-3.5 h-3.5" />
          <span>Waktu: {formatDateTime(remindIso)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 border-t border-teal-900/15 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="font-mono text-[11px] text-teal-950 font-medium mr-1">
            Tunda:
          </span>
          {[5, 10, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSnooze(mins)}
              className="px-2 py-0.5 bg-black/10 hover:bg-black/20 text-black font-mono text-xs rounded transition-colors cursor-pointer"
            >
              +{mins}m
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleComplete}
            className="flex items-center gap-1 px-2.5 py-1 bg-map-hijau text-white text-xs font-mono font-semibold rounded hover:brightness-110 transition-colors cursor-pointer"
            title="Tandai selesai sekarang"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-2 py-1 text-black/60 hover:text-black text-xs font-mono transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
