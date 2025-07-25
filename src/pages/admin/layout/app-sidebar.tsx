import * as React from "react";
import { CalendarDaysIcon, Headset, Shield, User } from "lucide-react";

import { NavMain } from "./nav-main";
// import { NavProjects } from "@/layout/admin/nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useFetchClientData } from "@/store/tanstack/queries";
import { useLocation } from "react-router-dom";

const navdata = {
  navMain: [
    {
      title: "User Management",
      url: "/admin/",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/admin/",
        },
      ],
    },
    {
      title: "Lawyer Verfication",
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useFetchClientData();
  const user = data?.data?.role === "admin" ? data?.data : null;
  const location = useLocation();

  const dashItems = navdata.navMain.map((item) => {
    if (item.url === "/admin/" && location.pathname === "/admin/") {
      return { ...item, isActive: true };
    }

    const isActive =
      item.url !== "/admin/" && location.pathname.startsWith(item.url);

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
        {/* <NavProjects projects={[]} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: user?.profile_image || "",
            email: user?.email || "",
            name: user?.name,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
