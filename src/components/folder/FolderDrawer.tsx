import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Category } from '../../types';
import { FolderTab } from './FolderTab';
import { TaskNote } from '../task/TaskNote';
import { QuickAdd } from '../task/QuickAdd';

interface FolderDrawerProps {
  id: string;
  name: string;
  colorHex: string;
  tasks: Task[];
  isOpen: boolean;
  onToggle: () => void;
  categories: Category[];
  emptyMessage?: string;
  badge?: string;
  defaultDueOffset?: 'hari-ini' | 'besok' | 'minggu-depan' | 'none';
  showQuickAdd?: boolean;
  onEditTask?: (task: Task) => void;
}

export const FolderDrawer: React.FC<FolderDrawerProps> = ({
  name,
  colorHex,
  tasks,
  isOpen,
  onToggle,
  categories,
  emptyMessage = 'Belum ada berkas di laci ini.',
  badge,
  defaultDueOffset = 'hari-ini',
  showQuickAdd = true,
  onEditTask,
}) => {
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={onToggle}
      className="relative mb-2 transition-all duration-300"
    >
      {/* Folder Tab Header */}
      <Collapsible.Trigger asChild>
        <div>
          <FolderTab
            name={name}
            count={tasks.length}
            colorHex={colorHex}
            isOpen={isOpen}
            onToggle={onToggle}
            badge={badge}
          />
        </div>
      </Collapsible.Trigger>

      {/* Expandable Drawer Content */}
      <Collapsible.Content asChild forceMount>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="drawer-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden shadow-2xl rounded-b-[4px]"
              style={{ backgroundColor: colorHex }}
            >
              <div className="p-4 sm:p-6 lg:p-8 pt-2">
                {/* Tasks Grid or Empty State */}
                {tasks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-3">
                    {tasks.map((task) => (
                      <TaskNote
                        key={task.id}
                        task={task}
                        category={getCategory(task.categoryId)}
                        onEdit={onEditTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-white/80 font-serif italic text-lg sm:text-xl">
                    <p>{emptyMessage}</p>
                    <p className="font-mono text-xs not-italic text-white/60 mt-2">
                      Gunakan baris di bawah atau tekan pintasan "N" untuk membuat tugas baru.
                    </p>
                  </div>
                )}

                {/* Quick Add Bar at the bottom of the open drawer */}
                {showQuickAdd && (
                  <QuickAdd
                    categoryId={categories[0]?.id}
                    defaultDueOffset={defaultDueOffset}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
