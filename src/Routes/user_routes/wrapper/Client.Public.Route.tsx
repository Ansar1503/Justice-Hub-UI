import { useAppSelector } from "@/store/redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  // console.log('pbulic client')
  const userData = useAppSelector((state) => state.Auth.user);
  if (!userData) {
    return <Outlet />;
  }

  switch (userData.role) {
    case "client":
      return <Navigate to="/client/" />;
    case "lawyer":
      return <Navigate to="/lawyer/" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

export default PublicRoute;
