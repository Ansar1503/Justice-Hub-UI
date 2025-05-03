import { useAppSelector } from "@/store/redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

export default function LawyerProtected() {
  const userData = useAppSelector((state) => state.Auth.user);
  if (!userData) {
    return <Navigate to="/login" />;
  }
  switch (userData.role) {
    case "lawyer":
      return <Outlet />;
    case "client":
      return <Navigate to="/client/" />;
    case "admin":
      return <Navigate to="/admin/" />;
    default:
      return <Navigate to="/login" />;
  }
}
