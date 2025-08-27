"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Placements", url: "/dashboard/placements", icon: CalendarCheck },
  { title: "Tour Requests", url: "/dashboard/TourRequests", icon: PlaneTakeoff },
  { title: "Customers", url: "/dashboard/Customers", icon: Users },
  { title: "Manage Facility", url: "/dashboard/facility", icon: Building2 },
  { title: "Earnings Summary", url: "/dashboard/EarningSummary", icon: Wallet },
  { title: "Commissions", url: "/dashboard/Commissions", icon: Percent },
  { title: "Reviews & Ratings", url: "/dashboard/ReviewsRatings", icon: Star },
  
];

const settingsSubItems = [
  { title: "Profile", url: "/dashboard/profile" },
  { title: "Change Password", url: "/dashboard/change-password" },
  { title: "Document", url: "/dashboard/document" },
  { title: "Subscription", url: "/dashboard/Subscription" },
];

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Check if a path is the currently active one
  const isActive = (path: string) => pathname === path;

  // Check if any settings sub-item is active to highlight the parent dropdown
  const isSettingsParentActive = () => {
    return settingsSubItems.some(sub => isActive(sub.url));
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Sidebar
        className="border-r-0 w-[312px] shadow-2xl text-[#68706A]"
        collapsible="none"
        {...props}
      >
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

          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="group py-8 flex hover:bg-[#28A745] data-[active=true]:bg-[#28A745]"
                    isActive={isActive(item.url ?? "")}
                  >
                    <Link
                      href={item.url}
                      className="flex gap-2 items-center w-full"
                    >
                      {item.icon && (
                        <item.icon
                          className={`h-5 w-5 ${
                            isActive(item.url) ? "text-white" : "text-[#68706A] group-hover:text-white"
                          }`}
                        />
                      )}
                      <span className="flex-1 text-[12px] font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            ))}
            
            {/* Settings Dropdown with Active State */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="group py-8 flex hover:bg-[#28A745] data-[active=true]:bg-[#28A745]"
                    isActive={isSettingsParentActive()}
                  >
                    <div className="flex gap-2 items-center w-full">
                      <Settings
                        className={`h-5 w-5 ${
                          isSettingsParentActive() ? "text-white" : "text-[#68706A] group-hover:text-white"
                        }`}
                      />
                      <span className="flex-1 text-[12px] font-medium text-[#68706A] group-hover:text-white">
                        Settings
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="ml-6 flex flex-col space-y-1 bg-white p-2 border border-gray-200 shadow-md">
                {settingsSubItems.map((sub) => (
                  <Link
                    key={sub.title}
                    href={sub.url}
                    passHref
                  >
                    <DropdownMenuItem
                      className={`text-[12px] py-2 px-4 rounded cursor-pointer ${
                        isActive(sub.url) ? "bg-[#28A745] text-white" : "text-[#68706A] hover:bg-gray-100"
                      }`}
                    >
                      {sub.title}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenu>
        </SidebarContent>

        {/* Logout button positioned at the bottom */}
        <div className="absolute bottom-[100px] -left-20 w-[312px]">
          <Dialog>
            <DialogTrigger asChild>
              <SidebarMenuButton
                className="group py-8 flex justify-center hover:bg-[#ffffff]"
              >
                <div className="flex gap-2 items-center">
                  <LogOut className="text-gray-400 group-hover:text-[#212121]" />
                  <span className="text-[12px] font-medium text-gray group-hover:text-[#212121]">
                    Logout
                  </span>
                </div>
              </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to logout?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-row sm:justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => (document.getElementById("close-logout-dialog") as HTMLButtonElement)?.click()}>
                  Cancel
                </Button>
                <Button variant="destructive" type="button" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Sidebar>
    </>
  );
}