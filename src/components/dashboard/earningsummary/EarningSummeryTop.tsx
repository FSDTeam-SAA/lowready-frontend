import { Calendar, TrendingUp, Users, Building2 } from "lucide-react"
import React from "react"

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  bgColor?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon,  }) => {
  return (
    <div className={`p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4 `}>
     
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
        <span className="text-xs text-green-600">{change}</span>
      </div>
       <div className="p-3  text-green-300">{icon}</div>
    </div>
  )
}

const EarningSummeryTop = () => {
  return (
    <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Placements"
          value="123"
          change="+36% from the last month"
          icon={<Building2 className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Placements"
          value="123"
          change="+36% from the last month"
          icon={<Calendar className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Residents Served"
          value="123"
          change="+36% from the last month"
          icon={<Users className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Earnings"
          value="$1,234"
          change="+36% from the last month"
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50"
        />
      </div>
    </section>
  )
}

export default EarningSummeryTop
