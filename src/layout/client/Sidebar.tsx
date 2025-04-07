import { CalendarSync, ShieldAlert, User, UserPen, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed z-30 bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
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

      {/* Sidebar content */}
      <aside
        className={`
         p bg-neutral-300 dark:bg-slate-800 rounded-lg shadow-lg shadow-slate-300 dark:shadow-black
          md:w-64 w-full md:min-w-64 flex-shrink-0
          ${isOpen ? "fixed left-0 h-screen w-72 z-20 p-4 pt-16 overflow-y-auto top-0" : "fixed -left-full p-4"} 
          md:static md:left-0 md:p-4 md:my-4 transition-all duration-300 ease-in-out
        `}
      >
        {/* User Info Section */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Ansar M A
          </h2>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition ${
                      isActive
                        ? "bg-gray-600 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

const menuItems = [
  { path: "/client/profile", label: "Profile", icon: UserPen },
  { path: "/client/sessions", label: "Sessions", icon: CalendarSync },
  { path: "/client/wallet", label: "Wallet", icon: Wallet },
  { path: "/client/disputes", label: "My Disputes", icon: ShieldAlert },
  { path: "/client/something", label: "Something", icon: CalendarSync },
  { path: "/client/saved-cards", label: "Saved Cards", icon: Wallet },
];