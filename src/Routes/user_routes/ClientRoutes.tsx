import ClientProfile from "@/pages/client/ClientProfile";
import SessionsPage from "@/pages/client/SessionsPage";
import { Route, Routes } from "react-router-dom";

function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientProfile />} />
      <Route path="/sessions" element={<SessionsPage />} />
    </Routes>
  );
}

export default ClientRoutes;
