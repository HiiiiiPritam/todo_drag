import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import type { Team } from "../types/team";

import { toast } from "react-hot-toast";
import { createTeam,fetchGlobalData } from "../features/global/globalThunks";

const AllTeams = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.global.users);
  const teams = useAppSelector((state) => state.global.teams);
  const currentUser = useAppSelector((state) => state.auth.user);
  // console.log("teams:", teams);
  

  const [isModalOpen, setModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("#3b82f6");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !currentUser) return;

    const payload: Partial<Team> = {
      name: newTeamName,
      color: newTeamColor,
      members: [...selectedMembers, currentUser.id], 
    };

    try {
      await dispatch(createTeam(payload)).unwrap();
      await dispatch(fetchGlobalData()); // 🔁 Refetch all teams + users
      setModalOpen(false);
      setNewTeamName("");
      setNewTeamColor("#3b82f6");
      setSelectedMembers([]);
      toast.success("Team created successfully");
    } catch (err) {
      toast.error("Failed to create team");
    }
  };

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">👥 All Teams</h1>
          <p className="text-sm text-gray-500">Browse and manage your project teams</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          New Team
        </button>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Link
            to={`/teams/${team.id}`}
            key={team.id}
            className= {`rounded-xl border shadow-sm hover:shadow-md transition p-5 group flex flex-col justify-between  hover:transform hover:-translate-y-1 hover:scale-105`}
            style={{ backgroundColor: team.color || "#6b7280"}}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full border border-white bg-white"
          
              />
              <h2 className="text-lg font-semibold ">
                {team.name}
              </h2>
            </div>

            <div className="text-sm  mb-3">
              {team.members?.length || 0} member{team.members?.length !== 1 && "s"}
            </div>

            <div className="flex -space-x-2 overflow-hidden mt-auto">
              {team.members?.slice(0, 4).map((uid) => {
                const user = users.find((u) => u.id === uid);
                return (
                  <div
                    key={uid}
                    className="w-8 h-8 bg-blue-100 text-blue-700 font-semibold text-sm rounded-full border-2 border-white flex items-center justify-center"
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                );
              })}
              {team.members?.length > 4 && (
                <div className="w-8 h-8 bg-gray-200 text-gray-600 font-semibold text-sm rounded-full border-2 border-white flex items-center justify-center">
                  +{team.members.length - 4}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Create New Team
            </h2>

            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              className="w-full border px-3 py-2 rounded text-sm"
            />

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Team color:
              </label>
              <input
                type="color"
                value={newTeamColor}
                onChange={(e) => setNewTeamColor(e.target.value)}
                className="w-8 h-8 p-0 border rounded"
              />
            </div>


            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTeams;
