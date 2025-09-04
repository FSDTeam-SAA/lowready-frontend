
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Lock, Calendar, MapPin, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// 🚀 No leading slash needed
const navigation = [
  { name: "Profile", href: "profile", icon: User },
  { name: "Change Password", href: "change-password", icon: Lock },
  { name: "Placement History", href: "booking-history", icon: Calendar },
  { name: "Tour History", href: "tour-history", icon: MapPin },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter();
  const path = usePathname(); // 👉 gives full path, e.g. "/account/profile"

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch   {
      toast.error("Failed to logout");
    }
    setLogoutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex relative">
        {/* Sidebar */}
        <div
          className={cn(
            " inset-y-0 h-screen fixed left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-[30px]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center mx-auto">
              <Image
                src="/images/Logo.png"
                alt="log"
                width={100}
                height={100}
              />
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = path === `/account/${item.href}`;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-12 px-4 cursor-pointer rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#179649] text-white hover:bg-[#179649]"
                        : "text-[#68706a] hover:bg-[#f8f9fa] hover:text-[#179649]"
                    )}
                    onClick={() => {
                      router.push(`/account/${item.href}`);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                );
              })}
              {/* Logout button */}
              <div className="px-4 py-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full cursor-pointer justify-start gap-3 h-12 px-4 rounded-lg font-medium text-[#e5102e] hover:bg-[#feecee] hover:text-[#e5102e] transition-all duration-200"
                  onClick={() => setLogoutModalOpen(true)}
                >
                  <LogOut className="h-5 w-5 cursor-pointer" />
                  Log Out
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#179649] rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-semibold text-[#179649]">
                Aln<span className="text-[#343a40]">Hub</span>
              </span>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 lg:p-8 max-h-screen">{children}</main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Modal */}
      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-[#feecee] rounded-full flex items-center justify-center mb-4">
              <LogOut className="h-6 w-6 text-[#e5102e]" />
            </div>
            <DialogTitle className="text-center text-[#343a40]">
              Are You Sure?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
              className="flex-1 border-[#e6e7e6] cursor-pointer text-[#68706a] hover:bg-[#f8f9fa]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-[#e5102e] cursor-pointer hover:bg-[#c50e29] text-white"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
