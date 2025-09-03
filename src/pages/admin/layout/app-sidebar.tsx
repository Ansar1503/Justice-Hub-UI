import * as React from "react";
import { CalendarDaysIcon, Gavel, Headset, Shield, User, Wallet } from "lucide-react";

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
import { useLocation } from "react-router-dom";
import { store } from "@/store/redux/store";

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
      title:"Lawyer Cases",
      url:"/admin/specializations",
      icon:Gavel,
      items:[
        {
          title:"Specializations",
          url:"/admin/specializations"
        }
      ]
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
    { title: "Wallet", url: "/admin/wallet", icon: Wallet },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = store.getState().Auth;
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
            avatar: user?.name.charAt(0) || "",
            email: user?.email || "",
            name: user?.name || "NA",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
