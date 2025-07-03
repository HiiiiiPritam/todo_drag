import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";
import api from "../app/axios";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { format, isAfter, isToday, addDays, set } from "date-fns";
import { GripVertical, Plus, Calendar, User, AlertCircle, Trash2, Edit2 } from "lucide-react";
import type { Assignee, Priority, Status, Task } from "../types/task";
import { addTask, updateTaskStatus, updateTask, deleteTask,setTasks } from "../features/global/globalSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { fetchGlobalData } from "../features/global/globalThunks";


const columns = [
  { id: "todo", title: "To Do", color: "bg-blue-100", border: "border-blue-300" },
  { id: "inprogress", title: "In Progress", color: "bg-purple-100", border: "border-purple-300" },
  { id: "done", title: "Done", color: "bg-green-100", border: "border-green-300" },
];

export default function TasksPage() {
  const dispatch = useAppDispatch();

  // ✅ Redux state with null checks
  const tasks = useAppSelector((state) => state.global?.tasks || []);
  const currentUser = useAppSelector((state) => state.auth?.user);
  const teams = useAppSelector((state) => state.global?.teams || []);
  const users = useAppSelector((state) => state.global?.users || []);
  
  // ✅ Local UI state
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const initialTask={
    title: "",
    tags: [],
    status: "todo" as Status,
    priority: "medium" as Priority,
    startDate: new Date(),
    endDate: new Date(),
    teamId: teams[0]?.id || "global",
    assignee: undefined as Assignee | undefined,
    assignedBy: currentUser
      ? {
          id: currentUser.id,
          name: currentUser.name,
          type: "user" as 'user' | 'team',
          avatarUrl: currentUser.avatarUrl,
        }
      : undefined,
    description: "",
  }
  const [newTask, setNewTask] = useState<Omit<Task, "id">>(initialTask);

  const [dueFilter, setDueFilter] = useState(""); 

  const now = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(now.getDate() + 3);
  // ✅ Filtered view with proper error handling
  const filteredTasks = tasks.filter((task) => {
    // Add null checks for task properties
    if (!task || typeof task.title !== 'string') return false;
    
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesSearch = !search || task.title.toLowerCase().includes(search.toLowerCase());
    
    const isDueSoon =
    dueFilter !== "due-soon" ||
    (task.endDate && new Date(task.endDate) >= now && new Date(task.endDate) <= threeDaysLater);

    return matchesPriority && matchesStatus && matchesSearch && isDueSoon;
  });

  useEffect(() => {
    (async () => {
      const res = await api.get<Task[]>("/tasks");
      dispatch(setTasks(res.data));
    })();
  }, [dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  // ✅ Drag-and-drop status update with better error handling
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id.toString();
    const newStatus = over.id as Status;
    const task = tasks.find((t) => t.id === taskId);
    
    if (!task || task.status === newStatus) return;

    // Optimistically update UI first
    dispatch(updateTaskStatus({ taskId, status: newStatus }));

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status", err);
      // Revert the optimistic update on error
      dispatch(updateTaskStatus({ taskId, status: task.status }));
    }
  };

  // ✅ Add new task with better error handling
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      const res = await api.post("/tasks", newTask);
      
      const taskToAdd = {
        ...res.data,
        id: res.data.id.toString(),
        // Ensure dates are Date objects
        startDate: new Date(res.data.startDate || newTask.startDate),
        endDate: new Date(res.data.endDate || newTask.endDate),
        // Ensure tags is an array
        tags: Array.isArray(res.data.tags) ? res.data.tags : [],
      };
      
      dispatch(addTask(taskToAdd));
      
      // Reset form
      setShowModal(false);
      setNewTask({
        title: "",
        tags: [],
        status: "todo",
        priority: "medium",
        startDate: new Date(),
        endDate: new Date(),
        teamId: teams[0]?.id || "global",
        assignee: undefined,
        assignedBy: currentUser
          ? {
              id: currentUser.id,
              name: currentUser.name,
              type: "user",
              avatarUrl: currentUser.avatarUrl,
            }
          : undefined,
        description: "",
      });
    } catch (err) {
      console.error("Failed to add task", err);
      alert("Failed to create task. Please try again.");
    }
  };

    // Add or Edit
  const openNewModal = () => {
    setEditingTask(null);
    setNewTask({
      title: "", description: "", tags: [], status: "todo",
      priority: "medium", startDate: new Date(), endDate: new Date(),
      teamId: teams[0]?.id || "global",
      assignee: undefined,
      assignedBy: currentUser
        ? { id: currentUser.id, name: currentUser.name, type: "user" }
        : undefined,
    });
    setShowModal(true);
  };

  const openEditModal = (t: Task) => {
    setEditingTask(t);
    setNewTask({ ...t, startDate: new Date(t.startDate), endDate: new Date(t.endDate) });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingTask) {
      const res = await api.patch(`/tasks/${editingTask.id}`, newTask);
      dispatch(updateTask(res.data));
    } else {
      const res = await api.post("/tasks", newTask);
      dispatch(addTask(res.data));
    }
    fetchGlobalData()
    setEditingTask(null);
    setNewTask(initialTask);
    setShowModal(false);
  };

  // Delete
  const handleDelete = async (id: string) => {
    // alert("Delete this task?");
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    dispatch(deleteTask(id));
  };

  return (
    <div className="p-6 space-y-4 ">
      <div className="flex gap-4 items-center flex-wrap bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {columns.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={dueFilter}
          onChange={(e) => setDueFilter(e.target.value)}
        >
          <option value="">All Deadlines</option>
          <option value="due-soon">Due in 3 Days</option>
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white shadow transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      <DndContext 
        sensors={sensors}   
        onDragStart={handleDragStart}
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              activeId={activeId} 
              tasks={filteredTasks.filter((t) => t && t.status === col.id)}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndContext>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl border-2 border-solid border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">📝 Create New Task</h2>

            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTask.tags.join(', ')}
              onChange={(e) =>
                setNewTask({ 
                  ...newTask, 
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(t => t.length > 0)
                })
              }
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={newTask.startDate.toISOString().slice(0, 10)}
                onChange={(e) => setNewTask({ ...newTask, startDate: new Date(e.target.value) })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={newTask.endDate.toISOString().slice(0, 10)}
                onChange={(e) => setNewTask({ ...newTask, endDate: new Date(e.target.value) })}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <select
              value={newTask.teamId}
              onChange={(e) => setNewTask({ ...newTask, teamId: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <select
              value={newTask.assignee?.id || ""}
              onChange={(e) => {
                const user = users.find((u) => u.id === e.target.value);
                setNewTask({
                  ...newTask,
                  assignee: user ? {
                    id: user.id,
                    name: user.name,
                    type: 'user',
                  } : undefined,
                });
              }}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Assignee</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => 
                  {
                  setNewTask(initialTask);
                  setEditingTask(null)
                  setShowModal(false)}}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingTask ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Column({ column, tasks, activeId ,onEdit, onDelete}: { column: any; tasks: Task[], activeId: string|null , onEdit: (task: Task) => void, onDelete: (id: string) => void }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  
  return (
    <div
      ref={setNodeRef}
      className={clsx(`h-max border rounded-lg p-4 shadow-sm  ${column.color} space-y-4", column.border`)}
    
    >
      <h2 className="font-semibold text-gray-700 text-md mb-2">{column.title}</h2>
      <SortableContext items={tasks.map((t) => t.id.toString())} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} activeID={activeId} onClick={() => {}} />
        ))}
      </SortableContext>
    </div>
  );
}

