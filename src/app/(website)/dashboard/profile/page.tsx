"use client";

import { PersonalInformationForm } from '@/components/dashboard/profile/personal-information-form'
import ProfileCard from '@/components/dashboard/profile/profile-card'
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

const DashboardProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if user is not authorized
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "organization") {
      router.push("/"); // or a custom Unauthorized page
    }
  }, [status, session, router]);

  // Show loading while session is being fetched or redirecting
  if (status === "loading" || (status === "authenticated" && session?.user.role !== "organization")) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-5">
      {/* Profile Card */}
      <div className="w-full lg:w-1/3">
        <ProfileCard />
      </div>

      {/* Personal Info Form */}
      <div className="w-full lg:w-2/3">
        <PersonalInformationForm />
      </div>
    </div>
  )
}

export default DashboardProfilePage;
