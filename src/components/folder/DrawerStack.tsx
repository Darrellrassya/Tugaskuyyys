import React, { useMemo } from 'react';
import { isToday, isPast, parseISO, isValid } from 'date-fns';
import { useTaskStore } from '../../features/tasks/taskStore';
import { FolderDrawer } from './FolderDrawer';
import { Task } from '../../types';

interface DrawerStackProps {
  onEditTask: (task: Task) => void;
}

export const DrawerStack: React.FC<DrawerStackProps> = ({ onEditTask }) => {
  const {
    tasks,
    categories,
    activeDrawerId,
    setActiveDrawerId,
    searchQuery,
    filterPriority,
    filterCategory,
  } = useTaskStore();

  // Filter tasks by search query, priority, and category filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        const matchesSubtask = task.subtasks.some((s) => s.title.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesSubtask) return false;
      }

      // 2. Priority Filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }

      // 3. Category Filter
      if (filterCategory !== 'all' && task.categoryId !== filterCategory) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, filterPriority, filterCategory]);

  // Group tasks for the standard drawers
  const { todayTasks, upcomingTasks, overdueTasks, completedTasks } = useMemo(() => {
    const today: Task[] = [];
    const upcoming: Task[] = [];
    const overdue: Task[] = [];
    const completed: Task[] = [];

    filteredTasks.forEach((task) => {
      if (task.status === 'selesai') {
        completed.push(task);
        return;
      }

      if (!task.dueAt) {
        // Without due date: group in upcoming
        upcoming.push(task);
        return;
      }

      const dueDate = parseISO(task.dueAt);
      if (!isValid(dueDate)) {
        upcoming.push(task);
        return;
      }

      if (isToday(dueDate)) {
        today.push(task);
      } else if (isPast(dueDate)) {
        overdue.push(task);
      } else {
        upcoming.push(task);
      }
    });

    return {
      todayTasks: today,
      upcomingTasks: upcoming,
      overdueTasks: overdue,
      completedTasks: completed,
    };
  }, [filteredTasks]);

  const toggleDrawer = (id: string) => {
    if (activeDrawerId === id) {
      // Clicking same drawer closes it or keeps it open
      setActiveDrawerId('');
    } else {
      setActiveDrawerId(id);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      {/* 1. Laci Hari Ini (Merah) */}
      <FolderDrawer
        id="hari-ini"
        name="Hari Ini"
        colorHex="#E30000"
        tasks={todayTasks}
        isOpen={activeDrawerId === 'hari-ini'}
        onToggle={() => toggleDrawer('hari-ini')}
        categories={categories}
        emptyMessage="Belum ada tugas hari ini. Tekan N untuk menambah tugas."
        defaultDueOffset="hari-ini"
        onEditTask={onEditTask}
      />

      {/* 2. Laci Terlambat (Merah Pekat / Peringatan) - ditampilkan jika ada tugas terlambat */}
      {overdueTasks.length > 0 && (
        <FolderDrawer
          id="terlambat"
          name="Terlambat"
          badge="Perlu Perhatian"
          colorHex="#A30000"
          tasks={overdueTasks}
          isOpen={activeDrawerId === 'terlambat'}
          onToggle={() => toggleDrawer('terlambat')}
          categories={categories}
          emptyMessage="Bagus! Tidak ada tugas yang terlambat."
          defaultDueOffset="hari-ini"
          onEditTask={onEditTask}
        />
      )}

      {/* 3. Laci Mendatang (Biru) */}
      <FolderDrawer
        id="mendatang"
        name="Mendatang"
        colorHex="#2A1FE0"
        tasks={upcomingTasks}
        isOpen={activeDrawerId === 'mendatang'}
        onToggle={() => toggleDrawer('mendatang')}
        categories={categories}
        emptyMessage="Belum ada jadwal tugas mendatang."
        defaultDueOffset="besok"
        onEditTask={onEditTask}
      />

      {/* 4. Laci Selesai (Hijau) */}
      <FolderDrawer
        id="selesai"
        name="Selesai"
        colorHex="#00705A"
        tasks={completedTasks}
        isOpen={activeDrawerId === 'selesai'}
        onToggle={() => toggleDrawer('selesai')}
        categories={categories}
        emptyMessage="Belum ada tugas yang selesai. Centang kotak untuk menyelesaikan."
        showQuickAdd={false}
        onEditTask={onEditTask}
      />

      {/* 5. Laci Kategori Pengguna */}
      {categories.map((cat) => {
        const catTasks = filteredTasks.filter(
          (t) => t.categoryId === cat.id && t.status !== 'selesai'
        );
        return (
          <FolderDrawer
            key={cat.id}
            id={cat.id}
            name={cat.name}
            colorHex={cat.hex}
            tasks={catTasks}
            isOpen={activeDrawerId === cat.id}
            onToggle={() => toggleDrawer(cat.id)}
            categories={categories}
            emptyMessage={`Belum ada tugas dalam kategori ${cat.name}.`}
            defaultDueOffset="none"
            onEditTask={onEditTask}
          />
        );
      })}
    </div>
  );
};
