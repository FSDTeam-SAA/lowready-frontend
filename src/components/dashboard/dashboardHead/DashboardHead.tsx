"use client";

import { useState } from "react";
import { BellDot } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    description: "Welcome back! Here's what's happening with your app today.",
  },
  {
    name: "Placements",
    href: "/placements",
    description: "Keep your reservations organized and manage them seamlessly.",
  },
  {
    name: "Tour Requests",
    href: "/tourrequest",
    description:
      "Easily manage upcoming tours and provide a smooth experience.",
  },
  {
    name: "Customers",
    href: "/customers",
    description: "View and manage all your registered customers in one place.",
  },
  {
    name: "Manage Facility",
    href: "/facility",
    description:
      "Keep track of all your facilities, update details, and stay organized.",
  },
  {
    name: "Earnings Summary",
    href: "/earningsummary",
    description: "Track your facility growth and community engagement easily.",
  },
  {
    name: "Referral Fee",
    href: "/referralfee",
    description: "Track your facility growth and community engagement easily.",
  },
  {
    name: "Review Ratings",
    href: "/reviewratings",
    description: "Manage ratings and respond to family feedback.",
  },
  {
    name: "Profile",
    href: "/profile",
    description:
      "Keep track of all your facilities, update details, and stay organized.",
  },
  {
    name: "Change Password",
    href: "/change-password",
    description:
      "Keep track of all your facilities, update details, and stay organized.",
  },
  {
    name: "Document",
    href: "/document",
    description:
      "Upload and manage your verification documents to get approved on our platform",
  },
  {
    name: "Subscription",
    href: "/Subscription",
    description: "Stay updated with the latest alerts and messages.",
  },
];

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Grab current page name (last segment of the path)
  const currentPage = pathname?.split("/").filter(Boolean).pop() || "dashboard";

  // Match the active navigation item
  const activePage =
    navigation.find((nav) => nav.href.endsWith(currentPage)) ||
    navigation.find((nav) => nav.href === "/dashboard");

  return (
    <>
      <header className="flex w-full items-center justify-between bg-white text-black p-4 backdrop-blur-xl">
        <div>
          <h1 className="text-[24px] font-bold capitalize bg-gradient-to-r from-[#28A745] to-[#CEF3D6] bg-clip-text text-transparent">
            {activePage?.name || "Dashboard"}
          </h1>

          <p className="text-sm pt-2 text-gray-600">
            {activePage?.description || "Welcome to your dashboard."}
          </p>
        </div>

        <div className="flex items-center gap-6 pr-10">
          <BellDot
            className="h-6 w-6 text-gray-600 cursor-pointer"
            onClick={() => setOpen(true)}
          />

          <div className="flex items-center gap-4">
            <Image
              className="rounded-full"
              src={session?.user?.image || "/dashboard/profile.png"}
              alt="profile"
              width={50}
              height={50}
            />

            <div>
              <h2 className="text-[16px] font-medium text-[#343A40] leading-[150%]">
                {session?.user?.name}
              </h2>
              <p className="text-[12px] font-normal text-[#8E938F] leading-[150%]">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              🎉 You don’t have any new notifications right now.  
              Stay tuned for updates!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
