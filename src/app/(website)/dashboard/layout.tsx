import { DashboardHeader } from "@/components/dashboard/dashboardHead/DashboardHead";
import { DashboardSidebar } from "@/components/dashboard/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "DashBoard",
  description: "Provider  Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
        <div>
          <SidebarProvider>
            <div className="flex min-h-screen ">
              <DashboardSidebar />
              <div className="flex-1 md:w-[calc(100vw-312px)]">
                <div className="sticky top-0 z-10 flex bg-[#FFFFFF]">
                  <DashboardHeader />
                </div>
                <main className="md:ml-[15px] bg-[#F8F9FA] h-full">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </div>
      
  );
}
