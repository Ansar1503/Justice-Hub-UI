import { lazy } from "react";
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const SessionsPage = lazy(() => import("@/pages/client/SessionsPage"));
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./wrapper/ClientProtected.Route";
import LawyerDirectory from "@/pages/client/LawyersListing";

function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<ClientProfile />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/lawyers" element={<LawyerDirectory />} />
      </Route>
    </Routes>
  );
}

export default ClientRoutes;
