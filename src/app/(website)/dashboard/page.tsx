"use client";

import type React from "react";
import { useState, useEffect } from "react";

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
import { useSession } from "next-auth/react";

// Month names for chart display
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Interfaces for API responses
interface EarningsData {
  month: number;
  totalEarnings: number;
}

interface StatsData {
  upcomingTours: number;
  totalBookings: number;
  totalEarnings: number;
  residentsServed: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

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
  const { data: session } = useSession();
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [statsData, setStatsData] = useState<StatsData>({
    upcomingTours: 0,
    totalBookings: 0,
    totalEarnings: 0,
    residentsServed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace with your actual base URL
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "YOUR_BASE_URL_HERE";

  // Fetch earnings data
  const fetchEarningsData = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Access token not found");
      }

      const response = await fetch(
        `${BASE_URL}/dashboard/org-dashboard/total/earnings`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<EarningsData[]> = await response.json();
      
      if (result.success) {
        setEarningsData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch earnings data");
      }
    } catch (err) {
      console.error("Error fetching earnings data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch earnings data");
    }
  };

  // Fetch stats data
  const fetchStatsData = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Access token not found");
      }

      const response = await fetch(
        `${BASE_URL}/dashboard/org-dashboard`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<StatsData> = await response.json();
      
      if (result.success) {
        setStatsData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch stats data");
      }
    } catch (err) {
      console.error("Error fetching stats data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats data");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (session?.accessToken) {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchEarningsData(),
          fetchStatsData()
        ]);
        
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.accessToken]);

  // Transform earnings data for chart
  const transformedChartData = earningsData.map((item) => ({
    month: monthNames[item.month - 1], // Convert month number to name
    earnings: item.totalEarnings,
    bookings: 0, // You'll need to get this data from another API or calculate it
  }));

  // Calculate current month's earnings
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthEarnings = earningsData.find(item => item.month === currentMonth)?.totalEarnings || 0;

  // // Calculate total year earnings
  // const totalYearEarnings = earningsData.reduce((sum, item) => sum + item.totalEarnings, 0);

  if (loading) {
    return (
      <main role="main" className="p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main role="main" className="p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main role="main" className="p-6 bg-gray-50">
      <div className="!px-[-2px] py-2 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Upcoming Tours"
            value={statsData.upcomingTours.toString()}
            change="+36% from the last month"
            icon={<Building2 className="h-6 w-6 text-green-500" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Total Placements"
            value={statsData.totalBookings.toString()}
            change="+36% from the last month"
            icon={<Calendar className="h-6 w-6 text-green-500" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Residents Served"
            value={statsData.residentsServed.toString()}
            change="+36% from the last month"
            icon={<Users className="h-6 w-6 text-green-500" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Total Earnings"
            value={`$${statsData.totalEarnings.toLocaleString()}`}
            change="+36% from the last month"
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            bgColor="bg-green-50"
          />
        </div>

        {/* Charts + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Earnings Chart */}
          <Card className="lg:col-span-8 bg-white p-2.5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Total Earning
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ${currentMonthEarnings.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {monthNames[currentMonth - 1]}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  {new Date().getFullYear()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart
                  data={transformedChartData}
                  margin={{ left: 0, right: 0, top: 20, bottom: 20 }}
                  width={500}
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

                  {/* Bookings (Gray) - You may want to remove this or get data from another API */}
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
          <Card className="lg:col-span-4 p-5 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Referral Savings 
              </CardTitle>
               
            </CardHeader>
            <CardContent className="space-y-3">
              {/* {[1, 2, 3, 4].map((_, idx) => (
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
              ))} */}
              <h2 className="text-[#10421B] font-bold text-6xl mx-auto text-center flex justify-center items-center" >$1,234</h2>
            </CardContent>
          </Card>
        </div>

        {/* Bookings & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="bg-white p-5">
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
          <Card className="bg-white p-5">
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
                    I&apos;ve been ordering from TABLEFRESH for over a year
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
    <Card className="bg-white border-0 shadow-sm flex flex-row justify-between items-center p-5">
      <div>

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-green-600 font-medium">{change}</p>
      </CardContent>
      </div>
        <div className={`p-2 rounded-lg w-[60px] h-[60px] flex items-center justify-center ${bgColor}`}>{icon}</div>
    </Card>
  );
}