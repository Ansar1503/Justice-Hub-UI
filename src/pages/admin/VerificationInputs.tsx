import { AppSidebar } from "@/pages/admin/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeProvider";
import { ThemeEnum } from "@/types/enums/theme_enum";
import { useLocation, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { LawyersList } from "@/components/admin/LawyersList";

function LawyerVerification() {
  const { theme, toggle_theme } = useContext(ThemeContext);

  const toggleDarkMode = () => {
    toggle_theme();
  };

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
      <BreadcrumbItem key={path}>
        {isLast ? (
          <BreadcrumbPage>{segment}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink>
            <Link to={path}>{segment}</Link>
          </BreadcrumbLink>
        )}
        {!isLast && <BreadcrumbSeparator />}
      </BreadcrumbItem>
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
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle Dark Mode"
            >
              {theme === ThemeEnum.Dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <LawyersList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default LawyerVerification;
