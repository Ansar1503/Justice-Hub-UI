import { lazy } from "react";
import LawyerDashboard from "@/pages/lawyer/Dashboard";
import { Route, Routes } from "react-router-dom";
import LawyerProtected from "./wrapper/lawyer.protected.route";
import LawyerSchedulePage from "@/pages/lawyer/Schedule";
import SlotAddModal from "@/components/Lawyer/Modals/slot-add-modal";
import LawyerSlotProtectRoute from "./wrapper/lawyer.slot.protect.route";
import AppointmentsPage from "@/pages/lawyer/Appointments";
import SessionPage from "@/pages/lawyer/Sessions";
const Chats_page = lazy(() => import("@/pages/client/chats_page"));
import VideoCall from "@/pages/lawyer/VideoCall";
import ReviewPage from "@/pages/lawyer/ReviewPage";
import WalletPage from "@/pages/lawyer/WalletPage";

export default function LawyerRoutes() {
  return (
    <Routes>
      <Route element={<LawyerProtected />}>
        <Route index element={<LawyerDashboard />} />
        <Route path="/schedule" element={<LawyerSchedulePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/sessions" element={<SessionPage />} />
        <Route path="/chats/:id?" element={<Chats_page />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/session/join/:id" element={<VideoCall />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Route>

      <Route element={<LawyerSlotProtectRoute />}>
        <Route path="/slot-setup/:id" element={<SlotAddModal />} />
      </Route>
    </Routes>
  );
}
