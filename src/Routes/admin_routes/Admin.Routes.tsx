import AdminDashboard from "@/pages/admin/Dashboard";
import { Route, Routes } from "react-router-dom";
import { Protected } from "./wrapper/admin.protect.route";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Protected />}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
