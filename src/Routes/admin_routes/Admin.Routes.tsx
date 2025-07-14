import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Sessions = lazy(() => import("@/pages/admin/Sessions"));
import { Route, Routes } from "react-router-dom";
import { Protected } from "./wrapper/admin.protect.route";
import Appointments from "@/pages/admin/Appointments";

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
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
