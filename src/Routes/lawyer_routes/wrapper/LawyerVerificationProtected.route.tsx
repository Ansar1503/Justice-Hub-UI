import { useAppSelector } from "@/store/redux/Hook";
import { Navigate, Outlet } from "react-router-dom";

export default function LawyerVerificationProtected() {
  const userData = useAppSelector((state) => state.Auth.user);

  if (
    userData &&
    (!userData.lawyer_verification_status ||
      userData.lawyer_verification_status !== "verified")
  ) {
    return <Navigate to="/lawyer/" replace />;
  }

  return <Outlet />;
}
