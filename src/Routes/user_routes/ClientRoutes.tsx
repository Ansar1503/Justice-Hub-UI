import ClientProfile from "@/pages/client/Clientprofile";
import SessionsPage from "@/pages/client/SessionsPage";
import { Route, Routes } from "react-router-dom";

function ClientRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<ClientProfile />} />
      <Route path="/sessions" element={<SessionsPage />} />
    </Routes>
  );
}

export default ClientRoutes;
