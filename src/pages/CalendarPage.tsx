import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  parseISO, 
  isValid 
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTaskStore } from '../features/tasks/taskStore';
import { Panel } from '../components/ui/Panel';
import { TaskNote } from '../components/task/TaskNote';
import { TaskFormModal } from '../components/task/TaskFormModal';
import { Task, Category } from '../types';
import { PilButton } from '../components/ui/PilButton';

export const CalendarPage: React.FC = () => {
  const { tasks, categories } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayPanelOpen, setIsDayPanelOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getCategory = (catId: string): Category | undefined => categories.find((c) => c.id === catId);

  // Group tasks by day
  const getTasksForDay = (day: Date): Task[] => {
    return tasks.filter((task) => {
      if (!task.dueAt) return false;
      const d = parseISO(task.dueAt);
      return isValid(d) && isSameDay(d, day);
    });
  };

  const selectedDayTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDayPanelOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsNewTaskModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-abu">
            JADWAL BULANAN
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-tinta uppercase tracking-tight">
            {format(currentMonth, 'MMMM yyyy', { locale: idLocale })}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 rounded-full border border-tinta/20 font-mono text-xs text-tinta hover:bg-tinta/10 transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
          <div className="flex items-center border border-tinta/20 rounded-full overflow-hidden">
            <button
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              className="p-2 text-tinta hover:bg-tinta/10 transition-colors cursor-pointer"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              className="p-2 text-tinta hover:bg-tinta/10 transition-colors cursor-pointer"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-px bg-tinta/10 border border-tinta/15 rounded-t-[4px] overflow-hidden">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((dayName) => (
          <div
            key={dayName}
            className="bg-arsip p-3 text-center font-mono text-xs text-abu uppercase tracking-wider font-semibold"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-tinta/10 border-x border-b border-tinta/15 rounded-b-[4px] overflow-hidden">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`min-h-[100px] sm:min-h-[120px] p-2 text-left flex flex-col justify-between transition-colors cursor-pointer relative group ${
                isCurrentMonth ? 'bg-arsip hover:bg-tinta/5' : 'bg-arsip/60 text-tinta/30 hover:bg-arsip'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                    isTodayDate
                      ? 'bg-map-merah text-white font-bold'
                      : isCurrentMonth
                      ? 'text-tinta'
                      : 'text-tinta/40'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {dayTasks.length > 0 && (
                  <span className="font-mono text-[10px] text-abu hidden sm:inline">
                    {dayTasks.length} berkas
                  </span>
                )}
              </div>

              {/* Dots and task titles preview */}
              <div className="mt-2 space-y-1 w-full">
                {dayTasks.slice(0, 3).map((task) => {
                  const cat = getCategory(task.categoryId);
                  const dotColor =
                    task.status === 'selesai'
                      ? '#00705A'
                      : cat?.hex || '#FFE600';
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-tinta/5 truncate font-serif text-[11px] text-tinta/90"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className={`truncate ${task.status === 'selesai' ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}

                {dayTasks.length > 3 && (
                  <div className="font-mono text-[10px] text-abu pl-1">
                    +{dayTasks.length - 3} lagi...
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Panel (Kertas Article Panel) */}
      <Panel
        open={isDayPanelOpen}
        onOpenChange={setIsDayPanelOpen}
        title={selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale }) : 'Jadwal Hari'}
        description={`${selectedDayTasks.length} berkas tugas terjadwal pada hari ini.`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 my-4">
          {selectedDayTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedDayTasks.map((task) => (
                <TaskNote
                  key={task.id}
                  task={task}
                  category={getCategory(task.categoryId)}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 font-serif italic text-black/60">
              Tidak ada tugas berjadwal pada tanggal ini.
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-black/10 flex justify-end">
          <PilButton
            variant="primary"
            size="sm"
            onClick={() => {
              setTaskToEdit(null);
              setIsNewTaskModalOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Tugas untuk Tanggal Ini</span>
          </PilButton>
        </div>
      </Panel>

      <TaskFormModal
        open={isNewTaskModalOpen}
        onOpenChange={setIsNewTaskModalOpen}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
