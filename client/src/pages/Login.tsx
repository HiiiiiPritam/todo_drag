import { useState } from "react";
import { useAppDispatch } from "../hooks/useStore";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
      console.log(res.data);
      
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 space-y-6 border border-gray-200">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back 👋</h1>
          <p className="text-sm text-gray-500">Please log in to access your workspace</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-150"
          >
            Login
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
