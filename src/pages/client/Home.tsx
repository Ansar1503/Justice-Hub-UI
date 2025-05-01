import Footer from "./layout/Footer";
import Hero from "./layout/Hero";
import Navbar from "./layout/Navbar";

function Home() {
  return (
    <div className="bg-[#FFF2F2] dark:bg-gray-800">
      <Navbar />
      <Hero />
      <div className="m-10">
        <div className="m-10">
          <h1 className="text-stone-500 dark:text-white text-3xl">
            One Stop Solution to All Legal Needs: Expert Advice, Effortless
            Solutions.
          </h1>
        </div>
        <div className="m-10 mr-40">
          <p className="text-stone-400 dark:text-gray-300 mr-96">
            Justice Hub provides the best online legal consultation and advisory
            services in India and around the globe. Consult with experienced
            lawyers, legal experts, and consultants via chat, phone, or video
            call. Get the best online legal advice and guidance for all your
            legal matters.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
