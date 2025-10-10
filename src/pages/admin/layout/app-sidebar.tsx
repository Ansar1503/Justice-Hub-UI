import * as React from "react";
import {
  CalendarDaysIcon,
  Gavel,
  Headset,
  Settings,
  Shield,
  User,
  Wallet,
  LayoutDashboard, // 🆕 Dashboard icon
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { store } from "@/store/redux/store";

const navdata = {
  navMain: [
    // 🆕 Dashboard Section
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "User Management",
      url: "/admin/",
      icon: User,
      items: [
        {
          title: "Users",
          url: "/admin/",
        },
      ],
    },
    {
      title: "Lawyer Verification",
      url: "/admin/lawyer-verification",
      icon: Shield,
      items: [
        {
          title: "Verification Management",
          url: "/admin/lawyer-verification",
        },
      ],
    },
    {
      title: "Lawyer Cases",
      url: "/admin/casesmanagement",
      icon: Gavel,
      items: [
        {
          title: "Specializations",
          url: "/admin/casesmanagement",
        },
      ],
    },
    {
      title: "Sessions Details",
      url: "/admin/sessions",
      icon: CalendarDaysIcon,
      items: [
        {
          title: "Sessions",
          url: "/admin/sessions",
        },
        {
          title: "Appointments",
          url: "/admin/appointments",
        },
      ],
    },
    {
      title: "Disputes",
      url: "/admin/disputes/review",
      icon: Headset,
      items: [
        {
          title: "Reviews",
          url: "/admin/disputes/review",
        },
        {
          title: "Chats",
          url: "/admin/disputes/chat",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings/commission",
      icon: Settings,
      items: [{ title: "Commission", url: "/admin/settings/commission" }],
    },
    {
      title: "Wallet",
      url: "/admin/wallet",
      icon: Wallet,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = store.getState().Auth;
  const location = useLocation();

  const dashItems = navdata.navMain.map((item) => {
    const isActive =
      location.pathname === item.url || location.pathname.startsWith(item.url);

    return {
      ...item,
      isActive,
      items: item.items?.map((subItem) => ({
        ...subItem,
        isActive: location.pathname === subItem.url,
      })),
    };
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: user?.name?.charAt(0) || "",
            email: user?.email || "",
            name: user?.name || "NA",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
