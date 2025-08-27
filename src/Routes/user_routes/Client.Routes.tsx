import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./wrapper/ClientProtected.Route";
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const SessionsPage = lazy(() => import("@/pages/client/AppointmentsPage"));
const LawyerDirectory = lazy(() => import("@/pages/client/LawyersListing"));
const LawyersPage = lazy(() => import("@/pages/client/LawyerProfile"));
import PaymentSuccessPage from "@/pages/client/payment_successpaeg";
import SessionPage from "@/pages/client/sessions";
import VideoCall from "@/pages/lawyer/VideoCall";
import ReviewPage from "@/pages/client/ReviewPage";
import WalletPage from "@/pages/client/WalletPage";
const Chats_page = lazy(() => import("@/pages/client/chats_page"));
function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<ClientProfile />} />
        <Route path="/appointments" element={<SessionsPage />} />
        <Route path="/sessions" element={<SessionPage />} />
        <Route path="/lawyers" element={<LawyerDirectory />} />
        <Route path="/lawyers/:id" element={<LawyersPage />} />
        <Route path="/chats/:id?" element={<Chats_page />} />
        <Route path="/session/join/:id" element={<VideoCall />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route
          path="/lawyers/payment_success"
          element={<PaymentSuccessPage />}
        />
        <Route path="/wallet" element={<WalletPage />} />
      </Route>
    </Routes>
  );
}

export default ClientRoutes;
