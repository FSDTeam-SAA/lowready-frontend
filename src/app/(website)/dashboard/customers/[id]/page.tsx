"use client"

import React from "react"
import { useParams } from "next/navigation"
import CustomersDetails from "@/components/dashboard/customers/customersDetails/CustomersDetails"

const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams()
  const customerId = typeof id === "string" ? id : ""

  return (
    <div className="space-y-6 p-6">
      <CustomersDetails id={customerId} />
    </div>
  )
}

export default CustomerDetailsPage
