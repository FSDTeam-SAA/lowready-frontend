import {ArrowUp } from "lucide-react"
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
        <h4 className="text-sm lg:text-[20px] font-medium leading-[150%] text-[#343A40]">{title}</h4>
        <p className="text-xl lg:text-[32px] py-[12px] font-bold text-[#10421B]">{value}</p>
        <span className="text-xs text-[#208436] flex items-center gap-1">{change}{icon}</span>
      </div>
       
    </div>
  )
}


const ReviewRatingTop = () => {
  return (
      <section className="pt-8 px-5">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <StatCard
          title="5 Star Ratings"
          value="123"
          change="++ 36% from the last month"
          icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="4 Star Ratings"
          value="123"
          change="+36% from the last month"
          icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="3 Star Ratings"
          value="123"
          change="+36% from the last month"
          icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="2 Star Ratings"
          value="$1,234"
          change="+36% from the last month"
          icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          bgColor="bg-green-50"
        />
          <StatCard
          title="1 Star Ratings"
          value="$12"
          change="+36% from the last month"
          icon={<ArrowUp className="h-4 w-4 text-green-500" />}
          bgColor="bg-green-50"
        />
        
      </div>
    </section>
  )
}

export default ReviewRatingTop