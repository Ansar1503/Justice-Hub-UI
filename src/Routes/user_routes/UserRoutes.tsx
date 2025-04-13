import { Routes, Route } from "react-router-dom";
import Home from "../../pages/client/Home";
import UserLogin from "../../pages/client/UserLogin";
import UserSignup from "../../pages/client/UserSignup";
import EmailverificationError from "@/pages/errors/EmailverificationError";
import Emailverificationsuccesspage from "@/pages/client/Emailverificationsuccesspage";
import OtpPage from "@/pages/client/OtpPage";
import ClientRoutes from "./ClientRoutes";
import PublicRoute from "../ClientPublicRoute";
import ProtectedRoute from "../ClientProtectedRoute";

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
      <Route element={<ProtectedRoute />}>
        <Route path="/client/*" element={<ClientRoutes />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
