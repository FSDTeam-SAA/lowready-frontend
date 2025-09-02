"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PricingModal } from "@/components/dashboard/facility/pricing-modal";
import { Search, Plus } from "lucide-react";
import type { Facility } from "@/types/servicefacility";
import { useRouter } from "next/navigation";
import FacilityListing from "@/components/dashboard/facility/all-facility";

export default function ManageFacilityPage() {
  const router = useRouter();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [facilities] = useState<Facility[]>([]);

  // const sampleFacility: Facility = {
  //   id: "1",
  //   name: "Sunny Hills Assisted Living",
  //   location: "1322 North Main Street, North Port, FL 34286",
  //   description:
  //     "Sunny Hills Assisted Living offers a warm and welcoming environment for seniors, providing personalized care, comfortable accommodations, and a variety of daily activities. With 24/7 professional support, nutritious meals, and engaging social programs",
  //   price: 2200,
  //   priceType: "Monthly",
  //   availability: "Available",
  //   image:
  //     "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Manage%20Facility-HXab6F2NKa2yiDUhJRCgm6HUQIhU1S.png",
  //   amenities: [
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //     "Ameni...",
  //   ],
  //   careServices: [],
  //   amenityServices: [],
  //   about: {
  //     description: "",
  //   },
  //   availableTimes: [],
  // }

  const handleAddFacility = () => {
    if (!isSubscribed) {
      setShowPricingModal(true);
    } else {
      router.push("/dashboard/facility/add");
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    // Simulate subscription process
    setTimeout(() => {
      router.push("/dashboard/facility/add");
    }, 500);
  };

  // const handleEditFacility = () => {
  //   router.push("/dashboard/facility/add")
  // }

  const hasFacilities =
    facilities.length > 0 ||
    (typeof window !== "undefined" &&
      window.location.search.includes("demo=true"));
  // const displayFacilities = facilities.length > 0 ? facilities : [sampleFacility];

  return (
    <div className="flex  bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          {hasFacilities ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Search className="h-8 w-8 text-gray-400" />
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
            // Facilities View
            <div className="space-y-6">
              <FacilityListing />
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
  );
}
