import LawyerDashboard from "@/pages/lawyer/Dashboard";
import { Route, Routes } from "react-router-dom";
import LawyerProtected from "./wrapper/lawyer.protected.route";
import LawyerSchedulePage from "@/pages/lawyer/Schedule";
import SlotAddModal from "@/components/Lawyer/Modals/slot-add-modal";
import LawyerSlotProtectRoute from "./wrapper/lawyer.slot.protect.route";
import AppointmentsPage from "@/pages/lawyer/Appointments";
import SessionPage from "@/pages/lawyer/Sessions";
import ChatsPage from "@/pages/lawyer/ChatPage";
import VideoCall from "@/pages/lawyer/VideoCall";

export default function LawyerRoutes() {
  return (
    <Routes>
      <Route element={<LawyerProtected />}>
        <Route index element={<LawyerDashboard />} />
        <Route path="/schedule" element={<LawyerSchedulePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/sessions" element={<SessionPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/session/join" element={<VideoCall />} />
      </Route>
      <Route element={<LawyerSlotProtectRoute />}>
        <Route path="/slot-setup/:id" element={<SlotAddModal />} />
      </Route>
    </Routes>
  );
}
