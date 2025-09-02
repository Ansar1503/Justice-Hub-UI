import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/admin/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import React, { useContext, ReactNode } from "react";
import { ThemeContext } from "@/context/ThemeProvider";
import { ThemeEnum } from "@/types/enums/theme_enum";
import { Moon, Sun } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme, toggle_theme } = useContext(ThemeContext);
  const location = useLocation();

  const pathSegments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index) =>
      index === 0 && segment === "admin" ? "Home" : segment
    );

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;
    return (
      <React.Fragment key={path}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{segment}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={path}>{segment}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar className="bg-stone-300 dark:bg-black" />
      <SidebarInset className="bg-stone-200 dark:bg-stone-900">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-stone-300 dark:border-stone-700 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-stone-500"
              />
              <Breadcrumb>
                <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
              </Breadcrumb>
            </div>
            <button
              onClick={toggle_theme}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle Dark Mode"
            >
              {theme === ThemeEnum.Dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
