import LoginComponent from "../../components/LoginComponent";
import Footer from "../../layout/client/Footer";
import Navbar from "../../layout/client/Navbar";

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
