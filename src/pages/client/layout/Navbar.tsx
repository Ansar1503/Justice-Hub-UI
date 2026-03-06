"use client";

import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../context/ThemeProvider";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthContextPovider";
import { useNavigate, useLocation } from "react-router-dom";
import { UserEnum } from "../../../types/enums/user.enums";
import { useAppDispatch, useAppSelector } from "@/store/redux/Hook";
import { signOut } from "@/store/redux/auth/Auth.Slice";
import NotificationComponent from "@/components/NotificationPopover";
import { useFetchClientData } from "@/store/tanstack/queries";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { persistor } from "@/store/redux/store";
import { cn } from "@/lib/utils";

function Navbar() {
  const { theme, toggle_theme } = useContext(ThemeContext);
  const { setUserRole } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.user);

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const { data: clientData } = useFetchClientData();

  useEffect(() => {
    if (clientData && clientData.is_blocked) {
      handleLogout();
    }
  }, [clientData]);

  const handleLogout = async () => {
    try {
      await axiosinstance.post("/api/user/logout");
    } catch (error) {
      console.log("logout error", error);
    } finally {
      dispatch(signOut());
      await persistor.purge();
      navigate("/login");
    }
  };

  const navItems = [
    { label: "Lawyers", path: "/lawyers" },
    { label: "Blogs", path: "/blogs" },
  ];

  return (
    <nav
      className={`p-4 transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#1A1C2B] text-[#E0E0E0]"
          : "bg-brandPrimary text-white"
      }`}
    >
      <div className="flex justify-between items-center relative">
        {/* Logo */}
        <div
          className="cursor-pointer text-xl font-semibold"
          onClick={() => navigate("/")}
        >
          Justice Hub
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 border border-nav-border bg-secondary/50 px-2 py-1 rounded-full absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "px-4 py-1.5 text-sm font-semibold uppercase rounded-full transition",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user?.name ? (
              <div className="flex items-center gap-3">
                <NotificationComponent />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/20"
                  >
                    Hello, {user.name}
                    <FiChevronDown
                      className={`transition ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${
                        theme === "dark" ? "bg-[#2D3142]" : "bg-[#15355E]"
                      }`}
                    >
                      <div className="px-4 py-2 border-b border-gray-700 text-sm">
                        {user.email}
                      </div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/client");
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20"
                      >
                        <FiUser className="mr-2" /> Profile
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/20"
                      >
                        <FiLogOut className="mr-2" /> Logout
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
                className="px-5 py-2 rounded-lg bg-[#15355E] hover:bg-[#1E4A7C]"
              >
                Login
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggle_theme}
              className="p-2 rounded-full bg-indigo-600"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 items-center">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="text-lg"
            >
              {item.label}
            </button>
          ))}

          {user?.name ? (
            <>
              <button
                onClick={() => {
                  navigate("/client");
                  setIsOpen(false);
                }}
              >
                Profile
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setUserRole(UserEnum.client);
                navigate("/login");
              }}
            >
              Login
            </button>
          )}

          <button onClick={toggle_theme}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
