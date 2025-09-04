"use client"

import {  useState } from "react"
import { Button } from "@/components/ui/button"
import { PricingModal } from "@/components/dashboard/facility/pricing-modal"
import { Search, Plus, Loader2 } from "lucide-react"
import type { Facility } from "@/types/servicefacility"
import { useRouter } from "next/navigation"
import FacilityListing from "@/components/dashboard/facility/all-facility"
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus"
import { useSession } from "next-auth/react"


export default function ManageFacilityPage() {
  const router = useRouter()
  const { status: sessionStatus } = useSession()
  const [facilities] = useState<Facility[]>([])
  
  // Add search state
  const [searchFilters, setSearchFilters] = useState({
    selectedOption: "All Facilities",
    selectedAmenities: [] as string[]
  })
  
  const {
    isSubscriptionActive,
    showPricingModal,
    loading,
    error,
    closePricingModal,
    openPricingModal,
    setShowPricingModal,
  } = useSubscriptionStatus()


  const handleAddFacility = () => {
    if (!isSubscriptionActive) {
      openPricingModal()
    } else {
      router.push("/dashboard/facility/add");
    }
  };

  const handleSubscribe = () => {
    // Close the pricing modal
    closePricingModal()
    // Simulate subscription process
    setTimeout(() => {
      router.push("/dashboard/facility/add");
    }, 500);
  };



  // Show loading state while session or subscription status is loading
  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error fetching subscription status
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (sessionStatus === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const hasFacilities =
    facilities.length > 0 ||
    (typeof window !== "undefined" &&
      window.location.search.includes("demo=true"));
  // const displayFacilities = facilities.length > 0 ? facilities : [sampleFacility];

  return (
    <div className="flex bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          {hasFacilities ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {/* <Search className="h-8 w-8 text-gray-400" /> */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Facility found
                </h3>
                <p className="text-gray-600 mb-8">
                  Currently, you haven&apos;t added any facilities. Start by
                  creating your facility to showcase your service.
                </p>
                <Button
                  onClick={handleAddFacility}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              </div>
            </div>
          ) : (
            // Facilities View - Pass search filters as props
            <div className="space-y-6">
              <FacilityListing 
                searchFilters={searchFilters}
                onFiltersChange={setSearchFilters}
              />
            </div>
          )}
        </main>
      </div>

      <PricingModal 
        open={showPricingModal} 
        onOpenChange={setShowPricingModal} 
        onSubscribe={handleSubscribe} 
      />
    </div>
  )
}