import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Sessions = lazy(() => import("@/pages/admin/Sessions"));
import { Route, Routes } from "react-router-dom";
import { Protected } from "./wrapper/admin.protect.route";
import Appointments from "@/pages/admin/Appointments";
import ChatDisputes from "@/pages/admin/ChatDisputes";
import ReviewDisputes from "@/pages/admin/ReviewDisputes";
import WalletPage from "@/pages/admin/WalletPage";

const LawyerVerfication = lazy(
  () => import("@/pages/admin/VerificationInputs")
);

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Protected />}>
        <Route index element={<AdminDashboard />} />
        <Route path="/lawyer-verification" element={<LawyerVerfication />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/disputes/chat" element={<ChatDisputes />} />
        <Route path="/disputes/review" element={<ReviewDisputes />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
