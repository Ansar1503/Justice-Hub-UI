import { useAppSelector } from "@/store/redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

export function Protected() {
  console.log("Protected");
  const { user } = useAppSelector((state) => state.Auth);
  console.log("user", user);
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
