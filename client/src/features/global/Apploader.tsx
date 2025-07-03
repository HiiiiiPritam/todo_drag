import { useEffect } from "react";
import api from "../../app/axios"
// import { setUsers, setTeams, setTasks } from "../features/global/globalSlice";
import { useAppDispatch } from "../../hooks/useStore";
import { setUsers, setTeams, setTasks } from "./globalSlice";

const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [usersRes, teamsRes, tasksRes] = await Promise.all([
          api.get("/users"),
          api.get("/teams"),
          api.get("/tasks"),
        ]);
        dispatch(setUsers(usersRes.data));
        dispatch(setTeams(teamsRes.data));
        dispatch(setTasks(tasksRes.data));
        console.log("Data fetched successfully");
        
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };

    fetchGlobalData();
  }, []);

  return <>{children}</>;
};

export default AppLoader;
