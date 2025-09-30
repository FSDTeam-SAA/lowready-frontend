"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import {
  facilitiesLocation,
  FacilitySearchData,
  FacilityFilters,
  Facility,
  BookingType,
  createBooking,
  FacilityCards,
} from "@/lib/api";

import Link from "next/link";
import { ConfirmBookingModal } from "@/components/shared/ConfirmBookingModal";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FiltersSidebar } from "./sidebar-filter";

interface Location {
  _id: string;
  location: string;
}

export interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  location: string;
  availability: string[];
  rating?: number;
  careServices: string[];
  amenities: string[];
  page: number;
  limit: number;
}

export default function SearchField() {
  const searchParams = useSearchParams();

  const initialLocation = searchParams.get("q") || "";
  // Initialize with required fields for FiltersSidebar
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 1000000,
    location: initialLocation,
    availability: [],
    rating: 0,
    careServices: [],
    amenities: [],
    page: 1,
    limit: 6,
  });

  // Convert our internal filters to the API format
  const convertToApiFilters = (
    localFilters: SearchFilters
  ): FacilityFilters => ({
    minPrice: localFilters.minPrice,
    maxPrice: localFilters.maxPrice,
    location: localFilters.location,
    availability: localFilters.availability.join(","),
    rating: localFilters.rating,
    careServices: localFilters.careServices,
    amenities: localFilters.amenities,
    page: localFilters.page,
    limit: localFilters.limit,
  });

  // Convert API filters to our internal format
  // const convertFromApiFilters = (
  //   apiFilters: FacilityFilters
  // ): SearchFilters => ({
  //   minPrice: Number(apiFilters.minPrice) || 0,
  //   maxPrice: Number(apiFilters.maxPrice) || 1000000,
  //   location: apiFilters.location || initialLocation,
  //   availability: apiFilters.availability
  //     ? apiFilters?.availability?.split(",")
  //     : [],
  //   rating: Number(apiFilters.rating) || 0,
  //   careServices: apiFilters.careServices || [],
  //   amenities: apiFilters.amenities || [],
  //   page: apiFilters.page || 1,
  //   limit: apiFilters.limit || 6,
  // });

  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bookingData, setBookingData] = useState<BookingType | undefined>();
  // const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
  //   null
  // );
  const [minPriceInput, setMinPriceInput] = useState(
    (filters.minPrice ?? 0).toString()
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    (filters.maxPrice ?? 1000000).toString()
  );

  // handler for min price
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/^0+(?=\d)/, "");
    setMinPriceInput(val);
    setFilters({ ...filters, minPrice: Number(val) || 0 });
  };

  // handler for max price
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/^0+(?=\d)/, "");
    setMaxPriceInput(val);
    setFilters({ ...filters, maxPrice: Number(val) || 0 });
  };

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
    queryFn: () => FacilitySearchData(convertToApiFilters(filters)),
  });

  const createBookingMutation = useMutation({
    mutationKey: ["booking"],
    mutationFn: (values: BookingType) => createBooking(values),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function handleBookingSubmit(values: BookingType) {
    await createBookingMutation.mutate(values);
  }

  const facilities = facilitie?.data || [];
  const totalPages = facilitie?.totalPages || 1;

  // ---------- Handlers ----------
  // const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilters({ ...filters, location: e.target.value });
  //   setIsSearching(e.target.value.length > 0);
  // };

  // inside handleLocationChange
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters((prev) => {
      // Logic: adjust availability based on input
      let availability = { available: true, unavailable: true, limited: true };

      if (val.length > 0) {
        // Example: only available and limited if input exists
        availability = { available: true, unavailable: false, limited: true };
      } else {
        // Reset to all true if empty
        availability = { available: true, unavailable: true, limited: true };
      }

      return { ...prev, location: val, ...availability };
    });

    setIsSearching(val.length > 0);
  };

  const handleNewBooking = (facility: Facility) => {
    // setSelectedFacility(facility);

    // Create booking data with the selected facility information
    const newBookingData: BookingType = {
      _id: undefined,
      facility: facility._id,
      userId: userId,
      startingDate: new Date().toISOString(),
      duration: "1",
      paymentStatus: "pending",
      residentialInfo: [
        {
          name: "",
          dateOfBirth: new Date().toISOString().split("T")[0],
          gender: "male",
          requirements: "",
        },
      ],
      totalPrice: facility.price || 0,
    };

    setBookingData(newBookingData);
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setBookingData(undefined);
    // setSelectedFacility(null);
  };

  return (
    <div className="relative container mx-auto w-full min-h-screen bg-white">
      {/* Search Bar */}
      <div className=" z-50 bg-white  my-10 p-2 rounded-xl border flex items-center mx-auto justify-between w-[85%] lg:w-6/12 gap-2">
        <Input
          placeholder="Enter location..."
          value={filters.location}
          onChange={handleLocationChange}
          className=" border-none  outline-none shadow-none bg-gray-100 h-10"
        />
        <Button
          className="cursor-pointer w-30 h-10"
          onClick={() => {
            setIsSearching(false);
            setFilters({ ...filters });
            refetch();
          }}
        >
          <Search /> Search
        </Button>
      </div>

      {/* Body with dim effect */}
      <div
        className={`${
          isSearching ? "opacity-40" : "opacity-100"
        } transition-opacity duration-300`}
      >
        <div className="flex flex-col lg:flex-row justify-center  lg:justify-between">
          {/* Left Sidebar Filters */}
          <FiltersSidebar
            filters={filters}
            setFilters={setFilters}
            locations={locations}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            handleMinPriceChange={handleMinPriceChange}
            handleMaxPriceChange={handleMaxPriceChange}
          />

          {/* Facilities List */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {facilitiesLoading ? (
              <p>Loading facilities...</p>
            ) : facilities.length > 0 ? (
              <>
                <div className="pb-6 md:pb-[32px]">
                  <h2 className="text-[24px] md:text-[40px] font-bold leading-[150%] text-[#343A40] font-playfair">
                    Facilities near {filters.location} -{" "}
                    <span className="text-[#28A745]">
                      {facilities.length} found
                    </span>
                  </h2>
                  <p className="text-[16px] text-[#68706A] pt-[4px]">
                    Browse through carefully selected senior living options near
                    New York to find the perfect match for your loved one.
                  </p>
                </div>
                {facilities.map((facility: FacilityCards) => (
                  <Card key={facility._id} className="overflow-hidden py-0">
                    <div className="grid md:grid-cols-3 pb-0 gap-4 items-center">
                      <div className="col-span-1">
                        <Image
                          src={facility.images[0]?.url || "/search.png"}
                          alt={facility.name}
                          width={600}
                          height={272}
                          className="w-full aspect-[5/4]  object-cover"
                        />
                      </div>
                      <CardContent className="flex flex-col md:col-span-2">
                        <div>
                          <CardTitle className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold leading-[150%] text-[#343A40] pt-[24px]">
                              {facility?.name}
                            </h2>
                            <span className="flex items-center text-sm text-yellow-500">
                              <Star className="w-4 h-4 mr-1" />{" "}
                              {facility?.rating}{" "}
                              <span className="text-[#424944] ml-1">
                                ({facility?.ratingCount}
                                reviews)
                              </span>
                            </span>
                          </CardTitle>
                          <p className="text-sm flex items-center gap-2  leading-[150%] text-[#68706A] pt-[8px]">
                            <MapPin className="w-4 h-4 " />
                            {facility?.description ??
                              "No description available"}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-[16px]">
                            {facility?.amenities && (
                              <button className="text-green-800 hover:text-white hover:bg-green-400 border-green-300 px-3 py-1 border rounded-sm text-xs bg-green-100">
                                Available
                              </button>
                            )}
                            {facility?.amenities?.map((a) => (
                              <span
                                key={a}
                                className="px-3 py-1 border rounded-sm text-xs  hover:bg-green-100"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="items-center justify-between overflow-hidden py-[16px]">
                          <span className="text-[32px] font-semibold">
                            ${facility?.price ?? 0}{" "}
                            <span className="text-[16px] font-medium leading-[150%]">
                              /Month
                            </span>
                          </span>
                          <div className="flex justify-between gap-5 pt-4 pb-6 ">
                            <Link
                              className="w-1/2 h-full cursor-pointer text-green-600 "
                              href={`/facilities/details/${facility?._id}`}
                            >
                              <Button
                                className="w-full cursor-pointer flex-1 h-10 border-green-600"
                                variant="outline"
                              >
                                See Details
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleNewBooking(facility)}
                              className="w-1/2 cursor-pointer flex-1 h-10"
                            >
                              Book a Tour
                            </Button>
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
      {/* Booking Modal */}
      <ConfirmBookingModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmitBooking={handleBookingSubmit}
        isEdit={isEdit}
        apiData={bookingData}
      />
    </div>
  );
}
