import { CalendarSync, ShieldAlert, User, UserPen, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-300 dark:bg-slate-800 shadow-md p-4 min-h-screen">
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
  );
}

const menuItems = [
  { path: "/client/profile", label: "Profile Information", icon: UserPen },
  { path: "/client/sessions", label: "Sessions", icon: CalendarSync },
  { path: "/client/wallet", label: "Wallet", icon: Wallet },
  { path: "/client/disputes", label: "My Disputes", icon: ShieldAlert },
  { path: "/client/something", label: "Something", icon: CalendarSync },
  { path: "/client/saved-cards", label: "Saved Cards", icon: Wallet },
];
