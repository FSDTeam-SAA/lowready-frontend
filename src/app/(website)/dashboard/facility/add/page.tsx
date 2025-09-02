import ManageFacilityPage from '@/components/dashboard/facility/addfacility'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading </div>}>
        <ManageFacilityPage />
        
    </Suspense>
  )
}

export default page