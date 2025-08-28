import React from "react"
import Image, { StaticImageData } from "next/image"

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: string | StaticImageData   // supports public SVGs
  bgColor?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="p-4 rounded-lg justify-between bg-white border-2 flex items-center gap-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
        <span className="text-xs text-green-600">{change}</span>
      </div>
      <div className="p-3">
        <Image src={icon} alt="icon" width={32} height={32} />
      </div>
    </div>
  )
}

const ReferralFeeTop = () => {
  return (
    <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Residents Served"
          value="123"
          change="+36% from the last month"
          icon="/referal1.svg"   // ✅ direct from public folder
        />
        <StatCard
          title="Total Placements"
          value="123"
          change="+36% from the last month"
          icon="/referal2.svg"
        />
        <StatCard
          title="Total Earnings"
          value="$12,234"
          change="+36% from the last month"
          icon="/referal3.svg"
        />
        <StatCard
          title="Referral Fee (18%)"
          value="-$2,450"
          change="+36% from the last month"
          icon="/referal.svg"
        />
      </div>
    </section>
  )
}

export default ReferralFeeTop
