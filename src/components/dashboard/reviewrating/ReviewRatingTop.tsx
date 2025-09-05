"use client";

import { getFacilities, reviewRatingsummery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

import { ArrowUp } from "lucide-react";
import React from "react";


interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4">
      <div>
        <h4 className="text-sm lg:text-[20px] font-medium leading-[150%] text-[#343A40]">
          {title}
        </h4>
        <p className="text-xl lg:text-[32px] py-[12px] font-bold text-[#10421B]">
          {value}
        </p>
        <span className="text-xs text-[#208436] flex items-center gap-1">
          {change}
          {icon}
        </span>
      </div>
    </div>
  );
};

const ReviewRatingTop = () => {
  const { data: facilityData, isLoading: isFacilitiesLoading, error: facilityError } =
    useQuery({
      queryKey: ["facilities"],
      queryFn: getFacilities,
    });

  const facilityId = facilityData?.data?.[0]?._id || "";
  const {
    data: reviewrating,
    isLoading: isRatingLoading,
    error: ratingError,
  } = useQuery({
    queryKey: ["reviewRating", facilityId],
    queryFn: () => reviewRatingsummery(facilityId),
    enabled: !!facilityId,
  });



  if (isFacilitiesLoading || isRatingLoading) {
    return <p className="p-5 text-gray-500">Loading...</p>;
  }

  if (facilityError || ratingError) {
    return <p className="p-5 text-red-500">Failed to load data.</p>;
  }

  const ratings = [5, 4, 3, 2, 1].map((star) => ({
    title: `${star} Star Ratings`,
    value: reviewrating?.ratings?.[star] || 0,
  }));

 

  return (
    <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {ratings.map((r, i) => (
          <StatCard
            key={i}
            title={r.title}
            value={r.value}
            change="+36% from last month" // Replace with dynamic value if available
            icon={<ArrowUp className="h-4 w-4 text-green-500" />}
            bgColor="bg-green-50"
          />
        ))}
      </div>
    </section>
  );
};

export default ReviewRatingTop;
