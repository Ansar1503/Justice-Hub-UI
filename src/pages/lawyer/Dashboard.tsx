import ProfileCard from "@/components/users/ProfileCard";
import Footer from "@/pages/lawyer/layout/Footer";
import Navbar from "@/pages/lawyer/layout/Navbar";
import Sidebar from "@/pages/lawyer/layout/Sidebar";

function LawyerDashboard() {
  return (
    <div className="bg-[#FFF2F2] dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row md:gap-10 ">
        <Sidebar />
        <main className="flex-grow md:mt-0 mt-6 px-6 py-8">
          <ProfileCard />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default LawyerDashboard;
