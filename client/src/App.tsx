import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/Layout";
import AppLoader from "./features/global/Apploader";
import type { User } from "./types/user";

// mock user & teams


function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const openCreateModal = (type: string) => {
    console.log("Open modal for:", type);
  };

  const mockUser : User = {
    name:"User",
    email:"a@b.com",
    avatarUrl:"U",
    id:"1"
  }
  const mockTeams = [
    { id: "1", name: "Frontend", color: "bg-blue-400", isGlobal: false },
    { id: "2", name: "Backend", color: "bg-green-400", isGlobal: false },
    { id: "0", name: "Global", color: "bg-gray-400", isGlobal: true },
  ];

  return (
    <AppLoader >
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      selectedTeam={selectedTeam}
      setSelectedTeam={setSelectedTeam}
      teams={mockTeams}
      openCreateModal={openCreateModal}
      currentUser={mockUser}
    >
      <AppRoutes />
    </Layout>
    </AppLoader>
  );
}

export default App;
