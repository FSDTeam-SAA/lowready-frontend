import { RecentPlacements } from '@/components/dashboard/facility/recent-placements'
import { RecentReviews } from '@/components/dashboard/facility/recent-reviews'
import SingleFacilityDetails from '@/components/dashboard/facility/singleFacilityDetails'
import { VisitorCounter } from '@/components/dashboard/facility/visitor-counter'
import React from 'react'

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="mx-auto p-0 ">
        {/* Main layout grid */}
        <div className="grid grid-cols-12   ">
          {/* Left column - Facility details */}
          <div className="col-span-12 lg:col-span-10">
            <SingleFacilityDetails facilityId={params.id} />
          </div>
          
          {/* Right column - Visitor counter */}
          <div className="col-span-12 lg:col-span-2 px-2 py-2">
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