import { createSlice,} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Task } from "../../types/task";
import type { User } from "../../types/user";
import type { Team } from "../../types/team";

interface GlobalState {
  users: User[];
  teams: Team[];
  tasks: Task[];
}

const initialState: GlobalState = {
  users: [],
  teams: [],
  tasks: [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: string; status: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) task.status = action.payload.status as any;
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const newTask = {
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description,
        tags: action.payload.tags,
        status: action.payload.status,
        priority: action.payload.priority,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        assignee: action.payload.assignee,
        assignedBy: action.payload.assignedBy,
        teamId: action.payload.teamId,
      }
      state.tasks.push(newTask);
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setUsers,
  setTeams,
  setTasks,
  updateTaskStatus,
  updateTask,
  addTask,
  deleteTask
} = globalSlice.actions;

export default globalSlice.reducer;
