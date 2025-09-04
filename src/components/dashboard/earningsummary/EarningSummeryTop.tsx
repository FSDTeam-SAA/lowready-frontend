import { Calendar, TrendingUp, Users, Building2 } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  
  icon: React.ReactNode;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div
      className={`p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4 `}
    >
      <div>
        <h4 className="text-sm font-semibold  text-gray-[#343A40]">{title}</h4>
        <p className="text-xl font-bold pt-2">{value}</p>
      </div>
      <div className="p-3 h-[60px] w-[60px] text-green-300">{icon}</div>
    </div>
  );
};

const EarningSummeryTop = () => {
  return (
    <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Placements"
          value="123"
          icon={<Building2 className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Placements"
          value="123"
          icon={<Calendar className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Residents Served"
          value="123"
          icon={<Users className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Earnings"
          value="-$1,234"
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
      </div>
    </section>
  );
};

export default EarningSummeryTop;
