import { Route, Routes } from "react-router-dom";
import LawyerProtected from "./wrapper/lawyer.protected.route";
import LawyerSchedulePage from "@/pages/lawyer/Schedule";
// import SlotAddModal from "@/components/Lawyer/Modals/slot-add-modal";
// import LawyerSlotProtectRoute from "./wrapper/lawyer.slot.protect.route";
import AppointmentsPage from "@/pages/lawyer/Appointments";
import SessionPage from "@/pages/lawyer/Sessions";
import VideoCall from "@/pages/lawyer/VideoCall";
import ReviewPage from "@/pages/lawyer/ReviewPage";
import WalletPage from "@/pages/lawyer/WalletPage";
import LawyerVerificationProtected from "./wrapper/LawyerVerificationProtected.route";
import CasesPage from "@/pages/lawyer/CasesPage";
import CaseDetailsPage from "@/pages/lawyer/CaseDetailsPage";
import LawyerProfilePage from "@/pages/lawyer/Dashboard";
import LawyerDashboard from "@/pages/lawyer/LawyerDashboard";
import ChatsPage from "@/pages/client/chats_page";

export default function LawyerRoutes() {
  return (
    <Routes>
      <Route element={<LawyerProtected />}>
        <Route index element={<LawyerProfilePage />} />
        <Route element={<LawyerVerificationProtected />}>
          <Route path="/schedule" element={<LawyerSchedulePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/sessions" element={<SessionPage />} />
          <Route path="/chats/:id?" element={<ChatsPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/session/join/:id" element={<VideoCall />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailsPage />} />
          <Route path="/dashboard" element={<LawyerDashboard />} />
        </Route>
      </Route>

      {/* <Route element={<LawyerSlotProtectRoute />}>
        <Route path="/slot-setup/:id" element={<SlotAddModal />} />
      </Route> */}
    </Routes>
  );
}
