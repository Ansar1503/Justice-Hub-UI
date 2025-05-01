import EmailVerificationError from "../../components/users/EmailValidationError";
import Navbar from "@/pages/client/layout/Navbar";
import Footer from "@/pages/client/layout/Footer";

function EmailverificationError() {
  return (
    <>
      <Navbar />
      <EmailVerificationError />
      <Footer />
    </>
  );
}

export default EmailverificationError;
