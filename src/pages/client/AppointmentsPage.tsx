import AppointmentListing from "@/components/users/AppointmentsComponent";
import Footer from "@/pages/client/layout/Footer";
import Navbar from "@/pages/client/layout/Navbar";
import Sidebar from "@/pages/client/layout/Sidebar";

function AppointmentsPage() {
  return (
    <div className="flex flex-col min-h-screen  bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3">
          <AppointmentListing />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppointmentsPage;
