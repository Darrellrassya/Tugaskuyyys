import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, isValid } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Flame, CheckCircle, Clock, Award } from 'lucide-react';
import { useTaskStore } from '../features/tasks/taskStore';
import { Task } from '../types';

export const StatsPage: React.FC = () => {
  const { tasks } = useTaskStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.status === 'selesai').length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Last 7 days chart data
  const chartData = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dayLabel = format(d, 'EEE', { locale: idLocale });

      // Completed on this day
      const completedOnDay = tasks.filter((t: Task) => {
        if (t.status !== 'selesai' || !t.completedAt) return false;
        const compDate = parseISO(t.completedAt);
        return isValid(compDate) && isSameDay(compDate, d);
      }).length;

      // Due on this day and not done
      const overdueOnDay = tasks.filter((t: Task) => {
        if (t.status === 'selesai' || !t.dueAt) return false;
        const dueDate = parseISO(t.dueAt);
        return isValid(dueDate) && isSameDay(dueDate, d);
      }).length;

      days.push({
        day: dayLabel.toUpperCase(),
        selesai: completedOnDay,
        aktif: overdueOnDay,
      });
    }

    return days;
  }, [tasks]);

  // Streak days (Monday to Sunday of current week)
  const currentWeekDays = useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Title */}
      <div className="mb-10 text-center sm:text-left">
        <span className="font-mono text-xs uppercase tracking-widest text-abu">
          EVALUASI PRODUKTIVITAS
        </span>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-tinta uppercase tracking-tight leading-none mt-1">
          MINGGU INI
        </h1>
        <p className="font-serif text-lg text-abu mt-2">
          Catatan penyelesaian berkas dan konsistensi harian Anda.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-kertas text-arsip p-5 rounded-[2px] shadow-kertas border-l-4 border-map-hijau">
          <div className="flex items-center justify-between font-mono text-xs text-black/60 uppercase">
            <span>Selesai Dikerjakan</span>
            <CheckCircle className="w-4 h-4 text-map-hijau" />
          </div>
          <div className="font-display text-4xl sm:text-5xl mt-2 text-black">
            {completedTasks}
          </div>
          <p className="font-serif text-xs text-black/60 mt-1">
            Dari total {totalTasks} berkas tercatat
          </p>
        </div>

        <div className="bg-kertas text-arsip p-5 rounded-[2px] shadow-kertas border-l-4 border-map-kuning">
          <div className="flex items-center justify-between font-mono text-xs text-black/60 uppercase">
            <span>Tingkat Kelulusan</span>
            <Award className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="font-display text-4xl sm:text-5xl mt-2 text-black">
            {completionRate}%
          </div>
          <p className="font-serif text-xs text-black/60 mt-1">
            Target PRD: &gt; 60% tepat waktu
          </p>
        </div>

        <div className="bg-kertas text-arsip p-5 rounded-[2px] shadow-kertas border-l-4 border-map-biru">
          <div className="flex items-center justify-between font-mono text-xs text-black/60 uppercase">
            <span>Dalam Antrean</span>
            <Clock className="w-4 h-4 text-map-biru" />
          </div>
          <div className="font-display text-4xl sm:text-5xl mt-2 text-black">
            {activeTasks}
          </div>
          <p className="font-serif text-xs text-black/60 mt-1">
            Tugas yang masih perlu dituntaskan
          </p>
        </div>

        <div className="bg-kertas text-arsip p-5 rounded-[2px] shadow-kertas border-l-4 border-map-merah">
          <div className="flex items-center justify-between font-mono text-xs text-black/60 uppercase">
            <span>Streak Mingguan</span>
            <Flame className="w-4 h-4 text-map-merah fill-map-merah" />
          </div>
          <div className="font-display text-4xl sm:text-5xl mt-2 text-black">
            {completedTasks > 0 ? `${Math.min(7, Math.max(1, completedTasks))} HARI` : '0 HARI'}
          </div>
          <p className="font-serif text-xs text-black/60 mt-1">
            Konsistensi produktivitas minggu ini
          </p>
        </div>
      </div>

      {/* Daily Streak Tabs (Senin - Minggu) */}
      <div className="mb-10 p-6 bg-tinta/5 rounded-[4px] border border-tinta/10">
        <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-tinta mb-4">
          TAB KONSISTENSI HARIAN
        </h3>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {currentWeekDays.map((day) => {
            const dayName = format(day, 'EEE', { locale: idLocale }).toUpperCase();
            const dayNumber = format(day, 'd');
            const hasCompleted = tasks.some((t: Task) => {
              if (t.status !== 'selesai' || !t.completedAt) return false;
              const d = parseISO(t.completedAt);
              return isValid(d) && isSameDay(d, day);
            });

            return (
              <div
                key={day.toISOString()}
                className={`p-3 rounded-t-[16px] text-center select-none border-b-2 transition-transform ${
                  hasCompleted
                    ? 'bg-map-hijau text-white border-green-300 shadow-md translate-y-[-2px]'
                    : 'bg-tinta/10 text-abu border-tinta/20'
                }`}
              >
                <div className="font-mono text-[10px] sm:text-xs font-semibold">{dayName}</div>
                <div className="font-display text-lg sm:text-2xl mt-1">{dayNumber}</div>
                <div className="font-mono text-[9px] mt-1">
                  {hasCompleted ? '✓ SELESAI' : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharts Bar Chart on Paper Surface */}
      <div className="bg-kertas text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border border-black/10">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-arsip uppercase tracking-tight">
              GRAFIK TUGAS 7 HARI TERAKHIR
            </h3>
            <p className="font-serif text-sm text-black/60">
              Perbandingan tugas selesai (hijau) versus tugas dalam proses (merah).
            </p>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#141414', fontFamily: 'JetBrains Mono', fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#141414', fontFamily: 'JetBrains Mono', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141414',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                  paddingTop: '10px',
                }}
              />
              <Bar dataKey="selesai" name="Selesai" fill="#00705A" radius={[2, 2, 0, 0]} />
              <Bar dataKey="aktif" name="Perlu Dikerjakan" fill="#E30000" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
