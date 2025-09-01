import { RecentPlacements } from '@/components/dashboard/facility/recent-placements'
import { RecentReviews } from '@/components/dashboard/facility/recent-reviews'
import SingleFacilityDetails from '@/components/dashboard/facility/singleFacilityDetails'
import { VisitorCounter } from '@/components/dashboard/facility/visitor-counter'
import React from 'react'

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="p-8 bg-gray-50 h-auto">
      <div className="mx-auto p-0 space-y-3 flex flex-col gap-8 h-auto overflow-hidden">
        {/* Main layout grid */}
        <div className="grid grid-cols-12  min-h-[528px] ">
          {/* Left column - Facility details */}
          <div className="col-span-12 lg:col-span-9">
            <SingleFacilityDetails facilityId={params.id} />
          </div>
          
          {/* Right column - Visitor counter */}
          <div className="col-span-12 lg:col-span-3 ">
            <VisitorCounter facilityId={params.id} />
          </div>
        </div>
        
        {/* Bottom section - Recent placements and reviews */}
        <div className="grid grid-cols-12  gap-5">
          {/* Recent Placements */}
          <div className="col-span-12 lg:col-span-6">
            <RecentPlacements facilityId={params.id} />
          </div>
          
          {/* Recent Reviews */}
          <div className="col-span-12 lg:col-span-6">
            <RecentReviews facilityId={params.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page