"use client";

import type React from "react";

import {
  Calendar,
  TrendingUp,
  Star,
  MapPin,
  Building2,
  Users,
} from "lucide-react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", earnings: 5, bookings: 10 },
  { month: "Feb", earnings: 100, bookings: 60 },
  { month: "Mar", earnings: 105, bookings: 25 },
  { month: "Apr", earnings: 125, bookings: 90 },
  { month: "May", earnings: 175, bookings: 120, highlight: true },
  { month: "Jun", earnings: 30, bookings: 50 },
  { month: "Jul", earnings: 175, bookings: 140 },
  { month: "Aug", earnings: 225, bookings: 160 },
  { month: "Sep", earnings: 50, bookings: 10 },
  { month: "Oct", earnings: 200, bookings: 150 },
  { month: "Nov", earnings: 175, bookings: 30 },
  { month: "Dec", earnings: 150, bookings: 120 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#22c55e", // green
  },
  bookings: {
    label: "Bookings",
    color: "#E6E7E6",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <main role="main" className="p-0  bg-gray-50  ">
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Upcoming Tours"
            value="12"
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

        {/* Charts + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Earnings Chart */}
          <Card className="lg:col-span-8 bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Total Earning
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    $9,234
                  </span>
                  <span className="text-sm text-gray-500">May</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">March, 2025</span>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart
                  data={chartData}
                  margin={{ left: 0, right: 0, top: 20, bottom: 20 }}
                  width={500} // optional, will be overridden by responsive container
                  height={300}
                >
                  <defs>
                    {/* Earnings Gradient (Green) */}
                    <linearGradient
                      id="earningsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#22c55e"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    {/* Bookings Gradient (Gray) */}
                    <linearGradient
                      id="bookingsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#E6E7E6" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#E6E7E6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs text-gray-500"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={4}
                    tickFormatter={(value) => `$${value}`}
                    className="text-xs text-gray-500"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent labelKey="month" />}
                  />

                  {/* Earnings (Green) */}
                  <Area
                    dataKey="earnings"
                    type="monotone"
                    fill="url(#earningsGradient)"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#22c55e",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />

                  {/* Bookings (Gray) */}
                  <Area
                    dataKey="bookings"
                    type="monotone"
                    fill="url(#bookingsGradient)"
                    stroke="#E6E7E6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#E6E7E6",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Upcoming Tours */}
          <Card className="lg:col-span-4 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Upcoming tours
              </CardTitle>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                See all
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        OR
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Olivia Rhye
                      </p>
                      <p className="text-xs text-gray-500">
                        example@example.com
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                    Details
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bookings & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Bookings
              </CardTitle>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                See all
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        OR
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Olivia Rhye
                      </p>
                      <p className="text-xs text-gray-500">
                        example@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        $2,000
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> 2715 Ash Dr, San Jose,
                        South Dakota
                      </p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Reviews
              </CardTitle>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                See all
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((_, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          CD
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Connect Directly
                        </p>
                        <p className="text-xs text-gray-500">Portland, OR</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    I &apos; ve been ordering from TABLEFRESH for over a year
                    now, and the quality of their organic produce is
                    consistently excellent.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-green-600 font-medium">{change}</p>
      </CardContent>
    </Card>
  );
}
