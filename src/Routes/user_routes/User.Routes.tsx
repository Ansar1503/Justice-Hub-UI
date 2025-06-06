import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("@/pages/client/Home"));
const UserLogin = lazy(() => import("@/pages/client/UserLogin"));
const UserSignup = lazy(() => import("@/pages/client/UserSignup"));
const EmailverificationError = lazy(
  () => import("@/pages/errors/EmailverificationError")
);
const Emailverificationsuccesspage = lazy(
  () => import("@/pages/client/Emailverificationsuccesspage")
);
const OtpPage = lazy(() => import("@/pages/client/OtpPage"));
import ClientRoutes from "./Client.Routes";
import LawyerRoutes from "../lawyer_routes/lawyer.routes";
import PublicRoute from "./wrapper/Client.Public.Route";
// import { VerificationModal } from "@/components/Modals/Verification.Modal";
import AdminRoutes from "../admin_routes/Admin.Routes";

function UserRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route
          path="/email-validation-error"
          element={<EmailverificationError />}
        />
        <Route
          path="/email-verified"
          element={<Emailverificationsuccesspage />}
        />
      </Route>

      <Route path="/" element={<Home />} />

      <Route path="/client/*" element={<ClientRoutes />} />

      <Route path="/lawyer/*" element={<LawyerRoutes />} />

      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default UserRoutes;
