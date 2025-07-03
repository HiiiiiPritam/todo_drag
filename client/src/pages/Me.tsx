import { useState } from "react";
import { CheckCircle, Flag, User, Tag } from "lucide-react";
import { useAppSelector } from "../hooks/useStore";
import type { Task } from "../types/task";
import { TaskDetailModal } from "../components/ui/TaskModal";

const statusColorMap: Record<string, string> = {
  todo: "bg-yellow-100 text-yellow-800",
  inprogress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

const priorityColorMap: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const MePage = () => {
  const tasks = useAppSelector((state) => state.global.tasks);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<"assignedToMe" | "assignedByMe">("assignedToMe");

  if (!currentUser) return <p className="p-6 text-gray-500">User not logged in.</p>;

  const assigneeMe = tasks.filter((task) => task?.assignee?.id === currentUser.id);
  const assignedByMe = tasks.filter((task) => task?.assignedBy?.id === currentUser.id);

  const renderTask = (task: Task) => (
    <div
      key={task.id}
      onClick={() => setSelectedTask(task)}
      className="cursor-pointer border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColorMap[task.status]}`}
        >
          {task.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-red-400" />
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${priorityColorMap[task.priority]}`}
          >
            Priority: {task.priority}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>
            Assigned To: {task?.assignee?.name} ({task?.assignee?.type})
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("assignedToMe")}
          className={`py-2 px-4 border-b-2 text-sm font-medium ${
            activeTab === "assignedToMe"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📥 Assigned To Me
        </button>
        <button
          onClick={() => setActiveTab("assignedByMe")}
          className={`py-2 px-4 border-b-2 text-sm font-medium ${
            activeTab === "assignedByMe"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📤 Assigned By Me
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "assignedToMe" ? (
          assigneeMe.length > 0 ? (
            assigneeMe.map(renderTask)
          ) : (
            <p className="text-gray-500 col-span-full">No tasks assigned to you.</p>
          )
        ) : assignedByMe.length > 0 ? (
          assignedByMe.map(renderTask)
        ) : (
          <p className="text-gray-500 col-span-full">No tasks assigned by you.</p>
        )}
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default MePage;
