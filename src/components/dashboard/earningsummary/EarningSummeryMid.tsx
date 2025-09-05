"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ApiEarningsData {
  month: number;
  totalEarnings: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiEarningsData[];
}

interface ChartDataItem {
  month: string;
  earnings: number;
  bookings: number;
}

const chartConfig: ChartConfig = {
  earnings: {
    label: "Earnings",
    color: "#22c55e",
  },
  bookings: {
    label: "Bookings",
    color: "#E6E7E6",
  },
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const EarningSummeryMid = () => {
  const { data: session, status } = useSession();
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchEarningsData = async () => {
    if (!session?.accessToken) {
      setError('Access token not available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/dashboard/org-dashboard/total/earnings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      const transformedData: ChartDataItem[] = result.data.map((item) => ({
        month: monthNames[item.month - 1] || `M${item.month}`,
        earnings: item.totalEarnings,
        bookings: 0, // Remove if not needed
      }));

      setChartData(transformedData);
      setTotalEarnings(result.data.reduce((sum, item) => sum + item.totalEarnings, 0));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchEarningsData();
    } else if (status === 'unauthenticated') {
      setError('Authentication required');
      setIsLoading(false);
    }
  }, [session, status]);

  const getCurrentMonth = () => monthNames[new Date().getMonth()];
  const getCurrentYear = () => new Date().getFullYear();

  if (status === 'loading') {
    return (
      <section>
        <div className="pt-6 px-5">
          <Card className="bg-white">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Authenticating...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <section>
        <div className="pt-6 px-5">
          <Card className="bg-white">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-amber-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-gray-600">Please log in to view earnings data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section>
        <div className="pt-6 px-5">
          <Card className="bg-white">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading earnings...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="pt-6 px-5">
          <Card className="bg-white">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchEarningsData}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="pt-6 px-5">
        <Card className="bg-white p-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Total Earning
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">
                  ${totalEarnings.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">{getCurrentMonth()}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {getCurrentMonth()}, {getCurrentYear()}
              </span>
              
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <AreaChart
                data={chartData}
                margin={{ left: 0, right: 0, top: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E6E7E6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#E6E7E6" stopOpacity={0.05} />
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
      </div>
    </section>
  );
};

export default EarningSummeryMid;