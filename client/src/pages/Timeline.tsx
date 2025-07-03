import React, { useEffect, useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { Task } from "../types/task";
import { useAppSelector, useAppDispatch } from '../hooks/useStore';
import { setTasks } from '../features/global/globalSlice';
import api from '../app/axios';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

const TimelinePage = () => {
  const dispatch = useAppDispatch();
  const allTasks = useAppSelector(state => state.global.tasks);
  const teams = useAppSelector(state => state.global.teams);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await api.get('/tasks');
        const parsedTasks = res.data.map((t: any) => ({
          ...t,
          startDate: new Date(t.startDate),
          endDate: new Date(t.endDate),
        }));
        dispatch(setTasks(parsedTasks));
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    };

    if (!allTasks.length) loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return selectedTeam === 'all'
      ? allTasks
      : allTasks.filter(t => t.teamId === selectedTeam);
  }, [allTasks, selectedTeam]);

  const today = new Date().setHours(0, 0, 0, 0);
  const chartData = filteredTasks.map(task => {
    const start = task.startDate instanceof Date ? task.startDate : new Date(task.startDate);
    const end = task.endDate instanceof Date ? task.endDate : new Date(task.endDate);
    const offset = Math.floor((start.getTime() - today) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      name: task.title,
      offset,
      duration,
      task,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 bg-gradient-to-br from-blue-50 via-white to-blue-100 ">
            <CalendarDays className="w-7 h-7 text-blue-600" />
            Project Timeline
          </h1>

          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-6 rounded-lg shadow-xl">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="number" domain={['auto', 'auto']} />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                formatter={(_, __, props: any) => {
                  const task = props.payload.task as Task;
                  return [
                    `${formatDate(new Date(task.startDate))} to ${formatDate(new Date(task.endDate))}`
                  ];
                }}
              />
              <Bar dataKey="offset" stackId="a" fill="transparent" />
              <Bar dataKey="duration" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
