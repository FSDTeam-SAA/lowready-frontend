"use client";

import type React from "react";

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

const EarningSummeryMid = () => {
  return (
    <section>
      <div className="pt-[24px] px-5">
        {/* Earnings Chart */}
        <Card className="  bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Total Earning
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">$9,234</span>
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
      </div>
    </section>
  );
};

export default EarningSummeryMid;
