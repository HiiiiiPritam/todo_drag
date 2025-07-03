import { useState } from "react";
import {
  Home,
  FolderOpen,
  BarChart3,
  MessageSquare,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Globe,
  User,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { closeSidebar } from "../features/layout/layoutSlice";
import { useNavigate } from "react-router-dom";


interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  selectedTeam: string;
  setSelectedTeam: (id: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: FolderOpen },
  { id: "timeline", label: "Timeline", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  {id:"me", label: "Me", icon:User},
  {id:"teams", label: "Teams", icon:Globe},
];

const Sidebar = ({
  activeView,
  setActiveView,
  selectedTeam,
  setSelectedTeam,
}: SidebarProps) => {
  const [teamsOpen, setTeamsOpen] = useState(true);
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.layout.isSidebarOpen);
  const navigation = useNavigate();

  return (
    <>
      {/* ✅ BACKDROP (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}

      {/* ✅ SIDEBAR CONTAINER */}
      <div
        className={clsx(
          "fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:block"
        )}
      >
        <div className="p-6">
          {/* ❌ Mobile Close Button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => dispatch(closeSidebar())}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* ✅ Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TF</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TeamFlow</h1>
          </div>

          {/* ✅ Navigation */}
          <nav className="space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  //chnage the url accoring to the active view
                  navigation(`/${id}`);
                  setActiveView(id);
                  dispatch(closeSidebar()); 
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors",
                  activeView === id
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
