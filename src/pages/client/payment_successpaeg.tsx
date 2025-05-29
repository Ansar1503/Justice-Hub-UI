import PaymentSuccess from "@/components/users/paymentSuccess";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";


export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-brandCream dark:bg-slate-950">
      <Navbar />
      <PaymentSuccess />
      <Footer />
    </main>
  );
}
