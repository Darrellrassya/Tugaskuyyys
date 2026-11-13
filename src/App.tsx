import { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Toaster } from 'sonner';
import { TopBar } from './components/layout/TopBar';
import { HomePage } from './pages/HomePage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { CalendarPage } from './pages/CalendarPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { InAppReminderBanner } from './components/reminder/InAppReminderBanner';
import { TaskFormModal } from './components/task/TaskFormModal';

function AppContent() {
  const location = useLocation();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const isDetailPage = location.pathname.startsWith('/tugas/');

  return (
    <div className="min-h-screen flex flex-col font-serif selection:bg-map-kuning selection:text-black">
      {/* Hide TopBar on Task Detail Desk for immersive canvas feel */}
      {!isDetailPage && (
        <TopBar onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)} />
      )}

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tugas/:id" element={<TaskDetailPage />} />
          <Route path="/kalender" element={<CalendarPage />} />
          <Route path="/statistik" element={<StatsPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
        </Routes>
      </main>

      {/* In-app reminder popup notifications */}
      <InAppReminderBanner />

      {/* Sonner Toast Notifications (with undo support) */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          className:
            'font-mono text-xs border border-white/20 bg-arsip text-tinta shadow-xl rounded-[2px]',
        }}
      />

      {/* Global New Task Modal */}
      <TaskFormModal
        open={isNewTaskModalOpen}
        onOpenChange={setIsNewTaskModalOpen}
      />
    </div>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <AppContent />
      </HashRouter>
    </MotionConfig>
  );
}

export default App;
