import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useStore";
import type { JSX } from "react";
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
