import { useAppSelector } from "@/Redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  const userData = useAppSelector((state) => state.Auth.user);
  return userData && userData?.role=="client" ? <Navigate to="/client/" /> : <Outlet />;
}

export default PublicRoute;
