"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import {
  facilitiesLocation,
  FacilitySearchData,
  FacilityFilters,
  Facility,
} from "@/lib/api";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

interface Location {
  _id: string;
  location: string;
}

export default function SearchField() {
  const [filters, setFilters] = useState<FacilityFilters>({
    minPrice: 0,
    maxPrice: 1000000,
    location: "Dhaka",
    availability: true,
    rating: undefined,
    careServices: [],
    amenities: [],
    page: 1,
    limit: 6,
  });

  const [isSearching, setIsSearching] = useState(false);

  // Fetch locations
  const { data: locationdata } = useQuery({
    queryKey: ["locationdata"],
    queryFn: facilitiesLocation,
  });
  const locations: Location[] = locationdata?.data || [];

  // Fetch facilities
  const {
    data: facilitie,
    isLoading: facilitiesLoading,
    refetch,
  } = useQuery({
    queryKey: ["facilities", filters],
    queryFn: () => FacilitySearchData(filters),
  });

  const facilities = facilitie?.data || [];
  const totalPages = facilitie?.totalPages || 1;
  console.log("facilities", facilities);

  // ---------- Handlers ----------
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, location: e.target.value });
    setIsSearching(e.target.value.length > 0);
  };

  return (
    <div className="relative container mx-auto w-full min-h-screen bg-white">
      {/* Search Bar */}
      <div className=" z-50 bg-white shadow-2xl my-10 p-4  rounded-xl flex items-center mx-auto justify-between w-[85%] lg:w-8/12 gap-2">
        <Input
          placeholder="Enter location..."
          value={filters.location}
          onChange={handleLocationChange}
          className=" border-none w-[70%] outline-none shadow-none"
        />
        <Button onClick={() => refetch()}>Search</Button>
      </div>

      {/* Body with dim effect */}
      <div
        className={`${
          isSearching ? "opacity-40" : "opacity-100"
        } transition-opacity duration-300`}
      >
        <div className="flex">
          {/* Left Sidebar Filters */}
          <aside className="hidden md:block w-1/4 lg:w-1/5 p-6 space-y-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r">
            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: Number(e.target.value) })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold mb-2">Availability</h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.availability ?? true}
                  onCheckedChange={(val) =>
                    setFilters({ ...filters, availability: !!val })
                  }
                />
                <span>Available</span>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <Select
                value={filters.location}
                onValueChange={(val) =>
                  setFilters({ ...filters, location: val })
                }
              >
                <SelectTrigger className="w-full h-[44px] px-3 ">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc._id} value={loc.location}>
                      {loc.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="font-semibold mb-2">Ratings</h3>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.rating === star}
                    onCheckedChange={() =>
                      setFilters({ ...filters, rating: star })
                    }
                  />
                  <span className="flex items-center">
                    {star} <Star className="w-4 h-4 text-yellow-500 ml-1" />
                  </span>
                </div>
              ))}
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-2">Services</h3>
              {["Personal Care", "Medical Support", "Housekeeping"].map(
                (service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.careServices?.includes(service)}
                      onCheckedChange={(val) =>
                        setFilters({
                          ...filters,
                          careServices: val
                            ? [...(filters.careServices || []), service]
                            : (filters.careServices || []).filter(
                                (s) => s !== service
                              ),
                        })
                      }
                    />
                    <span>{service}</span>
                  </div>
                )
              )}
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-semibold mb-2">Amenities</h3>
              {["Transportation", "WiFi", "Garden"].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.amenities?.includes(amenity)}
                    onCheckedChange={(val) =>
                      setFilters({
                        ...filters,
                        amenities: val
                          ? [...(filters.amenities || []), amenity]
                          : (filters.amenities || []).filter(
                              (a) => a !== amenity
                            ),
                      })
                    }
                  />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            {/* Reset */}
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  minPrice: 0,
                  maxPrice: 1000000,
                  location: "Dhaka",
                  availability: true,
                  rating: undefined,
                  careServices: [],
                  amenities: [],
                  page: 1,
                  limit: 6,
                })
              }
              className="w-full text-red-500 border-red-500"
            >
              Clear All Filters
            </Button>
          </aside>

          {/* Facilities List */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {facilitiesLoading ? (
              <p>Loading facilities...</p>
            ) : facilities.length > 0 ? (
              <>
                <div className="pb-[80px]">
                  <h2 className="text-[40px] font-bold leading-[150%] text-[#343A40]">
                    Facilities near {filters.location} - <span className="text-[#28A745]">{facilities.length} Round</span>
                  </h2>
                  <p className="text-[16px] text-[#68706A] pt-[4px]">
                    Browse through carefully selected senior living options near
                    New York to find the perfect match for your loved one.
                  </p>
                </div>
                {facilities.map((facility: Facility) => (
                  <Card key={facility._id} className="overflow-hidden py-0">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Image
                        src={facility.images[0]?.url || "/search.png"}
                        alt={facility.name}
                        width={200}
                        height={200}
                        className="w-full h-[272] object-cover"
                      />
                      <CardContent className="flex flex-col justify-between md:col-span-2">
                        <div>
                          <CardTitle className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold leading-[150%] text-[#343A40] pt-[24px]">
                              {facility.name}
                            </h2>
                            <span className="flex items-center text-sm text-yellow-500">
                              <Star className="w-4 h-4 mr-1" />{" "}
                              {facility.rating ?? 0} (reviews)
                            </span>
                          </CardTitle>
                          <p className="text-sm flex items-center gap-2  leading-[150%] text-[#68706A] pt-[8px]">
                            <MapPin className="w-4 h-4 " />
                            {facility.description ?? "No description available"}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-[16px]">
                            {facility.amenities && (
                              <button className="text-green-400 hover:text-white hover:bg-green-400 border-green-300 px-3 py-1 border rounded-xl text-xs bg-green-200">
                                Available
                              </button>
                            )}
                            {facility.amenities?.map((a) => (
                              <span
                                key={a}
                                className="px-3 py-1 border rounded-xl text-xs hover:text-white hover:bg-green-400"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="items-center justify-between py-[16px]">
                          <span className="text-[32px] font-semibold">
                            ${facility.price ?? 0}{" "}
                            <span className="text-[16px] font-medium leading-[150%]">
                              /Month
                            </span>
                          </span>
                          <div className="flex justify-between gap-5 pt-4 pb-6 ">
                            <Button className="w-1/2" variant="outline">
                              See Details
                            </Button>
                            <Button className="w-1/2">Book a Tour</Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={filters.page === idx + 1 ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, page: idx + 1 })}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p>No facilities found</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
