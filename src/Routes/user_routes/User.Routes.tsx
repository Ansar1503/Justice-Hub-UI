import { Routes, Route } from "react-router-dom";
import ClientRoutes from "./Client.Routes";
import LawyerRoutes from "../lawyer_routes/lawyer.routes";
import PublicRoute from "./wrapper/Client.Public.Route";
// import { VerificationModal } from "@/components/Modals/Verification.Modal";
import AdminRoutes from "../admin_routes/Admin.Routes";
import Home from "@/pages/client/Home";
import UserLogin from "@/pages/client/UserLogin";
import UserSignup from "@/pages/client/UserSignup";
import EmailverificationError from "@/pages/errors/EmailverificationError";
import Emailverificationsuccesspage from "@/pages/client/Emailverificationsuccesspage";
import OtpPage from "@/pages/client/OtpPage";

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
