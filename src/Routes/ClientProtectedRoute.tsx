import { useAppSelector } from "@/Redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // console.log("client protectue route");
  const userData = useAppSelector((state) => state.Auth.user);
  return userData && userData?.role == "client" ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} />
  );
}

export default ProtectedRoute;
