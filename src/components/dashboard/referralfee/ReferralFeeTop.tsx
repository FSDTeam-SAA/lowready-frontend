"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSummary, getDashboardSummery } from "@/lib/api";
import { Building2, TrendingUp, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode; // always a ReactNode
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-xl md:text-[32px] font-bold">{value}</p>
        {change && <span className="text-xs text-green-600">{change}</span>}
      </div>
      <div className="p-3 h-[60px] w-[60px] text-green-300 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

const ReferralFeeTop = () => {
  const { data } = useQuery<DashboardSummary>({
    queryKey: ["dashboardsummery"],
    queryFn: getDashboardSummery,
  });

  const datas = data?.data;
  console.log(datas);

  return (
    <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Residents Served"
          value={`${datas?.residentsServed}`}
          icon={<Users className="h-6 w-6 text-green-500" />}
        />
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

export default ReferralFeeTop;
