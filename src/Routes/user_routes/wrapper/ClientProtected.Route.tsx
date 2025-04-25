import { useAppSelector } from "@/Redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const userData = useAppSelector((state) => state.Auth.user);
  if (!userData) {
    return <Navigate to="/login" />;
  }
  switch (userData.role) {
    case "client":
      return <Outlet />;
    case "lawyer":
      return <Navigate to="/lawyer/" />;
    case "admin":
      return <Navigate to="/admin/" />;
    default:
      return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
