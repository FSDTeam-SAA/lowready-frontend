"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
   LayoutDashboard,
  CalendarCheck,
  PlaneTakeoff,
  Users,
  Building2,
  Wallet,
  Percent,
  Star,
  LogOut,

} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
   {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Placements",
    url: "/dashboard/placements",
    icon: CalendarCheck,
  },
  {
    title: "Tour Requests",
    url: "/dashboard/tourrequest",
    icon: PlaneTakeoff,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Manage Facility",
    url: "/dashboard/ManageFacility",
    icon: Building2,
  },
  {
    title: "Earnings Summary",
    url: "/dashboard/earningsummary",
    icon: Wallet,
  },
  {
    title: "Commissions",
    url: "/dashboard/Commissions",
    icon: Percent,
  },
  {
    title: "Reviews & Ratings",
    url: "/dashboard/ReviewsRatings",
    icon: Star,
  },
  
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Sidebar className="border-r-0 w-[312px] shadow-2xl text-[#68706A]" collapsible="none" {...props}>
        <SidebarContent className="p-4 bg-[#FFFFFF]">
          <Link href={"/dashboard"} className="text-white">
            <Image
              src="/dashboard/dashboardlogo.png"
              alt="Logo"
              width={150}
              height={80}
              className="mx-auto h-[80px] font-bold w-[150px] object-contain mb-4"
            />
          </Link>
          <SidebarMenu className="space-y-2 ">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title} className="">
                <SidebarMenuButton
                  isActive={isActive(item.url)}
                  className="group py-8 flex  hover:bg-[#28A745] data-[active=true]:bg-[#28A745]"
                >
                  <Link href={item.url} className="flex gap-2 items-center">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.url)
                          ? "text-white"
                          : "text-[#68706A] group-hover:text-white"
                      }`}
                    />
                    <span
                      className={`text-[12px] font-medium text-center ${
                        isActive(item.url)
                          ? "text-white"
                          : "text-[#68706A] group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <div className="absolute bottom-[100px] -left-20 w-[312px] ">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsLogoutDialogOpen(true)}
                className="group py-8 flex justify-center hover:bg-[#ffffff]"
              >
                <div className="flex gap-2 items-center">
                  <LogOut className=" text-gray-400 group-hover:text-[#212121]" />
                  <span className="text-[12px] font-medium text-gray group-hover:text-[#212121]">
                    Logout
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>

      {/* LogOutModal component would go here */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsLogoutDialogOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}