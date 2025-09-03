// components/FacilityGallery.tsx
"use client";

import { ConfirmBookingModal } from "@/components/shared/ConfirmBookingModal";
import { Button } from "@/components/ui/button";
import {
  AmenityService,
  BookingType,
  createBooking,
  Facility,
} from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FacilityTourProps {
  data: { data: Facility };
}

export function FacilityGallery({ data }: FacilityTourProps) {
  const datas = data?.data || {};
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [previewImage, setPreviewImage] = useState(
    datas?.images?.[0]?.url || "/default-image.png"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bookingData, setBookingData] = useState<BookingType | undefined>();

  useEffect(() => {
    if ((datas?.amenitiesServices ?? []).length > 0) {
      setPreviewImage(
        datas.amenitiesServices?.[0]?.image?.url || "/default-image.png"
      );
    }
  }, [datas.amenitiesServices]);

 
  const createBookingMutation = useMutation({
    mutationKey: ["booking"],
    mutationFn: (values: BookingType) => createBooking(values),
  });

  async function handleBookingSubmit(values: BookingType) {
    await createBookingMutation.mutate(values);
  }

  // const handleEditBooking = (booking: BookingType) => {
  //   setBookingData(booking);
  //   setIsEdit(true);
  //   setModalOpen(true);
  // };

  const handleNewBooking = () => {
    setBookingData(undefined);
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setBookingData(undefined);
  };

  return (
    <section className="py-[80px]">
      <div className="lg:flex items-center gap-[48px] mx-auto">
        {/* Images */}
        <div className="flex flex-col-reverse md:flex-row gap-2 items-center mx-auto">
          {/* Thumbnails */}
          <div className="flex overflow-hidden gap-3 md:flex-col">
            {datas?.amenitiesServices?.map(
              (img: AmenityService, id: number) => (
                <Image
                  onClick={() => setPreviewImage(img.image.url)}
                  key={id}
                  src={img.image.url}
                  alt={`${id}`}
                  width={105}
                  height={80}
                  className="rounded-xl object-cover w-full h-full cursor-pointer"
                />
              )
            )}
          </div>

          {/* Main Preview */}
          <div className="col-span-3 row-span-2">
            <Image
              src={previewImage}
              alt="Main Preview"
              width={600}
              height={400}
              className="rounded-2xl object-cover w-[400] h-[400] lg:w-[600px] lg:h-[600px]"
            />
          </div>
        </div>

        {/* Facility Info */}
        <div>
          <Button className="text-green-300 border-1 mt-5 border-green-300">
            Available
          </Button>
          <h1 className="text-2xl font-bold pt-[24px] text-[#343A40]">
            {datas?.name}
          </h1>
          <p className="text-muted-foreground mt-2 flex gap-2">
            <MapPin />
            {datas?.location}
          </p>
          <p className="py-4 text-[#68706A] text-[16px] leading-[150%]">
            {datas?.description}
          </p>

          {/* Amenities */}
          <div className="pt-[40px] pb-[60px]">
            <h3 className="text-[20px] text-[#343A40] pb-[6px]">Amenities</h3>
            <div>
              <ul className="flex items-center gap-3 flex-wrap">
                {datas?.amenities?.map((item: string, id: number) => (
                  <li
                    key={id}
                    className="text-[12px] px-4 rounded-sm border-1 py-1 inline-block font-medium bg-[#F7F8F8] text-[#68706A]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price + Actions */}
          <div className="mt-6">
            <p className="text-[20px] font-semibold text-[#343A40]">Pricing</p>
            <p className="text-2xl font-semibold text-green-600">
              ${datas?.price || 2200} / month
            </p>
            <div className="space-x-2 pt-[80px] flex cursor-pointer justify-between">
              <Link
                className="w-1/2 cursor-pointer text-[#28A745]"
                href={"#requestACall"}
              >
                <Button className="w-full" variant="outline">
                  Request a Call
                </Button>
              </Link>
              <Button
                className="w-1/2 cursor-pointer"
                onClick={handleNewBooking}
              >
                Book a Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <ConfirmBookingModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmitBooking={handleBookingSubmit}
        isEdit={isEdit}
        apiData={
          bookingData || {
            facility: datas?._id,
            userId: userId,
            startingDate: new Date().toISOString(),
            duration: "2",
            paymentStatus: "pending",
            residentialInfo: [
              {
                name: "",
                dateOfBirth: new Date().toISOString().split("T")[0],
                gender: "male",
                requirements: "",
              },
            ],
            totalPrice: datas?.price || 2200,
          }
        }
      />
    </section>
  );
}
