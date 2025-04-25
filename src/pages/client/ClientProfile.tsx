import ProfileCard from "@/components/users/ProfileCard";
import Footer from "@/layout/client/Footer";
import Navbar from "@/layout/client/Navbar";
import Sidebar from "@/layout/client/Sidebar";

function ClientProfile() {
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

export default ClientProfile;