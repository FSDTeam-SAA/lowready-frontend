"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface VisitorCounterProps {
  facilityId: string
}

async function fetchVisitorSummary(facilityId: string, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/facility/summary/${facilityId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch visitor summary")
  }

  const data = await response.json()
  return data.data
}

export function VisitorCounter({ facilityId }: VisitorCounterProps) {
  const { data: session } = useSession()
  const token = session?.accessToken

  const { data, isLoading, isError } = useQuery({
    queryKey: ["facility-summary", facilityId],
    queryFn: () => fetchVisitorSummary(facilityId, token as string),
    enabled: !!token, // Fetch only when token exists
  })

  // if (isLoading) {
  //   return (
  //     <div className="bg-white rounded-lg p-6 border border-gray-200">
  //       <p>Loading visitor summary...</p>
  //     </div>
  //   )
  // }

  // if (isError || !data) {
  //   return (
  //     <div className="bg-white rounded-lg p-6 border border-gray-200">
  //       <p>Failed to load visitor summary</p>
  //     </div>
  //   )
  // }

  // ✅ Safe to access after loading
 const totalVisitors = data?.visitTour ?? 6
const totalPlacements = data?.facilityBookings ?? 3

  const percentage = totalVisitors > 0 ? (totalPlacements / totalVisitors) * 100 : 0
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const month = new Date().toLocaleString("default", { month: "long" })
  const year = new Date().getFullYear()

  return (
    <div className="bg-white rounded-lg p-4 border h-[400px] border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Visitor Counter</h3>
        <div className="text-sm text-gray-600">
          {month}, {year}
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#22c55e"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Total Visitors</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalPlacements.toLocaleString()}</div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Total Placements</span>
          </div>
        </div>
      </div>
    </div>
  )
}
