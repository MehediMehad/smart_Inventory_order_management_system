"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { RiAdminLine } from "react-icons/ri";
import { getCurrentUser } from "@/services/Auth";

import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  RefreshCw,
  Activity,
  Settings,
} from "lucide-react";

type ROLE = "ADMIN" | "General_Admin" | "Moderator";
type MenuItem = {
  title: string;
  url: string;
  icon: any;
  accessRole: ROLE[];
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    accessRole: ["ADMIN"],
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
    accessRole: ["ADMIN"],
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Tags,
    accessRole: ["ADMIN"],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
    accessRole: ["ADMIN"],
  },
  {
    title: "Restock",
    url: "/dashboard/restock",
    icon: RefreshCw,
    accessRole: ["ADMIN"],
  },
  {
    title: "Activity",
    url: "/dashboard/activity",
    icon: Activity,
    accessRole: ["ADMIN"],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    accessRole: ["ADMIN"],
  },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const pathname = usePathname();
  const collapsed = state === "collapsed";

  const [role, setRole] = useState<ROLE | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = await getCurrentUser();
      if (user?.role) {
        setRole(user.role as ROLE);
      }
    };
    fetchUserRole();
  }, []);

  // Filter menu items based on user role
  const filteredMenu = menuItems.filter((item) =>
    role ? item.accessRole.includes(role) : false,
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold mb-4">
            <div className="flex gap-2 items-center">
              <RiAdminLine className="text-primary h-6 w-6" />
              <p className="text-primary text-center mt-1.5">
                Manage Dashboard
              </p>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <div className="h-5"></div>
            <SidebarMenu className="space-y-1">
              {filteredMenu.length ? (
                filteredMenu.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (pathname.startsWith(item.url + "/") &&
                      item.url !== "/dashboard");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={clsx(
                            "flex items-center rounded-md px-3 py-5 text-base transition-colors",
                            "hover:bg-accent/60",
                            isActive && "bg-accent text-primary font-semibold",
                          )}
                        >
                          <item.icon
                            className={clsx("h-5 w-5", !collapsed && "mr-2")}
                          />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <div className="h-20 flex items-center justify-center">
                  <p>loading...</p>
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
