import { DashboardHeader } from "@/components/dashboard/dashboardHead/DashboardHead";
import { DashboardSidebar } from "@/components/dashboard/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} `}
      >
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
      </body>
    </html>
  );
}
