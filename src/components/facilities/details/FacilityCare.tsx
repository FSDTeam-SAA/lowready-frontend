"use client";

import { Card } from "@/components/ui/card";
import { Facility } from "@/lib/api";
import { Check } from "lucide-react";
import Image from "next/image";
interface FacilityTourProps {
  data: { data: Facility };
}
export function FacilityCare({ data }: FacilityTourProps) {
  if (!data) return null;

  const datas = data.data || [];

  return (
    <section className="my-6">
      <div>
        <Card className="px-10 py-10">
          <div>
            <h2 className="text-xl lg:text-[32px] font-semibold">
              Care offered at{" "}
              <span className="text-[#28A745]">
                Sunny Hills Assisted Living
              </span>
            </h2>
            <p className="text-[16px] leading-[150%] pt-1 text-[#8E938F]">
              A wide range of personalized care services at Sunny Hills Assisted
              Living ensures your loved ones receive the support, attention, and
              comfort they need every day.
            </p>
            <ul className="flex items-center   flex-wrap pt-[60px] gap-2 ">
              {datas?.careServices?.map((item, id: number) => (
                <li
                  className="flex text-[#343A40] text-[18px] items-center gap-1.5"
                  key={id}
                >
                  <Check className="w-6 h-6 text-green-300" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-[40px]">
            <h2 className="text-xl lg:text-[32px] font-semibold">
              Amenities <span className="text-[#28A745]">Services</span>
            </h2>
            <p className="text-[16px] leading-[150%] pt-1 text-[#8E938F]">
              A wide range of personalized care services at Sunny Hills Assisted
              Living ensures your loved ones receive the support, attention, and
              comfort they need every day.
            </p>
            <div className="flex flex-wrap items-center gap-[32px] pt-[40px]">
              {datas?.amenitiesServices?.map((item, id: number) => (
                <div key={id} className="flex md:w-[40%] w-[70%] items-center gap-2">
                  <Image
                    src={item.image.url}
                    width={40}
                    height={40}
                    alt="item.name"
                  />
                  {/* render icon */}
                  <span className="text-[#68706A] text-[18px] font-normal">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
