import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import {
  Users, CheckCircle,TrophyIcon,TreePalmIcon, ClipboardList, TrendingUp, Trophy
} from 'lucide-react';
import { useAppSelector } from '../hooks/useStore';


const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#a78bfa'];
const AnalyticsPage = () => {
  const tasks = useAppSelector(state => state.global.tasks);
  const users = useAppSelector(state => state.global.users);
  const teams = useAppSelector(state => state.global.teams);

  const userStats = users.map(user => {
    const assigned = tasks.filter(t => t.assignee?.id === user.id);
    const completed = assigned.filter(t => t.status === 'done');
    return {
      name: user.name,
      assignedTasks: assigned.length,
      completedTasks: completed.length,
    };
  });

  const teamStats = teams.map(team => {
    const taskCount = tasks.filter(t => t.teamId === team.id).length;
    return {
      name: team.name,
      taskCount,
    };
  });

  const completionRateData = userStats.map(u => ({
    name: u.name,
    rate: u.assignedTasks > 0 ? Math.round((u.completedTasks / u.assignedTasks) * 100) : 0,
  }));

  const totalTasks = tasks.length;
  const topPerformer = [...userStats].sort((a, b) => b.completedTasks - a.completedTasks)[0] || { name: '-', completedTasks: 0 };
  const avgCompletion =
    userStats.length > 0
      ? Math.round(userStats.reduce((sum, u) => sum + (u.assignedTasks ? (u.completedTasks / u.assignedTasks) * 100 : 0), 0) / userStats.length)
      : 0;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
        📊 Analytics Dashboard
      </h1>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryTile icon={<ClipboardList className="text-green-600" />} title="Total Tasks" value={totalTasks} gradient="from-green-100 to-green-300" />
        <SummaryTile icon={<Users className="text-yellow-600" />} title="Total Users" value={users.length} gradient="from-yellow-100 to-yellow-300" />
        <SummaryTile icon={<Trophy className="text-blue-600" />} title="Top Performer" value={topPerformer.name} gradient="from-blue-100 to-blue-300" />
        <SummaryTile icon={<TrendingUp className="text-red-600" />} title="Avg Completion %" value={`${avgCompletion}%`} gradient="from-red-100 to-red-300" />
      </div>

      {/* Leaderboard */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard - Top Task Closers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...userStats].sort((a, b) => b.completedTasks - a.completedTasks).map((user, i) => (
            <div key={user.name} className="p-4 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-300 shadow">
              <h3 className="text-lg font-bold text-gray-800">#{i + 1} {user.name}</h3>
              <p className="text-sm text-gray-700">✅ {user.completedTasks} / {user.assignedTasks} completed</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bar Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📦 Assigned vs Completed (User-wise)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="assignedTasks" fill="#a5b4fc" name="Assigned" />
            <Bar dataKey="completedTasks" fill="#4ade80" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Pie + Line Chart */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-xl font-semibold mb-4">👥 Task Distribution by Team</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={teamStats}
                dataKey="taskCount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {teamStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">📈 Completion Rate Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={completionRateData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#10b981" name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;

const SummaryTile = ({
  icon,
  title,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  gradient: string;
}) => (
  <div className={`bg-gradient-to-tr ${gradient} p-4 rounded-lg shadow flex items-center gap-4`}>
    <div className="p-2 bg-white rounded-full shadow">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-700">{title}</h4>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);