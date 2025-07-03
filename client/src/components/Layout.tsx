import { useLocation } from "react-router-dom";
import type { User } from "../types/user";
import Header from "./Header";
import Sidebar from "./SideBar";
import { Toaster } from "react-hot-toast";

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
const HIDE_LAYOUT_PATHS = ["/", "/login", "/register"];
const Layout = ({
  children,
  activeView,
  setActiveView,
  selectedTeam,
  setSelectedTeam,
  teams,
  currentUser,
}: LayoutProps) => {
  const location = useLocation();
  const hideLayout = HIDE_LAYOUT_PATHS.includes(location.pathname);

  if (hideLayout) {
    return <>
        <Toaster position="top-right" toastOptions={{ style: {
      zIndex: 9999, 
    },duration: 4000 }} 
    
    />
    {children}</>; // Just return the page directly (no sidebar/navbar)
  }
  return (
    <>
    <Toaster position="top-right" toastOptions={{ style: {
      zIndex: 9999, 
    },duration: 4000 }} 
    
    />
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
    </>
    
  );
};

export default Layout;
