import { Menu, Bell, Search } from "lucide-react";
import { toggleSidebar } from "../features/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { useEffect, useState, } from "react";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";


interface HeaderProps {
  activeView: string;
  selectedTeam: string;
  currentUser: User;
  teams: any[];
}


const Header = ({ activeView, selectedTeam, currentUser, teams }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
    if (!user) {
      return <div></div>; 
    }

    const navigate = useNavigate();
  return (
    <header className="bg-white border-b px-6 py-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-500 hover:text-gray-700 transition"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu size={22} />
        </button>

        <h2 className="text-2xl font-bold capitalize text-gray-900">
          {activeView.replace("-", " ")}
        </h2>

        {selectedTeam !== "all" && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
            <div
              className={`w-2 h-2 ${
                teams.find((t) => t.id === selectedTeam)?.color || "bg-gray-300"
              } rounded-full`}
            />
            <span className="text-gray-600">
              {teams.find((t) => t.id === selectedTeam)?.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
          />
        </div>

        <button onClick={()=> navigate("/me")} className="relative p-2 text-gray-500 hover:text-gray-700 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
            {user?.avatarUrl || user?.name.charAt(0).toUpperCase() || currentUser.avatarUrl}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.name || currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
