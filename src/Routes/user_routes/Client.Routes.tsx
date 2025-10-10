import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./wrapper/ClientProtected.Route";
import PaymentSuccessPage from "@/pages/client/payment_successpaeg";
import SessionPage from "@/pages/client/sessions";
import VideoCall from "@/pages/lawyer/VideoCall";
import ReviewPage from "@/pages/client/ReviewPage";
import WalletPage from "@/pages/client/WalletPage";
import CasesPage from "@/pages/client/CasesPage";
import CaseDetailsPage from "@/pages/client/CaseDetailsPage";
import ClientDashboard from "@/pages/client/Dashboard";
import AppointmentsPage from "@/pages/client/AppointmentsPage";
import ClientProfile from "@/pages/client/ClientProfile";
import LawyerDirectory from "@/pages/client/LawyersListing";
import LawyersPage from "@/pages/client/LawyerProfile";
import ChatsPage from "@/pages/client/chats_page";
function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<ClientProfile />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/sessions" element={<SessionPage />} />
        <Route path="/lawyers" element={<LawyerDirectory />} />
        <Route path="/lawyers/:id" element={<LawyersPage />} />
        <Route path="/chats/:id?" element={<ChatsPage />} />
        <Route path="/session/join/:id" element={<VideoCall />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route
          path="/lawyers/payment_success"
          element={<PaymentSuccessPage />}
        />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:id" element={<CaseDetailsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
      </Route>
    </Routes>
  );
}

export default ClientRoutes;
