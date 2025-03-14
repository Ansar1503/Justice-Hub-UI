import { useNavigate } from "react-router-dom";
import { UserEnum } from "../../types/enums/user.enums";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextPovider";

function Hero() {
  const navigate = useNavigate();
  const { setUserRole } = useContext(AuthContext);
  return (
    <div className="relative w-full h-[450px] md:h-[400px] lg:h-[450px] xl:h-[500px]">
      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dcux2pmye/image/upload/v1740412142/Justice_Hub/kg3z2kurgz9ospnh6et8.jpg"
        alt="Legal Consultation"
        className="w-full h-full object-cover"
      />

      {/* Overlay with Two Sections */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left - Client */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center group px-6 py-8 md:p-12">
          <div className="absolute inset-0 bg-black/50 transition duration-500 group-hover:bg-black/30"></div>
          <div className="z-10 text-white text-center transition duration-500 group-hover:scale-105">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
              I Need a Lawyer
            </h2>
            <p className="mb-4 max-w-md text-sm md:text-base lg:text-lg">
              Get expert legal help and guidance from trusted professionals.
            </p>
            <button
              onClick={() => {
                setUserRole(UserEnum.client);
                navigate("/login");
              }}
              className="px-5 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition"
            >
              Login as Client
            </button>
          </div>
        </div>

        {/* Right - Lawyer */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center group px-6 py-8 md:p-12">
          <div className="absolute inset-0 bg-black/50 transition duration-500 group-hover:bg-black/30"></div>
          <div className="z-10 text-white text-center transition duration-500 group-hover:scale-105">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
              I Am a Lawyer
            </h2>
            <p className="mb-4 max-w-md text-sm md:text-base lg:text-lg">
              Connect with clients and offer your legal expertise with ease.
            </p>
            <button
              onClick={() => {
                setUserRole(UserEnum.lawyer);
                navigate("/login");
              }}
              className="px-5 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition"
            >
              Login as Lawyer
            </button>
          </div>
        </div>
      </div>

      {/* Blur Effect on Hover */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 hover:w-full hover:backdrop-blur-sm md:hover:backdrop-blur-none transition-all duration-500 backdrop-blur-xs cursor-pointer"></div>
        <div className="w-full md:w-1/2 hover:w-full hover:backdrop-blur-sm md:hover:backdrop-blur-none transition-all duration-500 backdrop-blur-xs cursor-pointer"></div>
      </div>
    </div>
  );
}

export default Hero;
