import LawyerDashboard from "@/pages/lawyer/Dashboard";
import { Route, Routes } from "react-router-dom";
import LawyerProtected from "./wrapper/lawyer.protected.route";

export default function LawyerRoutes() {
  console.log("rendering lawyerroutes");

  return (
    <Routes>
      <Route element={<LawyerProtected />}>
        <Route index element={<LawyerDashboard />} />
      </Route>
    </Routes>
  );
}
