import SessionsListing from "@/components/Lawyer/sessionsListing";
import Footer from "@/pages/lawyer/layout/Footer";
import Navbar from "@/pages/lawyer/layout/Navbar";
import Sidebar from "@/pages/lawyer/layout/Sidebar";

export default function SessionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3">
          <SessionsListing />
        </div>
      </div>
      <Footer />
    </div>
  );
}
