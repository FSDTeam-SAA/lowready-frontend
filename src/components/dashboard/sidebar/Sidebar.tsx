"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  PlaneTakeoff,
  Users,
  Building2,
  Wallet,
  Star,
  LogOut,
  Settings,
  BadgePercent,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Placements", href: "/dashboard/placements", icon: CalendarCheck },
  { name: "Tour Requests", href: "/dashboard/tourrequest", icon: PlaneTakeoff },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Manage Facility", href: "/dashboard/facility", icon: Building2 },
  { name: "Earnings Summary", href: "/dashboard/earningsummary", icon: Wallet },
  { name: "Referral Fee", href: "/dashboard/referralfee", icon: BadgePercent },
  { name: "Reviews & Ratings", href: "/dashboard/reviewratings", icon: Star },
];

const settingsItems = [
  { name: "Profile", href: "/dashboard/profile" },
  { name: "Change Password", href: "/dashboard/change-password" },
  { name: "Document", href: "/dashboard/document" },
  { name: "Subscription", href: "/dashboard/Subscription" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col h-screen w-[312px] fixed shadow-2xl border-r-0 bg-white">
      {/* Logo */}
      <div className="px-4 py-6">
        <Image
          src="/images/Logo.png"
          alt="Logo"
          width={150}
          height={80}
          className="mx-auto h-[80px] w-[150px] object-contain mb-4"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              isActive(item.href)
                ? "bg-[#179649] text-white hover:bg-[#179649]"
                : "text-[#68706a] hover:bg-[#f8f9fa] hover:text-[#179649]"
            }`}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Button>
        ))}

        {/* Settings Dropdown using ShadCN UI */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
                settingsItems.some((item) => isActive(item.href))
                  ? "bg-[#179649] text-white hover:bg-[#179649]"
                  : "text-[#68706a] hover:bg-[#f8f9fa] hover:text-[#179649]"
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="ml-6 flex flex-col space-y-1 bg-white p-2 border border-gray-200 shadow-md">
            {settingsItems.map((item) => (
              <DropdownMenuItem
                key={item.name}
                className={`text-[12px] py-2 px-4 rounded cursor-pointer ${
                  isActive(item.href)
                    ? "bg-[#179649] text-white"
                    : "text-[#68706a] hover:bg-gray-100"
                }`}
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Logout at bottom */}
      <div className="px-4 py-4 mt-auto border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 px-4 rounded-lg font-medium text-[#e5102e] hover:bg-[#feecee] hover:text-[#e5102e] transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
