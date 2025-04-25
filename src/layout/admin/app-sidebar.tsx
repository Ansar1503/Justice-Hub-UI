import * as React from "react";
import {
  // Frame,
  // Map,
  // PieChart,
  User,
} from "lucide-react";

import { NavMain } from "@/layout/admin/nav-main";
// import { NavProjects } from "@/layout/admin/nav-projects";
import { NavUser } from "@/layout/admin/nav-user";
import { TeamSwitcher } from "@/layout/admin/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useFetchClientData } from "@/hooks/tanstack/queries";
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
          title: "clients",
          url: "/admin/clients",
        },
        {
          title: "lawyers",
          url: "admin/lawyers",
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useFetchClientData();
  const user = data?.data?.role === "admin" ? data?.data : null;
  const location = useLocation();
  const dashItems = navdata.navMain.map((item) => ({
    ...item,
    isActive: location.pathname.startsWith(item.url),
    items: item.items?.map((subItem) => ({
      ...subItem,
      isActive: location.pathname === subItem.url,
    })),
  }));

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
