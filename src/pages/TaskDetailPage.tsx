import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../features/tasks/taskStore';
import { TaskDetailDesk } from '../components/task/TaskDetailDesk';
import { TaskFormModal } from '../components/task/TaskFormModal';
import { PilButton } from '../components/ui/PilButton';
import { Task } from '../types';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks } = useTaskStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const task = tasks.find((t) => t.id === id);

  const handleEditTask = (t: Task) => {
    setTaskToEdit(t);
    setIsEditModalOpen(true);
  };

  if (!task) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-4xl text-tinta mb-2">BERKAS TIDAK DITEMUKAN</h2>
        <p className="font-serif text-lg text-abu mb-6">
          Berkas tugas yang Anda cari mungkin telah dihapus atau dipindahkan dari arsip.
        </p>
        <PilButton variant="primary" size="md" onClick={() => navigate('/')}>
          Kembali ke Laci Berkas
        </PilButton>
      </div>
    );
  }

  return (
    <>
      <TaskDetailDesk task={task} onEditTask={handleEditTask} />
      <TaskFormModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        taskToEdit={taskToEdit}
      />
    </>
  );
};
