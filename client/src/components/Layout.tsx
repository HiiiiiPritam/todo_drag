import type { User } from "../types/user";
import Header from "./Header";
import Sidebar from "./SideBar";

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedTeam: string;
  setSelectedTeam: (id: string) => void;
  teams: any[];
  openCreateModal: (type: string) => void;
  currentUser: User;
}

const Layout = ({
  children,
  activeView,
  setActiveView,
  selectedTeam,
  setSelectedTeam,
  teams,
  currentUser,
}: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header
          activeView={activeView}
          selectedTeam={selectedTeam}
          teams={teams}
          currentUser={currentUser}
        />
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
