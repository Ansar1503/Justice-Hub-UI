import { Route, Routes } from "react-router-dom";
import { Protected } from "./wrapper/admin.protect.route";
import Appointments from "@/pages/admin/Appointments";
import ChatDisputes from "@/pages/admin/ChatDisputes";
import ReviewDisputes from "@/pages/admin/ReviewDisputes";
import WalletPage from "@/pages/admin/WalletPage";
import CaseManagement from "@/pages/admin/CasesManagement";
import CommissionPage from "@/pages/admin/CommissionPage";
import UserManagementPage from "@/pages/admin/UserManagement";
import Sessions from "@/pages/admin/Sessions";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LawyerVerification from "@/pages/admin/VerificationInputs";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Protected />}>
        <Route index element={<UserManagementPage />} />
        <Route path="/lawyer-verification" element={<LawyerVerification />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/disputes/chat" element={<ChatDisputes />} />
        <Route path="/disputes/review" element={<ReviewDisputes />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/casesmanagement" element={<CaseManagement />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="settings/commission" element={<CommissionPage />}></Route>
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
