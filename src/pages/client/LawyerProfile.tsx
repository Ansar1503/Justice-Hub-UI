import LawyerProfile from "@/components/users/LawyerProfile";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function LawyersPage() {
  return (
    <main className="min-h-screen bg-brandCream dark:bg-slate-950">
      <Navbar />
      <LawyerProfile />
      <Footer />
    </main>
  );
}
