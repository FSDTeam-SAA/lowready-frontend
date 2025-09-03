"use client";

import { useState } from "react";
import { PhoneForwarded, X } from "lucide-react";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="bg-[#E6F9EB] relative h-auto w-ful font-poppins">
      <div className="container mx-auto">
        
        <button
          onClick={() => setIsVisible(false)}
          className=" absolute md:right-2 md:top-4 right-4 top-5 sm:right-2 sm:top-5  text-gray-600 flex items-center hover:text-red-500 transition"
        >
          <X className="cursor-pointer" size={20} />
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center py-2 md:py-4 text-sm md:text-base gap-1 md:gap-0">
          <div className="message text-center md:text-left px-2">
            <p className="text-xs">Call now for a FREE Consultation with a Family Advisor about Assisted Living in your area!</p>
          </div>
          <div className="phone-number flex flex-row items-center gap-2 md:gap-3 mt-1 md:mt-0">
            <PhoneForwarded className="text-[#28A745] w-4 h-4 md:w-5 md:h-5" />
            <p className="text-xs md:text-xs">90860-6745678</p>
          </div>
        </div>
      </div>
    </section>
  );
}
