import ProfileCard from "@/components/users/ProfileCard";
import Footer from "@/pages/client/layout/Footer";
import Navbar from "@/pages/client/layout/Navbar";
import Sidebar from "@/pages/client/layout/Sidebar";

function ClientProfile() {
  return (
    <div className="bg-[#FFF2F2] dark:bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row md:gap-6 container mx-auto ">
        <Sidebar />
        <main className="flex-grow  m-6">
          <ProfileCard />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ClientProfile;