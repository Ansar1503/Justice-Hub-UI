import { useAppSelector } from "@/store/redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

export function Protected() {
  const { user } = useAppSelector((state) => state.Auth);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role === "admin") {
    return <Outlet />;
  } else if (user.role === "lawyer") {
    return <Navigate to="/lawyer/" />;
  } else if (user.role === "client") {
    return <Navigate to="/client/" />;
  } else {
    return <Navigate to="/login" />;
  }
}
