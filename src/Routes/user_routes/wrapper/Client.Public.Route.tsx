import { useAppSelector } from "@/store/redux/Hook";
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";

function PublicRoute() {
  const userData = useAppSelector((state) => state.Auth.user);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  if (!userData) {
    return <Outlet />;
  }

  const authPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/otp",
    "/reset-password",
  ];

  if (authPages.includes(location.pathname)) {
    return <Navigate to={redirect || `/${userData.role}/`} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
