import LawyerDashboard from "@/pages/lawyer/Dashboard";
import { Route, Routes } from "react-router-dom";
import LawyerProtected from "./wrapper/lawyer.protected.route";
import LawyerSchedulePage from "@/pages/lawyer/Schedule";
import SlotAddModal from "@/components/Lawyer/Modals/slot-add-modal";
import LawyerSlotProtectRoute from "./wrapper/lawyer.slot.protect.route";
import AppointmentsPage from "@/pages/client/AppointmentsPage";

export default function LawyerRoutes() {
  return (
    <Routes>
      <Route element={<LawyerProtected />}>
        <Route index element={<LawyerDashboard />} />
        <Route path="/schedule" element={<LawyerSchedulePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Route>
      <Route element={<LawyerSlotProtectRoute />}>
        <Route path="/slot-setup/:id" element={<SlotAddModal />} />
      </Route>
    </Routes>
  );
}
