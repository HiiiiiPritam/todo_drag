import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
// import Login from "../pages/Login";
// import TeamPage from "../pages/TeamPage";
import Tasks from "../pages/Tasks";
import Timeline from "../pages/Timeline";
import Analytics from "../pages/Analytics";
import Me from "../pages/Me";
import AllTeams from "../pages/Allteams";
import TeamDetail from "../pages/TeamDetails";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";

// import Pages from "../pages/Pages";
// import NotFound from "../pages/NotFound";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      {/* <Route path="/pages" element={<Pages />} /> */}
      <Route path="/me" element={<PrivateRoute><Me /></PrivateRoute>} />
      <Route path="/teams" element={<PrivateRoute><AllTeams /></PrivateRoute>} />
      <Route path="/teams/:teamId" element={<PrivateRoute><TeamDetail /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
      
    </Routes>
  );
};

export default AppRoutes;
