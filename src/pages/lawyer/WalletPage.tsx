import { Wallet } from "@/components/Wallet/Wallet";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

export default function WalletPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Wallet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
