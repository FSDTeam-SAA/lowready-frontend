"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function DashboardHeader() {
  const { data: session, status } = useSession();
  console.log(`session data ${session}, status data ${status}`);

  return (
    <header className="flex w-full items-center justify-between  text-black bg-white shadow-xl p-4 backdrop-blur-xl">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div>
        <p>notification icon</p>

        <div className="flex items-center gap-4">
          <Image
            className=" rounded-[50%]"
            src={"/dashboard/profile.png"}
            alt="profile"
            width={70}
            height={70}
          />
          <div>
            <h2>Habibulla</h2>
            <p>mdhabibullascaleup@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
