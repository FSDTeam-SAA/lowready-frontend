"use client"

interface VisitorCounterProps {
  totalVisitors: number
  totalPlacements: number
  month: string
  year: number
}

export function VisitorCounter({ totalVisitors, totalPlacements, month, year }: VisitorCounterProps) {
  const percentage = totalPlacements > 0 ? (totalPlacements / totalVisitors) * 100 : 0
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Visitor Counter</h3>
        <div className="text-sm text-gray-600">
          {month}, {year}
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            {/* Progress circle */}
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
