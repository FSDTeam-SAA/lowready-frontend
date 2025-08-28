"use client";

import { BellDot } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();


  const currentPage = pathname?.split("/").filter(Boolean).pop() || "Dashboard";

  return (
    <header className="flex w-full items-center justify-between bg-white text-black  p-4 backdrop-blur-xl">
      <h1 className="text-[24px] text-[#28A745] font-bold capitalize">
        {currentPage}
      </h1>
            {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae porro reiciendis dolorum quos dolor quia temporibus, maxime ad cumque, doloremque placeat deleniti! Excepturi quas enim sint velit officia dolorum esse recusandae, odio voluptate blanditiis? Quasi culpa ullam soluta, eligendi accusamus at quia maxime, architecto eveniet, voluptates eum. Sunt culpa mollitia ipsum, laboriosam modi sed impedit. Quasi asperiores voluptatum dignissimos ad labore, facere explicabo veritatis ea placeat delectus laboriosam voluptatem animi nisi doloribus esse rem et nihil minima iusto magnam sunt! Quam facilis ab culpa vitae molestias tenetur hic! Totam eaque omnis quasi consequatur nobis minima perferendis unde assumenda quas eveniet.</p> */}
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