export const TaskCard = ({ task, onClick, activeID, onEdit, onDelete }: { task: Task; onClick: () => void ; activeID: string|null, onEdit: (task: Task) => void, onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id.toString() });
  
  const isDragging = activeID === task.id;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-200 text-red-800';
      case 'high': return 'bg-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-200 text-yellow-800';
      case 'low': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-100';
    }
  };

  // Add null checks for dates
  const endDate = task.endDate ? new Date(task.endDate) : null;
  const isOverdue = endDate && isAfter(new Date(), endDate);
  const isDueSoon = endDate && !isOverdue && !isAfter(endDate, addDays(new Date(), 3));

  return (
    <div>
      <div className="flex items-center justify-end ">
        <button
          className="cursor-pointer bg-green-300 p-2 hover:bg-green-400 rounded-sm"
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent triggering parent onClick
            
            // alert("Edit this task?");
            onEdit(task);
          }}
        >
          <Edit2 size={16} />
        </button>
        <button
          className="cursor-pointer bg-red-300 p-2 rounded-sm hover:bg-red-400"
          onClick={(e) => {
            e.stopPropagation(); // ✅ Prevent triggering parent onClick
            onDelete(task.id.toString());
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer mb-1
        hover:shadow-md transition-all duration-200 group ${isDragging ? 'opacity-50 rotate-2' : ''}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {task.title}
          </h4>
          {(isOverdue || isDueSoon) && (
            <AlertCircle
              className={`w-4 h-4 flex-shrink-0 ml-2 ${
                isOverdue ? 'text-red-500' : 'text-yellow-500'
              }`}
            />
          )}
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        </div>

        {endDate && (
          <div
            className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{isToday(endDate) ? 'Today' : format(endDate, 'MMM dd')}</span>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{task.tags.length - 3}
              </span>
            )}
            <div className="flex w-full items-end justify-end">{task.assignee && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <User className="w-3  h-3" />
              <span>{task.assignee.name}</span>
            </div>
          )}</div>
          </div>
        )}
      </div>
      
    </div>
    </div>
    
  );
}