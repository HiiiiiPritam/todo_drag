import React, { useMemo } from "react";
import {
  Plus,
  Clock,
  AlertCircle,
  Calendar,
  ListChecks,
  Flag,
  CheckCircle,
} from "lucide-react";
import { format, addDays, isAfter, isToday } from "date-fns";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAppSelector } from "../hooks/useStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const tasks = useAppSelector((state) => state.global.tasks);
  const teams = useAppSelector((state) => state.global.teams);

  if (!user) return <div>Loading user...</div>;

  // --- Stats ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  // treat any task with tag "bug" as an "issue"
  const pendingIssues = tasks.filter((t) => t.tags.includes("bug")).length;
  const activeTeams = teams.length;

  const stats = [
    {
      name: "Total Tasks",
      value: totalTasks,
      change: "+8.3%",
      changeType: "positive",
      icon: ListChecks,
    },
    {
      name: "Completed Tasks",
      value: completedTasks,
      change: "+5.7%",
      changeType: "positive",
      icon: CheckCircle,
    },
    {
      name: "Pending Issues",
      value: pendingIssues,
      change: "-2.1%",
      changeType: "negative",
      icon: AlertCircle,
    },
    {
      name: "Active Teams",
      value: activeTeams,
      change: "+1",
      changeType: "positive",
      icon: Flag,
    },
  ];

  // --- Upcoming Tasks (due in next 3 days) ---
  const now = new Date();
  const threeDays = addDays(now, 3);
  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter(
          (t) =>
            t.endDate &&
            isAfter(new Date(t.endDate), now) &&
            isAfter(threeDays, new Date(t.endDate))
        )
        .slice(0, 5),
    [tasks]
  );

  // --- Recent Issues (tasks tagged “bug”), most recent 5
  const recentIssues = useMemo(
    () =>
      tasks
        .filter((t) => t.tags.includes("bug"))
        .slice(-5)
        .reverse(),
    [tasks]
  );

  // utility for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const comparisonData = useMemo(() => {
    return teams.map((team) => {
      const teamTasks = tasks.filter((t) => t.teamId === team.id);
      const completedCount = teamTasks.filter((t) => t.status === "done").length;
      return {
        name: team.name,
        Total: teamTasks.length,
        Completed: completedCount,
      };
    });
  }, [teams, tasks]);

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 ">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-br from-blue-50 via-white to-blue-100 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{user.name}</span>! Here's what's happening with your teams.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getPriorityColor(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                        {task.endDate && (
                          <span className="text-sm text-gray-500">
                            Due {format(new Date(task.endDate), "MMM dd")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
      </div>

      {/* Team Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Team Activity</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teams.map((team) => {
              const teamTasks = tasks.filter((t) => t.teamId === team.id);
              const done = teamTasks.filter((t) => t.status === "done").length;
              const rate = teamTasks.length > 0
                ? Math.round((done / teamTasks.length) * 100)
                : 0;

              return (
                <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <h3 className="font-medium text-gray-900">{team.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tasks</span>
                      <span className="font-medium">{done}/{teamTasks.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Members</span>
                      <span className="font-medium">{team.members.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Team Comparison Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">📊 Team Task Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Total" fill="#3b82f6" name="Total Tasks" />
            <Bar dataKey="Completed" fill="#10b981" name="Completed Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
