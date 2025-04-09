import { useAppSelector } from "@/Redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
    console.log('client public route')
  const userData = useAppSelector((state) => state.Auth.user);
  return userData && userData?.role=="client" ? <Navigate to="/client/" /> : <Outlet />;
}

export default PublicRoute;
