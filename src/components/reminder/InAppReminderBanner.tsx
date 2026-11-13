import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../../types';
import { reminderService } from '../../features/reminders/reminderService';
import { ReminderPaper } from './ReminderPaper';

export const InAppReminderBanner: React.FC = () => {
  const [activeReminders, setActiveReminders] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = reminderService.subscribe((task) => {
      setActiveReminders((prev) => {
        // Avoid duplicate in list
        if (prev.some((t) => t.id === task.id)) return prev;
        return [task, ...prev];
      });
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = (taskId: string) => {
    setActiveReminders((prev) => prev.filter((t) => t.id !== taskId));
  };

  if (activeReminders.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-auto">
      <AnimatePresence>
        {activeReminders.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              rotate: [0, -1.5, 1.5, -1, 1, 0],
            }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{
              duration: 0.45,
              rotate: { duration: 0.5, ease: 'easeInOut' },
            }}
          >
            <ReminderPaper
              task={task}
              onDismiss={() => handleDismiss(task.id)}
              onSnooze={() => handleDismiss(task.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
