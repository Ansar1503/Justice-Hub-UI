import ProfileCard from "@/components/users/ProfileCard";
import Footer from "@/layout/lawyer/Footer";
import Navbar from "@/layout/lawyer/Navbar";
import Sidebar from "@/layout/lawyer/Sidebar";

function LawyerDashboard() {
    console.log('lawyers dashboard')
  return (
    <div className="bg-[#FFF2F2] dark:bg-slate-700 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row md:gap-6 container mx-auto px-4 py-6">
        <Sidebar />
        <main className="flex-grow md:mt-0 mt-6">
          <ProfileCard />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default LawyerDashboard;
