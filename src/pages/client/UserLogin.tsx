import LoginComponent from "../../components/auth/LoginComponent";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";

function UserLogin() {
  return (
    <>
      <Navbar />
      <LoginComponent />
      <Footer />
    </>
  );
}

export default UserLogin;
