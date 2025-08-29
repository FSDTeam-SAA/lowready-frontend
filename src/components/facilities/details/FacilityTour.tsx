"use client";
import Image from "next/image";

export function FacilityTour() {
  return (
    <section className="my-[80px]">
      <h2 className="text-xl text-[32px] font-semibold">Villa <span className="text-green-400">Tour</span></h2>
      <p className="text-[16px] text-[#8E938F]">Set apart from the main community building, our villas offer spacious 2-bedroom, 2-bathroom layouts complete with an attached parking garage and private enclosed patio. Designed for comfort, convenience, and independence, The Villas provide a perfect blend of privacy and connection to the larger community.</p>
      <div className="mt-4 rounded-xl overflow-hidden">
        <Image
          src="/villaTour.png"
          alt="Tour"
          width={800}
          height={400}
          className="w-full h-auto pt-[40px] object-cover"
        />
      </div>
    </section>
  );
}
