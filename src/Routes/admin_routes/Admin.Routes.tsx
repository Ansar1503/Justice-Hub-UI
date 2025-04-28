import AdminDashboard from "@/pages/admin/Dashboard";
import { Route, Routes } from "react-router-dom";
import { Protected } from "./wrapper/admin.protect.route";
import LawyerVerfication from "@/pages/admin/VerificationInputs";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Protected />}>
        <Route index element={<AdminDashboard />} />
        <Route path="/lawyer-verification" element={<LawyerVerfication />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
