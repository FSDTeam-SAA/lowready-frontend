"use client";
import { Button } from "@/components/ui/button";
import { AmenityService, Facility } from "@/lib/api";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
interface FacilityTourProps {
  data: { data: Facility };
}
export function FacilityGallery({ data }: FacilityTourProps) {
  const datas = data?.data || [];

  // Initialize preview image state with the first image from amenitiesServices if available
  const [previewImage, setPreviewImage] = useState(
    datas?.images?.[0]?.url|| "/default-image.png"
  );

  useEffect(() => {
    if ((datas?.amenitiesServices ?? []).length > 0) {
      setPreviewImage(datas.amenitiesServices?.[0]?.image?.url || "/default-image.png");
    }
  }, [datas.amenitiesServices]);

  console.log(datas.amenities); // Log the data for debugging

  return (
    <section>
      <div className="lg:flex items-center gap-[48px] mx-auto">
        <div className="flex gap-2 items-center mx-auto">
          {/* Image Thumbnails */}
          <div className="flex gap-3 flex-col">
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

          {/* Main Image Preview */}
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
          <Button className="text-green-300 border-1 border-green-300">
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

          {/* Amenities Section */}
          <div className="pt-[40px] pb-[60px]">
            <h3 className="text-[20px] text-[#343A40] pb-[6px]">Amenities</h3>
            <div>
              <ul className="flex items-center gap-3 flex-wrap">
                {datas?.amenities?.map((item: string, id: number) => {
                  return (
                    <li
                      className="text-[12px] px-4 rounded-sm border-1 py-1  inline-block font-medium bg-[#F7F8F8] text-[#68706A]"
                      key={id}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="mt-6">
            <p className="text-[20px] font-semibold text-[#343A40]">Pricing</p>
            <div className=" ">
              <p className="text-2xl font-semibold text-green-600">
                $2,200 / month
              </p>
              <div className="space-x-2 pt-[80px] flex justify-between">
                <Button className="w-1/2" variant="outline">
                  Request Info
                </Button>
                <Button className="w-1/2">Book a Tour</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
