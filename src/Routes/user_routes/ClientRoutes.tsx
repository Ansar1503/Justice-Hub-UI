import { lazy } from "react";
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const SessionsPage = lazy(() => import("@/pages/client/SessionsPage"));
import { Route, Routes } from "react-router-dom";

function ClientRoutes() {
  return (
    <Routes>
      <Route index element={<ClientProfile />} />
      <Route path="/sessions" element={<SessionsPage />} />
    </Routes>
  );
}

export default ClientRoutes;
