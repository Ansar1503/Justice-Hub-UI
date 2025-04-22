import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(()=>import("@/pages/client/Home"))
const UserLogin = lazy(()=>import("@/pages/client/UserLogin"))
const UserSignup = lazy(()=>import("@/pages/client/UserSignup"))
const EmailverificationError = lazy(()=>import("@/pages/errors/EmailverificationError"))
const Emailverificationsuccesspage = lazy(()=>import("@/pages/client/Emailverificationsuccesspage"))
const OtpPage = lazy(()=>import("@/pages/client/OtpPage"))
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
