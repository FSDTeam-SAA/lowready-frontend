"use client";

import { Star, MapPin, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { BookingType, createBooking, FacilityCards } from "@/lib/api";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ConfirmBookingModal } from "./ConfirmBookingModal";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface FacilityCardProps {
  facility: FacilityCards;
  onSeeDetails: (facilityId: string) => void;
  onBookTour: (facilityId: string) => void;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bookingData, setBookingData] = useState<BookingType | undefined>();
  // const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
  //   null
  // );

  const createBookingMutation = useMutation({
    mutationKey: ["booking"],
    mutationFn: (values: BookingType) => createBooking(values),
    onSuccess: (data) => {
      toast.success(`${data.message}`);
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  async function handleBookingSubmit(values: BookingType) {
    await createBookingMutation.mutateAsync(values);
    handleCloseModal();
  }

  const handleNewBooking = (facility: FacilityCards) => {
    // setSelectedFacility(facility as Facility);

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
    <section>
      <Card className="w-full overflow-hidden items-stretch bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 py-0 ">
        <div className="relative ">
          <Image
            src={facility?.images?.[0]?.url || "/search.png"}
            alt={facility?.name}
            width={490}
            height={321}
            className="object-cover h-[321px] "
          />
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex justify-between ">
              <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                {facility?.name}
              </h3>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {facility?.rating ?? 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({facility?.ratingCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#68706A]">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{facility?.location}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 items-stretch">
            <Badge
              className={`${
                facility.availability
                  ? "bg-[#9CE7AD] text-[#28A745] "
                  : "bg-red-300 text-white"
              } text-[12px] px-4 py-1 rounded-sm`}
            >
              <Dot className="w-[14px] h-[14px]" />{" "}
              {facility.availability ? " Available" : "Unavailable"}
            </Badge>

            {facility.amenities?.map((category, index) => (
              <Badge
                className="bg-[#E6E7E6] text-[#68706A] text-[12px]  px-4 py-1 rounded-sm"
                key={index}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                ${facility?.price?.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/ Month</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button className="w-1/2" variant="outline">
              <Link
                className="w-full h-full cursor-pointer"
                href={`/facilities/details/${facility?._id}`}
              >
                See Details
              </Link>
            </Button>
            <Button
              className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleNewBooking(facility)}
            >
              Book a Tour
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmBookingModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmitBooking={handleBookingSubmit}
        isEdit={isEdit}
        apiData={bookingData}
      />
    </section>
  );
}
