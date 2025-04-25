import EmailVerificationError from "../../components/users/EmailValidationError";
import Navbar from "@/layout/client/Navbar";
import Footer from "@/layout/client/Footer";

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
