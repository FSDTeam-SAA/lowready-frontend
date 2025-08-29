"use client";
import { Brain, Cake, CheckCircle } from "lucide-react";

export function FacilityAmenities() {
  const amenities = [
    {
      icon: CheckCircle,
      text: "Furnished rooms",
    },
    {
      icon: Cake,
      text: "Transportation & parking",
    },
    {
      icon: CheckCircle,
      text: "Meals & Nutrition",
    },
    {
      icon: Brain,
      text: "Emergency assistance",
    },
  ];

  return (
    <section className="my-6">
      <h2 className="text-xl lg:text-[32px] font-semibold">
        Amenities <span className="text-[#28A745]">Services</span>
      </h2>
      <p className="text-[16px] leading-[150%] pt-1 text-[#8E938F]">
        A wide range of personalized care services at Sunny Hills Assisted
        Living ensures your loved ones receive the support, attention, and
        comfort they need every day.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {amenities.map((a, i) => (
          <div key={i} className="flex items-center space-x-2">
            <a.icon className="text-green-500 w-5 h-5" /> {/* render icon */}
            <span>{a.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
