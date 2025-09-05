"use client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Building2 } from "lucide-react";
import React from "react";
import { getDashboardSummery, DashboardSummary } from "@/lib/api";

// --- StatCard ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4">
      <div>
        <h4 className="text-sm font-semibold text-[#343A40]">{title}</h4>
        <p className="text-xl md:text-[32px] font-bold pt-2">{value}</p>
      </div>
      <div className="p-3 h-[60px] w-[60px] text-green-300">{icon}</div>
    </div>
  );
};

// --- Main Component ---
const EarningSummeryTop = () => {
  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ["dashboardsummery"],
    queryFn: getDashboardSummery,
  });

  const datas = data?.data;

  if (isLoading) {
    return <p className="p-5">Loading dashboard summary...</p>;
  }

  if (error) {
    return <p className="p-5 text-red-500">Error loading summary</p>;
  }

  return (
    <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Placements"
          value={String(datas?.totalBookings ?? 0)}
          icon={<Building2 className="h-6 w-6 text-green-500" />}
        />

        <StatCard
          title="Total Earnings"
          value={`$${datas?.totalEarnings ?? 0}`}
          icon={<Users className="h-6 w-6 text-green-500" />}
        />

        <div className="p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4">
          <div>
            <h4 className="text-sm font-semibold text-[#343A40]">
              Referral Fee (18%)
            </h4>
            <p className="text-xl md:text-[32px] font-bold text-[#E5102E] pt-2">{`-$${(
              (datas?.totalEarnings ?? 0) * 0.18
            ).toFixed(2)}`}</p>
          </div>
          <div className="p-3 h-[60px] w-[60px] text-green-300">
            {<TrendingUp className="h-6 w-6 text-green-500" />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarningSummeryTop;
