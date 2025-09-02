"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Dot, Edit } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Props interface
interface SingleFacilityDetailsProps {
  facilityId: string;
}

// Facility data interface
interface Facility {
  _id: string;
  availability: boolean | string;
  name: string;
  location: string;
  description: string;
  price: number;
  base?: string;
  amenities: string[];
  images: Array<{
    public_id?: string;
    url: string;
    _id?: string;
  }>;
  userId?: string;
  offers?: string[];
  services?: string[];
  about?: string;
  videoTitle?: string;
  videoDescription?: string;
  uploadVideo?: string;
  availableTime?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Mock fallback data
const mockFacility: Facility = {
  _id: "68a8dab1433551ba57f8e05d",
  availability: true,
  name: "Sunny Hills Assisted Living",
  location: "1322 North Main Street, North Port, FL 34286",
  description:
    "Sunny Hills Assisted Living offers a warm and welcoming environment for seniors, providing personalized care, comfortable accommodations, and a variety of daily activities. With 24/7 professional support, nutritious meals, and engaging social programs.",
  price: 2200,
  base: "Monthly",
  amenities: [
    "Air Conditioning",
    "Wi-Fi",
    "Parking",
    "Laundry Service",
    "Meal Service",
    "Transportation",
    "24/7 Care",
    "Activity Programs",
    "Medical Support",
    "Housekeeping",
    "Beauty Salon",
    "Fitness Center",
  ],
  images: [
    {
      url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ],
};

// Fetch function with Authorization header
const fetchFacility = async (
  facilityId: string,
  token: string
): Promise<Facility> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/facility/${facilityId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || "Failed to fetch facility");
  }
};

const SingleFacilityDetails: React.FC<SingleFacilityDetailsProps> = ({
  facilityId,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const token = session?.accessToken as string | undefined;

  // Query only runs if token exists
  const {
    data: facility,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["facility", facilityId, token],
    queryFn: () => {
      if (!token) throw new Error("No access token found");
      return fetchFacility(facilityId, token);
    },
    enabled: !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const handleEdit = () => {
    router.push(`/dashboard/facility/edit/${facilityId}`);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-600">Loading session...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading facility details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Facility
        </h3>
        <p className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
        <p className="text-sm text-gray-500 mb-4">Showing demo data instead</p>
      </div>
    );
  }

  const facilityData = facility || mockFacility;

  const isAvailable =
    facilityData.availability === true || facilityData.availability === "true";
  const availabilityText = isAvailable ? "Available" : "Unavailable";
  const availabilityColor = isAvailable ? "text-green-500" : "text-gray-400";

  let amenitiesList: string[] = [];
  if (Array.isArray(facilityData.amenities)) {
    amenitiesList = facilityData.amenities.flatMap((item) => {
      if (
        typeof item === "string" &&
        item.startsWith("[") &&
        item.endsWith("]")
      ) {
        try {
          return JSON.parse(item);
        } catch (e) {
          return [item];
        }
      }
      return item;
    });
  }

 
return (
  <div className="bg-gray-50 ">
    <div className="mx-auto px-3 sm:px-4  lg:px-8">
      {/* Main Card - Horizontal Layout */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col h-[500px] lg:flex-row">
          {/* Left Column - Image */}
          <div className="lg:w-2/5">
            <div className="relative h-64 lg:h-full">
              <Image
                src={
                  facilityData.images && facilityData.images.length > 0
                    ? facilityData.images[0].url
                    : "/api/placeholder/400/300"
                }
                alt={facilityData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-3/5 p-6 flex flex-col justify-between space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {facilityData.name}
            </h1>
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{facilityData.location}.</span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <Dot className={`w-6 h-6 ${availabilityColor}`} />
              <span className="text-gray-600">- {availabilityText}</span>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                - {facilityData.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {amenitiesList.slice(0, 10).map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-2 rounded-lg text-center"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {typeof amenity === "string"
                        ? amenity.substring(0, 6) + "..."
                        : "Ameni..."}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  $ {facilityData.price?.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">
                  / {facilityData.base || "Month"}
                </span>
              </div>
               
                <Button
                  onClick={handleEdit}
                  className="bg-green-500 hover:bg-green-700  cursor-pointer text-white px-4 py-2"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Button>
               
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default SingleFacilityDetails;
