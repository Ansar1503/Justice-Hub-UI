import { useAppSelector } from "@/store/redux/Hook";
// import { useFetchSlotSettings } from "@/store/tanstack/queries";
import { Navigate, Outlet } from "react-router-dom";

export default function LawyerProtected() {
  const userData = useAppSelector((state) => state.Auth.user);
  // const { data } = useFetchSlotSettings();
  // const settings = data?.data;

  if (!userData) {
    return <Navigate to="/login" />;
  }
  if (userData.is_blocked) return <Navigate to="/login" />;
  // if (settings &&Object.keys(settings).length > 0) {
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
  // } else {
  //   return <Navigate to="/lawyer/slot-setup/1" />;
  // }
}
