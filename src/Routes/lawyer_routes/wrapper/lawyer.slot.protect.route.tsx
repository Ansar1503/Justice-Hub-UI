import { useFetchSlotSettings } from "@/store/tanstack/queries";
import { Navigate, Outlet } from "react-router-dom";

export default function LawyerSlotProtectRoute() {
  const { data } = useFetchSlotSettings();
  const settings = data?.data;
  if (settings && Object.keys(settings).length > 0)
    return <Navigate to="/lawyer/" />;
  return <Outlet />;
}
