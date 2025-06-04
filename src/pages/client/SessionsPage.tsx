import Footer from "@/pages/client/layout/Footer";
import Navbar from "@/pages/client/layout/Navbar";
import Sidebar from "@/pages/client/layout/Sidebar";

function SessionsPage() {
  return (
    <>
      <div className="bg-[#FFF2F2] dark:bg-slate-700">
        <Navbar />
        <Sidebar />
        <Footer />
      </div>
    </>
  );
}

export default SessionsPage;
