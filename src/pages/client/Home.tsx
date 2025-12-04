import Footer from "./layout/Footer";
import Hero from "./layout/Hero";
import Navbar from "./layout/Navbar";
import IntroSection from "@/components/users/Home/IntroSection";
import FeaturesSection from "@/components/users/Home/FeaturesSection";
import WhyChooseUs from "@/components/users/Home/WhyChooseUs";
import PracticeAreas from "@/components/users/Home/PracticalAreas";
import CTASection from "@/components/users/Home/CTASection";
import { useAppSelector } from "@/store/redux/Hook";
import { Navigate } from "react-router-dom";
function Home() {
  const user = useAppSelector((state) => state.Auth.user);

  if (user) {
    if (user.role === "client") return <Navigate to="/client/" />;
    if (user.role === "lawyer") return <Navigate to="/lawyer/" />;
    if (user.role === "admin") return <Navigate to="/admin/" />;
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <>
        <Hero />
        <IntroSection />
        <FeaturesSection />
        <WhyChooseUs />
        <PracticeAreas />
        <CTASection />
      </>
      <Footer />
    </div>
  );
}

export default Home;
