import Footer from "@/layout/client/Footer";
import Navbar from "@/layout/client/Navbar";
import Sidebar from "@/layout/client/Sidebar";

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
