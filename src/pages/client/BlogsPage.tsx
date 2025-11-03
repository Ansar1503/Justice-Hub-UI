import { BlogListingPage } from "@/components/users/Blog/BlogListing";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

export default function BlogsPage() {
  return (
    <div className="flex flex-col min-h-screen  bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3">
          <BlogListingPage />
        </div>
      </div>
      <Footer />
    </div>
  );
}
