import React from 'react';
import type { Task } from "../../types/task";

import { Dialog } from '@headlessui/react';
import { X, User, Flag, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

const priorityColors: Record<string, string> = {
  low: 'text-blue-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
  urgent: 'text-red-700 font-bold',
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <Dialog open={!!task} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
    
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40" aria-hidden="true" />

    <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md relative border-2 border-solid border-gray-200">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
        <X className="w-5 h-5" />
      </button>

      <Dialog.Title className="text-xl font-bold mb-4">{task.title}</Dialog.Title>
      <p>{task.description}</p>
      <br />

          <div className="space-y-2 text-sm text-gray-700">
            <p><Flag className="inline w-4 h-4 mr-1" /> <span className={priorityColors[task.priority]}>Priority: {task.priority}</span></p>
            <p><User className="inline w-4 h-4 mr-1" /> Assigned to: {task?.assignee?.name} ({task?.assignee?.type})</p>
            <p>Status: <strong>{task.status}</strong></p>
            {task.description && <p>Description: {task.description}</p>}
            {task.endDate && <p>Due: {format(new Date(task.endDate), 'MMM dd, yyyy')}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs rounded bg-gray-200 text-gray-700"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
