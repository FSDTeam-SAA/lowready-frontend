/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Star, MapPin, Dot, Wifi, Trees, Plus, X, Filter } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

interface Facility {
  _id: string;
  name: string;
  location: string;
  description?: string;
  price?: number;
  base?: string;
  availability?: boolean | string;
  images?: { url: string }[];
  careServices?: string[];
  amenities?: string[];
  userId?: { firstName: string; lastName: string };
}

interface SearchFilters {
  selectedOption: string;
  selectedAmenities: string[];
}

interface FacilityListingProps {
  searchFilters?: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
}

interface FacilityCardProps {
  facility: Facility;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  const router = useRouter();
  const firstImage =
    facility.images && facility.images.length > 0
      ? facility.images[0].url
      : "/api/placeholder/400/200";
  const rating = 4.8;
  const reviewCount = 32;

  const isAvailable =
    facility.availability === true || facility.availability === "true";
  const availabilityText = isAvailable ? "Available" : "Unavailable";
  const availabilityColor = isAvailable ? "text-green-500" : "text-gray-400";

  const handleDetailsClick = () => {
    router.push(`/dashboard/facility/${facility._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          width={400}
          height={200}
          src={firstImage}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {facility.name}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
            <span className="text-sm text-gray-500">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{facility.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Dot className={`w-6 h-6 ${availabilityColor}`} />
          <span className="text-sm text-gray-600">{availabilityText}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {facility.amenities && facility.amenities.length > 0 ? (
            facility.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                <span>{amenity}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                <span>Private</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                <Wifi className="w-3 h-3" />
                <span>Wi-Fi</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                <Trees className="w-3 h-3" />
                <span>Garden</span>
              </div>
            </>
          )}
          {facility.amenities && facility.amenities.length > 3 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              <span>+{facility.amenities.length - 3} more</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              $ {facility.price?.toLocaleString() || "2,200"}
            </span>
            <span className="text-gray-500 ml-1">/Month</span>
          </div>
          <Button
            onClick={handleDetailsClick}
            className="bg-green-600 cursor-pointer hover:bg-green-800 text-white px-4 py-2"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const FacilityCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full" />

      <div className="p-6 space-y-4">
        {/* Title & Rating */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const FacilityListing: React.FC<FacilityListingProps> = ({ 
  searchFilters = { selectedOption: "All Facilities", selectedAmenities: [] },
  onFiltersChange 
}) => {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [showAmenityFilter, setShowAmenityFilter] = useState<boolean>(false);

  const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  useEffect(() => {
    fetchMyFacilities();
  }, []);

  // Extract unique amenities from facilities
  useEffect(() => {
    if (facilities.length > 0) {
      const amenitiesSet = new Set<string>();
      facilities.forEach(facility => {
        facility.amenities?.forEach(amenity => {
          if (amenity && amenity.trim()) {
            amenitiesSet.add(amenity.trim());
          }
        });
      });
      setAvailableAmenities(Array.from(amenitiesSet).sort());
    }
  }, [facilities]);

  const fetchMyFacilities = async () => {
    try {
      setLoading(true);

      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(`${BASE_URL}/facility/my-facilities`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch facilities");
      }

      const facilitiesData: Facility[] = result.data || [];
      setFacilities(facilitiesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching my facilities:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = () => {
    router.push("/dashboard/facility/add");
  };

  const handleOptionChange = (selectedOption: string) => {
    const newFilters = { ...searchFilters, selectedOption };
    onFiltersChange?.(newFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newSelectedAmenities = searchFilters.selectedAmenities.includes(amenity)
      ? searchFilters.selectedAmenities.filter(a => a !== amenity)
      : [...searchFilters.selectedAmenities, amenity];
    
    const newFilters = { ...searchFilters, selectedAmenities: newSelectedAmenities };
    onFiltersChange?.(newFilters);
  };

  const clearAmenityFilter = (amenity: string) => {
    const newSelectedAmenities = searchFilters.selectedAmenities.filter(a => a !== amenity);
    const newFilters = { ...searchFilters, selectedAmenities: newSelectedAmenities };
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = { selectedOption: "All Facilities", selectedAmenities: [] };
    onFiltersChange?.(newFilters);
  };

  // Filter facilities based on selected amenities
  const filteredFacilities = facilities.filter(facility => {
    // If no amenities are selected, show all facilities
    if (searchFilters.selectedAmenities.length === 0) {
      return true;
    }

    // Check if facility has any of the selected amenities
    return searchFilters.selectedAmenities.some(selectedAmenity =>
      facility.amenities?.some(facilityAmenity => 
        facilityAmenity.toLowerCase().includes(selectedAmenity.toLowerCase())
      )
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <select
                value={searchFilters.selectedOption}
                onChange={(e) => handleOptionChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Facilities</option>
                <option>Assisted Living</option>
                <option>Memory Care</option>
                <option>Independent Living</option>
              </select>

              <Button
                onClick={() => setShowAmenityFilter(!showAmenityFilter)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter by Amenities
                {searchFilters.selectedAmenities.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {searchFilters.selectedAmenities.length}
                  </span>
                )}
              </Button>
            </div>

            <Button
              onClick={handleAddFacility}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>

          {/* Amenity Filter Dropdown */}
          {showAmenityFilter && (
            <div className="bg-gray-50 border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Filter by Amenities</h3>
                {searchFilters.selectedAmenities.length > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={searchFilters.selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Selected Amenity Tags */}
          {searchFilters.selectedAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 font-medium">Filtered by:</span>
              {searchFilters.selectedAmenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{amenity}</span>
                  <button
                    onClick={() => clearAmenityFilter(amenity)}
                    className="hover:bg-green-200 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <FacilityCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
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
              Error Loading Your Facilities
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Try again later.</p>
            <button
              onClick={fetchMyFacilities}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-2 5h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchFilters.selectedAmenities.length > 0 
                ? "No Facilities Match Your Filters" 
                : "No Facilities Found"}
            </h3>
            <p className="text-gray-600">
              {searchFilters.selectedAmenities.length > 0 
                ? "Try removing some filters or adding facilities with these amenities."
                : "You haven't added any facilities yet."}
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              {searchFilters.selectedAmenities.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Clear Filters
                </Button>
              )}
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
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {filteredFacilities.length} of {facilities.length} facilities
                {searchFilters.selectedAmenities.length > 0 && (
                  <span> matching your filter criteria</span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard key={facility._id} facility={facility} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityListing;