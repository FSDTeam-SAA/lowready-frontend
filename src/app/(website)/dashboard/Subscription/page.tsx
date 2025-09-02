import HistoryTable from '@/components/dashboard/subscription/HistoryTable'
import SubStats from '@/components/dashboard/subscription/SubStats'
import React from 'react'

const page = () => {
  return (
    <div >
      <div className="p-4">

        <SubStats />
        <HistoryTable />
      </div>
    </div>
  )
}

export default page