// src/features/global/globalThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/axios"; // your configured axios instance
import type { Team } from "../../types/team";
import { setTasks, setUsers, setTeams } from "./globalSlice";

// ✅ Create a new team
export const createTeam = createAsyncThunk(
  "global/createTeam",
  async (payload: Partial<Team>, thunkAPI) => {
    const response = await api.post("/teams", payload);
    return response.data; // returns the created team
  }
);

// ✅ Fetch all essential data
export const fetchGlobalData = createAsyncThunk(
  "global/fetchGlobalData",
  async (_, thunkAPI) => {
    try {
      const [usersRes, teamsRes, tasksRes] = await Promise.all([
        api.get("/users"),
        api.get("/teams"),
        api.get("/tasks"),
      ]);

      thunkAPI.dispatch(setUsers(usersRes.data));
      thunkAPI.dispatch(setTeams(teamsRes.data));
      thunkAPI.dispatch(setTasks(tasksRes.data));
    } catch (err) {
      console.error("Failed to fetch global data", err);
      throw err;
    }
  }
);

// PATCH: Add user to team
export const addUserToTeam = createAsyncThunk(
  "global/addUserToTeam",
  async ({ teamId, userId }: { teamId: string; userId: string }, thunkAPI) => {
    const res = await api.post(`/teams/${teamId}/add-member`, { userId });
    await thunkAPI.dispatch(fetchGlobalData()); // refresh state
    return res.data;
  }
);

