import { BlogDetailPage } from "@/components/users/Blog/BlogDetailsPage";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";

export default function BlogDetails() {
  return (
    <div className="flex flex-col min-h-screen  bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-3">
          <BlogDetailPage />
        </div>
      </div>
      <Footer />
    </div>
  );
}
