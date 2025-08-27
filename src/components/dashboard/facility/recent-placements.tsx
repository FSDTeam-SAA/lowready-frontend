"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import type { Placement } from "@/types/servicefacility"

interface RecentPlacementsProps {
  placements: Placement[]
}

export function RecentPlacements({ placements }: RecentPlacementsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Placements</h3>
        <Button variant="link" className="text-green-600 p-0 h-auto">
          See all
        </Button>
      </div>

      <div className="space-y-4">
        {placements.map((placement) => (
          <div key={placement.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={placement.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {placement.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">{placement.user.name}</div>
                <div className="text-sm text-gray-600">{placement.user.email}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{placement.location}</span>
              </div>
              <div className="font-semibold text-gray-900">${placement.amount.toLocaleString()}</div>
            </div>

            <Button size="sm" variant="outline" className="text-green-600 border-green-600 bg-transparent">
              Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
