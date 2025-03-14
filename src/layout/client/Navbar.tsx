import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContextPovider";
import { useNavigate } from "react-router-dom";
import { UserEnum } from "../../types/enums/user.enums";

function Navbar() {
  const { theme, toggle_theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const { setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <nav
      className={` p-4 transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#1A1C2B] text-[#E0E0E0]"
          : "bg-[#373F84] text-white"
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div id="logo">
          <h2 className="text-xl font-semibold">Justice Hub</h2>
        </div>

        {/* Desktop Menu */}
        <div id="properties" className="hidden md:flex gap-8 text-lg">
          <ul className="flex gap-8">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">Services</li>
            <li className="hover:underline cursor-pointer">Lawyers</li>
            <li className="hover:underline cursor-pointer">Blogs</li>
            <li className="hover:underline cursor-pointer">About Us</li>
          </ul>
        </div>

        {/* Buttons & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => {
                setUserRole(UserEnum.client);
                navigate("/login");
              }}
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#2D3142] text-white hover:bg-[#3A3F55]"
                  : "bg-[#15355E] text-white hover:bg-[#1E4A7C]"
              }`}
            >
              Login
            </button>

            <button
              onClick={toggle_theme}
              className="p-3 rounded-full transition-all duration-300 bg-indigo-600 dark:bg-gray-800 dark:text-white"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 text-lg flex flex-col items-center gap-4">
          <ul className="flex flex-col gap-4 text-center">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">Services</li>
            <li className="hover:underline cursor-pointer">Lawyers</li>
            <li className="hover:underline cursor-pointer">Blogs</li>
            <li className="hover:underline cursor-pointer">About Us</li>
          </ul>

          {/* Mobile Buttons (Only Visible in Menu) */}
          <button
            onClick={() => {
              setUserRole(UserEnum.client);
              navigate("/login");
            }}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#2D3142] text-white hover:bg-[#3A3F55]"
                : "bg-[#15355E] text-white hover:bg-[#1E4A7C]"
            }`}
          >
            Login
          </button>

          <button
            onClick={toggle_theme}
            className="p-3 rounded-full transition-all duration-300 bg-indigo-500 dark:bg-gray-800 dark:text-white"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
