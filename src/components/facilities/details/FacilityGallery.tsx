"use client";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";

export function FacilityGallery() {
  const images = ["/i.png", "/i1.png", "/i2.png", "/i3.png", "/i4.png"];

  return (
    <section className="">
        <div className="lg:flex items-center gap-[48px] mx-auto">

      <div className="flex  gap-2 items-center mx-auto ">
        <div className="flex flex-col">
          {images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`Gallery ${i}`}
              width={105}
              height={80}
              className="rounded-xl object-cover w-full h-full"
            />
          ))}
        </div>
        <div className="col-span-3 row-span-2">
          <Image
            src="/im.png"
            alt="Main"
            width={600}
            height={400}
            className="rounded-2xl object-cover w-[400] h-[400] lg-w-[600px] lg:h-[600px]"
          />
        </div>
      </div>
      <div>
        <Button className="text-green-300 border-1 border-green-300">Available</Button>
        <h1 className="text-2xl font-bold pt-[24px] text-[#343A40]">Sunny Hills Assisted Living</h1>
        <p className="text-muted-foreground mt-2 flex gap-2">
           
          <MapPin /> 3.9 (34 Reviews) | 1234 Elm St, Springfield, IL 62704
        </p>
        <p className="py-4 text-[#68706A] text-[16px] leading-[150%]">
          Sunny Hills Assisted Living provides a safe, nurturing environment
          with a wide variety of services tailored to meet the needs of each
          resident.
        </p>
        <div className="pt-[40px] pb-[60px]">
            <h3 className="text-[20px] text-[#343A40] pb-[6px]">Amenites</h3>
            <div>
                <Button className="text-[12px] font-medium bg-gray-200 text-black">Assisted Living</Button>
            </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <p className="text-2xl font-semibold text-green-600">
            $2,200 / month
          </p>
          <div className="space-x-2">
            <Button variant="outline">Request Info</Button>
            <Button>Book a Tour</Button>
          </div>
        </div>
      </div>
        </div>
    </section>
  );
}
