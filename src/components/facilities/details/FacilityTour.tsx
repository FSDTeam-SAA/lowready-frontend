"use client";
import { Facility } from "@/lib/api";

interface FacilityTourProps {
  data: { data: Facility };
}

export function FacilityTour({ data }: FacilityTourProps) {
  if (!data) return null;

  const datas = data.data || [];

  return (
    <section className="my-[80px]">
    <div className="container mx-auto">
        {/* Tour Title */}
      <h2 className="text-xl text-[32px] font-playfair font-semibold">
        {datas?.videoTitle} <span className="text-green-400">Tour</span>
      </h2>

      {/* Video Description */}
      <p className="text-[16px] text-[#8E938F]">{datas?.videoDescription}</p>

      {/* Video Section */}
      <div className=" rounded-2xl overflow-hidden">
        {/* Video tag to display the tour video */}
        <video
          controls
          src={datas?.uploadVideo}
          width={800}
          height={400}
          className="w-full rounded-2xl h-auto rounded-b-sm pt-[40px] object-cover"
        />
      </div>
    </div>
    </section>
  );
}
