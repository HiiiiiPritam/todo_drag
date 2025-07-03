import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import TaskCard from "../components/ui/TaskCard";
import { addUserToTeam, fetchGlobalData } from "../features/global/globalThunks";
import { toast } from "react-hot-toast";

const TeamDetail = () => {
  const { teamId } = useParams();
  const dispatch = useAppDispatch();

  const teams = useAppSelector((state) => state.global.teams);
  const users = useAppSelector((state) => state.global.users);
  const tasks = useAppSelector((state) => state.global.tasks);

  const team = teams.find((t) => t.id === teamId);
  const [selectedUser, setSelectedUser] = useState("");

  if (!team) return <div className="p-6">Team not found</div>;
  console.log("team:", team);
  
  const teamTasks = tasks.filter((t) => t.teamId === team.id);
  console.log("users:", users);

  
  let teamMembers = users.filter((u) => team.members.includes(u.id));
  console.log("teamMembers:", teamMembers);
  

  const addUser = async () => {
    if (!selectedUser || team.members.includes(selectedUser)){
      toast.error("User already in team");
      return
    }
    try {
      await dispatch(addUserToTeam({ teamId: team.id, userId: selectedUser })).unwrap();
      await dispatch(fetchGlobalData()); // 🔁 REFRESH updated teams/users
      teamMembers = users.filter((u) => team.members.includes(u.id));
      toast.success("User added to team");
      setSelectedUser("");
    } catch (err) {
      toast.error("Failed to add user");
    }
  };

  const getPerformance = (uid: string) => {
    const userTasks = teamTasks.filter((t) => t.assignee?.id === uid);
    const done = userTasks.filter((t) => t.status === "done").length;
    return {
      total: userTasks.length,
      done,
      rate: userTasks.length > 0 ? Math.round((done / userTasks.length) * 100) : 0,
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: team.color }}
        />
        <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
      </div>

      {/* 👥 Members Section */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Team Members</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {teamMembers?.map((user) => {
            const { done, total, rate } = getPerformance(user.id);
            return (
              <div key={user.id} className="bg-blue-50 border px-3 py-2 rounded-lg text-sm shadow-sm">
                <div className="font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {done}/{total} completed ({rate}%)
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border px-3 py-2 text-sm rounded"
          >
            <option value="">Select user</option>
            {users
              .filter((u) => !team.members.includes(u.id))
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
          <button
            onClick={addUser}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* 📋 Team Tasks */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Team Tasks</h2>
        {teamTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks assigned to this team.</p>
        ) : (
          <ul className="space-y-2">
            {teamTasks.map((task) => (
              <li key={task.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <TaskCard task={task} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;
