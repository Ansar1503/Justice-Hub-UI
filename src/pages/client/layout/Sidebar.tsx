import { Calendar, Calendar1, User, UserPen } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/store/redux/Hook";
import { useLocation, Link } from "react-router-dom";
import { useFetchClientData } from "@/store/tanstack/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IoChatbubblesOutline } from "react-icons/io5";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((state) => state.Auth.user);
  const { data } = useFetchClientData();
  const userData = data?.data;
  const location = useLocation();
  const path = location.pathname;
  const pathname = path.split("/")[path.split("/").length - 1];

  const menuItems = [
    { path: `/${user?.role}/`, label: "Profile", icon: UserPen },
    {
      path: `/${user?.role}/appointments`,
      label: "appointments",
      icon: Calendar,
    },
    { path: `/${user?.role}/sessions`, label: "Session", icon: Calendar1 },
    {
      path: `/${user?.role}/chats`,
      label: "chats",
      icon: IoChatbubblesOutline,
    },
  ];

  return (
    <>
      {/* Toggle button*/}
      {(pathname === "chats" || window.innerWidth < 768) && (
        <button
          className="fixed z-30 bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      )}
      {/* Sidebar content */}
      <aside
        className={`
          bg-brandForm2 dark:bg-black
          md:w-1/12 w-1/2 md:min-w-64 flex-shrink-0 min-h-screen
          ${
            isOpen || (pathname !== "chats" && window.innerWidth >= 768)
              ? "fixed left-0 h-screen w-72 z-20 p-4 pt-16 overflow-y-auto top-0 md:static md:h-auto md:pt-4"
              : "fixed -left-full p-4"
          } 
          transition-all duration-300 ease-in-out
        `}
        style={{
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        {/* User Info Section */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              className="rounded-full"
              src={userData?.profile_image}
              alt={userData?.name}
            />
            <AvatarFallback className="rounded-lg">
              <User />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {user?.name || "User Name"}
          </h2>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                    location.pathname === item.path
                      ? "bg-gray-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      location.pathname === item.path
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
