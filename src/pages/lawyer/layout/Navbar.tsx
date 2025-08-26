import { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeProvider";
import { VscLaw } from "react-icons/vsc";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthContextPovider";
import { useNavigate } from "react-router-dom";
import { UserEnum } from "../../../types/enums/user.enums";
import { useAppDispatch, useAppSelector } from "@/store/redux/Hook";
// import { LogOut } from "@/store/redux/client/ClientSlice";
import { signOut } from "@/store/redux/auth/Auth.Slice";
import { motion } from "framer-motion";
import { Bell, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationComponent from "@/components/NotificationComponent";

function Navbar() {
  const { theme, toggle_theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.Auth.user);

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    // dispatch(LogOut());
    dispatch(signOut());
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <>
      <nav
        className={`transition-all duration-300 ${
          theme === "dark"
            ? "bg-brandBlack text-[#E0E0E0]"
            : "bg-brandPrimary text-white"
        }`}
      >
        <div className="flex justify-between items-center p-2 ml-5">
          {/* Logo */}
          <div
            id="logo"
            onClick={() => navigate("/")}
            className="cursor-pointer flex justify-between items-center gap-1"
          >
            <VscLaw className="h-full w-8" />
            <h2 className="text-xl font-semibold">Justice Hub</h2>
          </div>

          {/* Desktop Menu */}
          <div id="properties" className="hidden md:flex gap-8 text-lg">
            <ul className="flex gap-8">
              <li
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li className="hover:underline cursor-pointer">Services</li>
              <li className="hover:underline cursor-pointer">Lawyers</li>
              <li className="hover:underline cursor-pointer">Blogs</li>
              <li className="hover:underline cursor-pointer">About Us</li>
            </ul>
          </div>

          {/* Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-4 items-center">
              {user?.name ? (
                <div className="flex items-center gap-3">
                  <NotificationComponent />

                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all duration-200"
                    >
                      <span className="text-white text-lg font-semibold">
                        Hello, {user?.name}!
                      </span>
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* User Dropdown */}
                    {isDropdownOpen && (
                      <div
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${
                          theme === "dark"
                            ? "bg-[#2D3142] text-white"
                            : "bg-[#15355E] text-white"
                        }`}
                      >
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm">Signed in as</p>
                          <p className="text-sm font-medium truncate">
                            {user?.email || user?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate("/lawyer/");
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-20 hover:bg-white"
                        >
                          <FiUser className="mr-2" />
                          Go to Profile
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-20 hover:bg-white"
                        >
                          <FiLogOut className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
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
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={toggle_theme}
                className="p-3 rounded-full transition-all duration-300 bg-indigo-600 dark:bg-gray-800 dark:text-white"
              >
                {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
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
              <li
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li className="hover:underline cursor-pointer">Services</li>
              <li className="hover:underline cursor-pointer">Lawyers</li>
              <li className="hover:underline cursor-pointer">Blogs</li>
              <li className="hover:underline cursor-pointer">About Us</li>
            </ul>

            {/* Mobile Buttons (Only Visible in Menu) */}
            {user?.name ? (
              <div className="w-full max-w-xs">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all duration-200"
                >
                  <span className="text-white text-lg font-semibold">
                    Hello, {user?.name}!
                  </span>
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <Button
                  onClick={toggleNotification}
                  variant="ghost"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 mt-2 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  <span className="text-lg font-semibold">Notifications</span>
                </Button>

                {/* Mobile User Dropdown */}
                {isDropdownOpen && (
                  <div
                    className={`mt-2 w-full rounded-md shadow-lg py-1 ${
                      theme === "dark"
                        ? "bg-[#2D3142] text-white"
                        : "bg-[#15355E] text-white"
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm">Signed in as</p>
                      <p className="text-sm font-medium truncate">
                        {user?.email || user?.name}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        setIsOpen(false);
                        navigate("/lawyer/");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-20 hover:bg-white"
                    >
                      <FiUser className="mr-2" />
                      Go to Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-20 hover:bg-white"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
            )}

            <button
              onClick={toggle_theme}
              className="p-3 rounded-full transition-all duration-300 bg-indigo-500 dark:bg-gray-800 dark:text-white"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        )}

        {user?.lawyer_verification_status &&
          user?.lawyer_verification_status !== "verified" && (
            <div className="overflow-hidden w-full bg-black mt-3">
              <motion.div
                className="text-red-600 whitespace-nowrap"
                animate={{ x: ["100%", "-100%"] }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {user?.lawyer_verification_status === "pending" ? (
                  <div className="flex items-center justify-center font-bold text-red-600">
                    <TriangleAlert />
                    Lawyer Verification Pending. Please go to the profile to
                    verify your account.
                  </div>
                ) : user?.lawyer_verification_status === "rejected" ? (
                  <div className="flex items-center justify-center font-bold text-red-600">
                    <TriangleAlert />
                    Lawyer Verification Rejected. Try verification again.
                  </div>
                ) : user?.lawyer_verification_status === "requested" ? (
                  <div className="flex items-center justify-center font-bold text-yellow-600">
                    <TriangleAlert />
                    Your Verification Request is Under Review. Wait until the
                    admin verifies your lawyer account.
                  </div>
                ) : (
                  ""
                )}
              </motion.div>
            </div>
          )}
      </nav>
    </>
  );
}

export default Navbar;
