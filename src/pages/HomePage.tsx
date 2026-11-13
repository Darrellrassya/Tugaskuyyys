import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../features/tasks/taskStore';
import { DrawerStack } from '../components/folder/DrawerStack';
import { TaskFormModal } from '../components/task/TaskFormModal';
import { Task } from '../types';
import { formatDayHeader } from '../lib/utils';
import { isToday, isPast, parseISO, isValid } from 'date-fns';
import { Filter, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { tasks, categories, filterPriority, setFilterPriority, filterCategory, setFilterCategory } =
    useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Keyboard shortcut: Press "N" anywhere to open new task modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setTaskToEdit(null);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute summary for header
  const todayCount = tasks.filter((t) => {
    if (t.status === 'selesai' || !t.dueAt) return false;
    const d = parseISO(t.dueAt);
    return isValid(d) && isToday(d);
  }).length;

  const overdueCount = tasks.filter((t) => {
    if (t.status === 'selesai' || !t.dueAt) return false;
    const d = parseISO(t.dueAt);
    return isValid(d) && isPast(d) && !isToday(d);
  }).length;

  const completedCount = tasks.filter((t) => t.status === 'selesai').length;

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tinta/5 border border-tinta/10 font-mono text-xs text-abu uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-map-kuning" />
          <span>ARSIP HARIAN TUGASKU</span>
        </div>

        {/* Big Anton Date Header */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-tinta uppercase leading-none select-none">
          {formatDayHeader()}
        </h1>

        {/* Subtitle in Serif */}
        <p className="mt-3 font-serif text-lg sm:text-xl text-abu max-w-xl mx-auto">
          <span className="text-white font-medium">{todayCount} tugas hari ini</span>
          {overdueCount > 0 && (
            <span className="text-red-400 font-semibold"> · {overdueCount} terlambat</span>
          )}
          <span> · {completedCount} selesai</span>
        </p>

        {/* Quick Filter Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1 text-abu mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          {/* Priority filter */}
          {(['all', 'tinggi', 'sedang', 'rendah'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                filterPriority === p
                  ? 'bg-map-kuning text-arsip font-bold border-yellow-400'
                  : 'bg-tinta/5 text-abu border-tinta/10 hover:border-tinta/30 hover:text-tinta'
              }`}
            >
              {p === 'all' ? 'Semua Prioritas' : `Prioritas ${p.toUpperCase()}`}
            </button>
          ))}

          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-tinta/5 text-abu border border-tinta/10 hover:border-tinta/30 px-3 py-1 rounded-full font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-arsip text-tinta">
                Semua Kategori
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-arsip text-tinta">
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Accordion Folder Drawer Stack */}
      <DrawerStack onEditTask={handleEditTask} />

      {/* Task Modal (Create & Edit) */}
      <TaskFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
