import Footer from "./layout/Footer";
import Hero from "./layout/Hero";
import Navbar from "./layout/Navbar";
import IntroSection from "@/components/users/Home/IntroSection";
import FeaturesSection from "@/components/users/Home/FeaturesSection";
import WhyChooseUs from "@/components/users/Home/WhyChooseUs";
import PracticeAreas from "@/components/users/Home/PracticalAreas";
import CTASection from "@/components/users/Home/CTASection";
function Home() {
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
