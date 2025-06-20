import { lazy } from "react";
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const SessionsPage = lazy(() => import("@/pages/client/AppointmentsPage"));
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./wrapper/ClientProtected.Route";
import LawyerDirectory from "@/pages/client/LawyersListing";
import LawyersPage from "@/pages/client/LawyerProfile";
import PaymentSuccessPage from "@/pages/client/payment_successpaeg";
import SessionPage from "@/pages/client/sessions";
function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<ClientProfile />} />
        <Route path="/appointments" element={<SessionsPage />} />
        <Route path="/sessions" element={<SessionPage />} />
        <Route path="/lawyers" element={<LawyerDirectory />} />
        <Route path="/lawyers/:id" element={<LawyersPage />} />
        <Route
          path="/lawyers/payment_success"
          element={<PaymentSuccessPage />}
        />
      </Route>
    </Routes>
  );
}

export default ClientRoutes;
