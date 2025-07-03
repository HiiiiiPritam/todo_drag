import { Calendar, Flag, User, Tag, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { JSX } from 'react';
import type { Task } from '../../types/task';
type TaskType = 'todo' | 'inprogress' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface TaskCardProps {
  task: Task;
}

const statusIconMap: Record<TaskType, JSX.Element> = {
  todo: <AlertCircle className="text-yellow-500 w-5 h-5" />,
  inprogress: <Loader2 className="text-blue-500 animate-spin w-5 h-5" />,
  done: <CheckCircle className="text-green-600 w-5 h-5" />,
};

const priorityColorMap: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div
      className={clsx(
        'rounded-lg shadow-md border-l-4 p-4 transition-all hover:shadow-lg bg-white space-y-2',
        {
          'border-blue-500': task.status === 'inprogress',
          'border-yellow-500': task.status === 'todo',
          'border-green-500': task.status === 'done',
        }
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {statusIconMap[task.status]}
          <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
        </div>
        <span
          className={clsx(
            'text-xs font-medium px-2 py-1 rounded-full',
            priorityColorMap[task.priority]
          )}
        >
          {task.priority.toUpperCase()}
        </span>
      </div>

      
      <p className="text-sm text-gray-700">{task.description}</p>

      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          Assigned to: <span className="font-medium">{task?.assignee?.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          Due: <span className={task.endDate < new Date() ? 'text-red-600 font-semibold' : ''}>
            {format(task.endDate, 'dd MMM yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-gray-500" />
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 px-2 py-1 text-xs rounded text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
