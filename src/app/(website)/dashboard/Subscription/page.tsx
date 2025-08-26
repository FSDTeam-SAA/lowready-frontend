import HistoryTable from '@/components/dashboard/subscription/HistoryTable'
import SubStats from '@/components/dashboard/subscription/SubStats'
import React from 'react'

const page = () => {
  return (
    <div >
        <SubStats />
        <HistoryTable />
    </div>
  )
}

export default page