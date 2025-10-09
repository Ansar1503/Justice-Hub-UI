import LawyerDashboardPage from "@/components/Lawyer/Dashboard/LawyerDashboardPage";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

export default function LawyerDashboard() {
  return (
    <div className="bg-[#FFF2F2] dark:bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto h-full">
          <header className="mb-6">
            <h1 className="text-pretty text-2xl font-semibold tracking-tight">
              Lawyer Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of your cases, appointments, sessions and wallet.
            </p>
          </header>
          <section aria-label="Dashboard content">
            <LawyerDashboardPage />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
