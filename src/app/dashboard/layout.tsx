// src/app/dashboard/layout.tsx
"use client";
export const dynamic = "force-dynamic";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/modules/dashboard/AppSidebar";
import DashboardNavbar from "@/components/modules/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
