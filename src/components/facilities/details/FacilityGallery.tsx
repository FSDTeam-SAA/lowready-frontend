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
import { Dot, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface FacilityTourProps {
  data: { data: Facility };
}

export function FacilityGallery({ data }: FacilityTourProps) {
  const datas = data?.data || {};
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id || "";
  const userRole = session?.user?.role || "";

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
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  async function handleBookingSubmit(values: BookingType) {
    await createBookingMutation.mutateAsync(values);
    handleCloseModal();
  }

  const handleNewBooking = () => {
    // ✅ Authentication check
    if (!session) {
      toast.error("Please login first to book a tour.");
      router.push("/login"); // redirect to login
      return;
    }

    // ✅ Role check
    if (userRole !== "user") {
      toast.error("Only users can book a tour.");
      return;
    }

    // Open booking modal with default data
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
      <div className="lg:flex items-center container mx-auto  gap-[48px] ">
        {/* Images */}
        <div className="flex flex-col-reverse lg:w-1/2 md:justify-between md:flex-row gap-2 lg:gap-[24px]  items-center mx-auto md:mx-0">
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
        <div className="lg:w-1/2 p-4 md:p-0">
          <Button className="text-[#28A745] bg-[#E6F9EB]   border-1 border-[#9CE7AD] hover:bg-transparent mt-5  flex gap-1 items-center ">
            <Dot className=""/>
            Available
          </Button>
          <h1 className="text-2xl font-bold pt-[24px] text-[#343A40]">
            {datas?.name}
          </h1>
          <p className="text-[16px] text-[#68706A] mt-2 flex gap-2">
            <MapPin />
            {datas?.location}
          </p>
          <p className="pt-4 text-[#68706A] text-[16px] leading-[150%]">
            {datas?.description}
          </p>

          {/* Amenities */}
          <div className="  md:pt-[40px] pb-[30px] md:pb-[60px]">
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
          <div className="">
            <p className="text-[20px] font-semibold text-[#343A40]">Pricing</p>
            <p className="text-3xl md:text-[40px] font-bold text-green-600">
              ${datas?.price || 2200}{" "}
              <span className="text-[16px] font-medium">/ month</span>
            </p>
            <div className="space-x-2 pt-[20px] md:pt-[80px] flex cursor-pointer justify-between">
              <Link
                className="w-1/2 cursor-pointer text-[#28A745]"
                href={"#requestACall"}
              >
                <Button className="w-full cursor-pointer" variant="outline">
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
