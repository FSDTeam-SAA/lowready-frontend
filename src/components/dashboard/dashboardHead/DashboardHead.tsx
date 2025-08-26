"use client";
import { BellDot } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathName = usePathname();

  // Extract last segment after "/"
  const lastPath = pathName?.split("/").filter(Boolean).pop() || "Dashboard";

  const userName = session?.user?.name ?? "Guest";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "/dashboard/profile.png";

  return (
    <header className="flex w-full items-center justify-between text-black bg-white  p-4 backdrop-blur-xl">
      <h1 className="text-xl font-bold capitalize">{lastPath}</h1>
      <div className="flex items-center gap-6">
        <Link href={"/dashboard/notification"} className="relative">
          <BellDot />
        </Link>
        <div className="flex items-center gap-4">
          <Image
            className="rounded-full"
            src={userImage}
            alt="profile"
            width={50}
            height={50}
          />
          <div>
            <h2 className="font-semibold">{userName}</h2>
            <p className="text-sm text-gray-600">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
