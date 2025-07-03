import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// 🔐 Initialize state from localStorage safely
let user: User | null = null;
let token: string | null = null;

if (typeof window !== "undefined") {
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser);
      if (parsedUser && parsedUser.id) {
        user = parsedUser;
      }
    }

    const rawToken = localStorage.getItem("token");
    if (rawToken && rawToken !== "undefined") {
      token = rawToken;
    }
  } catch (error) {
    console.warn("Invalid user in localStorage:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    user = null;
    token = null;
  }
}

const initialState: AuthState = {
  user,
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;

      if (user && token) {
        state.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        };
        state.token = token;
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", token);
      } else {
        console.error("Invalid login payload", action.payload);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
