"use client";

import { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeProvider";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthContextPovider";
import { NavLink, useNavigate } from "react-router-dom";
import { UserEnum } from "../../../types/enums/user.enums";
import { useAppDispatch, useAppSelector } from "@/store/redux/Hook";
// import { LogOut } from "@/store/redux/client/ClientSlice";
import { signOut } from "@/store/redux/auth/Auth.Slice";
import NotificationComponent from "@/components/NotificationPopover";

function Navbar() {
  const { theme, toggle_theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <nav
      className={`p-4 transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#1A1C2B] text-[#E0E0E0]"
          : "bg-brandPrimary text-white"
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div id="logo" onClick={() => navigate("/")} className="cursor-pointer">
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
            {/* <li className="hover:underline cursor-pointer">Services</li> */}
            <NavLink to="/client/lawyers">
              <li className="hover:underline cursor-pointer">Lawyers</li>
            </NavLink>
            {/* <li className="hover:underline cursor-pointer">Blogs</li> */}
            {/* <li className="hover:underline cursor-pointer">About Us</li> */}
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
                          navigate("/client");
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
              className="p-3 rounded-full transition-all duration-300 
                 bg-indigo-600 dark:bg-gray-800 dark:text-white"
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
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsOpen(false);
                      navigate("/client");
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
    </nav>
  );
}

export default Navbar;
