"use client";

import { useState, useEffect } from "react";
import { BellDot, Key, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

type UserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: { url?: string };
};

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [userData, setUserData] = useState<UserData>({});

  // Fetch organization avatar if role is "organization"
  useEffect(() => {
    async function fetchOrgImage() {
      if (session?.user?.role === "organization" && session?.user?.id) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${session.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
          const data = await res.json();
          // console.log("This is data", data);
          const imageUrl = data?.data?.avatar?.url;
          setUserData(data?.data);
          setProfileImage(imageUrl);
        } catch (err) {
          console.error("Failed to fetch organization avatar:", err);
        }
      } else if (session?.user?.image) {
        // setProfileImage(session.user.image);
      }
    }
    fetchOrgImage();
  }, [session]);

  const currentPage = pathname?.split("/").filter(Boolean).pop() || "dashboard";
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

        <div className="flex  items-center gap-6 pr-10">
          <Link href={`/dashboard/notifications`}>
            <BellDot className="h-6 w-6 text-gray-600 cursor-pointer" />
          </Link>

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-4 cursor-pointer">
                  {/* <div className="h-12 w-12 rounded-full overflow-hidden"> */}
                  {/* <Image
                      src={profileImage}
                      alt="profile"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    /> */}
                  <Avatar className="h-12 w-12 border-4 border-white shadow-lg object-cover">
                    <AvatarImage src={profileImage} alt={session?.user?.name} />
                    <AvatarFallback className="text-base font-semibold">
                      {(userData.firstName?.[0] ?? "") +
                        (userData.lastName?.[0] ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  {/* </div> */}
                  <div className="hidden md:flex flex-col">
                    <h2 className="text-[16px] font-medium text-[#343A40] leading-[150%]">
                      {userData?.firstName} {userData?.lastName}
                    </h2>
                    <p className="text-[12px] font-normal text-[#8E938F] leading-[150%]">
                      {userData?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" forceMount className="w-56">
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <User size={18} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/change-password")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <Key size={18} /> Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpenLogoutModal(true)}
                  className="cursor-pointer flex items-center gap-2 text-red-500"
                >
                  <LogOut size={18} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Notification Modal */}
      <Dialog open={openNotifications} onOpenChange={setOpenNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              🎉 You don’t have any new notifications right now. Stay tuned for
              updates!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      <Dialog open={openLogoutModal} onOpenChange={setOpenLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => signOut()}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
