import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ArrowLeft, 
  Paperclip, 
  ExternalLink, 
  Edit3, 
  Calendar, 
  Flag, 
  Tag, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task } from '../../types';
import { SubtaskBlueprint } from './SubtaskBlueprint';
import { ReminderPaper } from '../reminder/ReminderPaper';
import { Checkbox } from '../ui/Checkbox';
import { PilButton } from '../ui/PilButton';
import { useTaskStore } from '../../features/tasks/taskStore';
import { formatDueLabel } from '../../lib/utils';

interface TaskDetailDeskProps {
  task: Task;
  onEditTask: (task: Task) => void;
}

export const TaskDetailDesk: React.FC<TaskDetailDeskProps> = ({ task, onEditTask }) => {
  const navigate = useNavigate();
  const { tasks, categories, toggleTaskStatus } = useTaskStore();

  const category = categories.find((c) => c.id === task.categoryId);
  const isDone = task.status === 'selesai';
  const { label: dueLabel, isOverdue } = formatDueLabel(task.dueAt);

  // Background color follows category or drawer
  const deskBg = category?.hex || '#141414';

  // Find next task in queue
  const currentCategoryTasks = useMemo(() => {
    return tasks.filter((t) => t.status !== 'selesai');
  }, [tasks]);

  const currentIndex = currentCategoryTasks.findIndex((t) => t.id === task.id);
  const nextTask =
    currentIndex >= 0 && currentIndex < currentCategoryTasks.length - 1
      ? currentCategoryTasks[currentIndex + 1]
      : currentCategoryTasks.length > 0 && currentCategoryTasks[0].id !== task.id
      ? currentCategoryTasks[0]
      : null;

  const nextCategory = nextTask ? categories.find((c) => c.id === nextTask.categoryId) : null;

  return (
    <div
      className="min-h-screen text-tinta transition-colors duration-500 relative flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-x-hidden selection:bg-map-kuning selection:text-black"
      style={{ backgroundColor: deskBg }}
    >
      {/* Top Desk Navigation Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-white/20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-mono text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE LACI ARSIP</span>
        </button>

        <div className="hidden sm:block font-mono text-xs uppercase tracking-widest text-white/70">
          BERKAS: {task.id} · {category?.name || 'UMUM'}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/20"
          aria-label="Tutup berkas"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Desk Collage Canvas */}
      <div className="max-w-6xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Sticky Note & Attachments) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Yellow Sticky Note (Catatan Tempel) */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 0.35 }}
            className="relative bg-catatan text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border-2 border-amber-400 select-none"
          >
            {/* Top Tape Graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-white/40 border border-white/60 shadow-xs rotate-[-0.5deg]" />

            <div className="flex items-start justify-between gap-4 mb-4 pt-1">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isDone}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                  size={30}
                  className="border-black/60 bg-white/60"
                  aria-label="Tandai selesai"
                />
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-black/60">
                  {isDone ? 'STATUS: SELESAI' : 'STATUS: DALAM PROSES'}
                </span>
              </div>

              <button
                onClick={() => onEditTask(task)}
                className="flex items-center gap-1.5 px-3 py-1 bg-black/10 hover:bg-black/20 text-arsip font-mono text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah</span>
              </button>
            </div>

            {/* Task Title in Anton Display font */}
            <h1
              className={`font-display text-3xl sm:text-5xl uppercase tracking-tight leading-none text-black my-4 ${
                isDone ? 'line-through text-black/40' : ''
              }`}
            >
              {task.title}
            </h1>

            {/* Description in Serif */}
            {task.description ? (
              <p className="font-serif text-lg text-black/85 leading-relaxed my-4 whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="font-serif italic text-black/50 my-3">
                Tidak ada deskripsi tambahan pada berkas ini.
              </p>
            )}

            {/* Sticky Note Metadata Footer */}
            <div className="mt-6 pt-4 border-t border-black/15 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-black/70">
              <div className="flex items-center gap-4">
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    isOverdue && !isDone ? 'text-map-merah' : ''
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dueLabel}</span>
                </span>

                <span className="flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" />
                  <span className="capitalize">Prioritas: {task.priority}</span>
                </span>
              </div>

              {category && (
                <span className="flex items-center gap-1 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{category.name}</span>
                </span>
              )}
            </div>
          </motion.div>

          {/* 2. Cream Cards (Kartu Dokumen & Lampiran) */}
          {task.attachments && task.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 1 }}
              transition={{ duration: 0.38, delay: 0.1 }}
              className="relative bg-krem text-arsip p-6 rounded-[2px] shadow-kertas border border-amber-200"
            >
              <div className="absolute -top-3.5 right-8 text-black/70 drop-shadow-sm rotate-12">
                <Paperclip className="w-7 h-7 stroke-[2]" />
              </div>

              <div className="flex items-center gap-2 mb-3 font-mono text-xs font-bold uppercase tracking-wider text-black/70">
                <span>BERKAS LAMPIRAN & REFERENSI</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {task.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-white/70 hover:bg-white rounded border border-black/10 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-black/10 rounded">
                        [{att.type.toUpperCase()}]
                      </span>
                      <span className="font-serif text-sm font-semibold truncate text-arsip">
                        {att.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-black/40 group-hover:text-black shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column (Blueprint Subtasks & Reminder Torn Paper) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3. Cetak Biru (Blueprint Subtasks) */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0.5 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <SubtaskBlueprint task={task} />
          </motion.div>

          {/* 4. Torn Paper Reminder (if reminder is set or can be added) */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.42, delay: 0.2 }}
          >
            {task.reminder ? (
              <ReminderPaper task={task} />
            ) : (
              <div className="bg-kertas-teal/90 text-arsip p-5 rounded-[2px] torn-paper-edge border border-teal-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                    <Clock className="w-4 h-4" />
                    <span>Belum Ada Pengingat</span>
                  </div>
                  <button
                    onClick={() => onEditTask(task)}
                    className="px-3 py-1 bg-black/15 hover:bg-black/25 font-mono text-xs rounded font-semibold cursor-pointer"
                  >
                    + Atur Reminder
                  </button>
                </div>
                <p className="mt-2 font-serif text-sm text-teal-950">
                  Tambahkan jadwal pengingat agar Anda diingatkan sebelum tenggat tiba.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Floating Bottom Right: Yellow Pill Button "Berikutnya" (Next) + Preview Card */}
      {nextTask && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Next Task Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col p-3 rounded bg-black/75 backdrop-blur-md text-white border border-white/20 max-w-[220px] text-left cursor-pointer hover:bg-black/90 transition-colors shadow-lg"
            onClick={() => navigate(`/tugas/${nextTask.id}`)}
          >
            <span className="font-mono text-[10px] text-map-kuning uppercase tracking-wider font-semibold">
              BERKAS BERIKUTNYA
            </span>
            <span className="font-serif text-sm font-semibold truncate text-white mt-0.5">
              {nextTask.title}
            </span>
            <span className="font-mono text-[10px] text-white/60">
              {nextCategory?.name || 'Laci'}
            </span>
          </motion.div>

          {/* Yellow Pill Button Next */}
          <PilButton
            variant="next"
            size="md"
            onClick={() => navigate(`/tugas/${nextTask.id}`)}
            className="gap-2 shadow-2xl"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </PilButton>
        </div>
      )}
    </div>
  );
};
