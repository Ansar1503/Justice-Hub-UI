import { lazy } from "react";
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const SessionsPage = lazy(() => import("@/pages/client/SessionsPage"));
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./wrapper/ClientProtected.Route";
import LawyerDirectory from "@/pages/client/LawyersListing";
import LawyersPage from "@/pages/client/LawyerProfile";
import PaymentSuccessPage from "@/pages/client/payment_successpaeg";

function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<ClientProfile />} />
        <Route path="/consultations" element={<SessionsPage />} />
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
