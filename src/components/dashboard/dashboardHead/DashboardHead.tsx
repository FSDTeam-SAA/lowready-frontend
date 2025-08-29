"use client";

import { BellDot } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

console.log(pathname);

// Split the path and filter out empty segments
const segments = pathname?.split("/").filter(Boolean) || [];

// Default page
let currentPage = "Dashboard";

if (segments.length === 0) {
  currentPage = "Dashboard";
} else if (segments.length > 1) {
  // If the last segment looks like an ID, show the parent instead
  const lastSegment = segments[segments.length - 1];
  const isId = /^[0-9a-fA-F]{8,}$/.test(lastSegment); // basic hex id check
  currentPage = isId ? segments[segments.length - 2] : lastSegment;
} else {
  currentPage = segments[segments.length - 1];
}


  return (
    <header className="flex w-full items-center justify-between bg-white text-black  p-4 backdrop-blur-xl">
      <h1 className="text-[24px] text-[#28A745] font-bold capitalize">
        {currentPage}
      </h1>

      <div className="flex items-center gap-6">
        <BellDot className="h-6 w-6 text-gray-600 cursor-pointer" />

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
  );
}
