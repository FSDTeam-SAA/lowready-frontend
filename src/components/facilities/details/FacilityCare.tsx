"use client";

import { Check } from "lucide-react";

export function FacilityCare() {
  const cares = [
    "Independent Living",
    "Assisted Living",
    "Memory Care",
    "Respite Care",
    "Hospice Care",
  ];
  return (
    <section className="my-6">
      <h2 className="text-xl lg:text-[32px] font-semibold">
        Care offered at{" "}
        <span className="text-[#28A745]">Sunny Hills Assisted Living</span>
      </h2>
      <p className="text-[16px] leading-[150%] pt-1 text-[#8E938F]">
        A wide range of personalized care services at Sunny Hills Assisted
        Living ensures your loved ones receive the support, attention, and
        comfort they need every day.
      </p>
      <ul className="grid grid-cols-2 pt-[60px] gap-2 mt-4 list-disc pl-6">
        {cares.map((c, i) => (
          <li
            className="flex text-[#343A40] text-[18px] items-center gap-1.5"
            key={i}
          >
            <Check className="w-6 h-6 text-green-300" /> {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
