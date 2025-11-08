import { BlogListingPage } from "@/components/users/Blog/BlogListing";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";

export default function BlogsPage() {
  return (
    <div className="flex flex-col min-h-screen  bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="w-full p-3">
        <BlogListingPage />
      </div>
      <Footer />
    </div>
  );
}
