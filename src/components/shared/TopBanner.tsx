"use client";

import { useState } from "react";
import { PhoneForwarded, X } from "lucide-react";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <section className="bg-[#E6F9EB] relative">
      <div className="container mx-auto">
        {/* Close Button at Right Corner */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-2 text-gray-600 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-row justify-between items-center py-2">
          <div className="message">
            Call now for a FREE Consultation with a Family Advisor about Assisted Living in your area!
          </div>
          <div className="phone-number flex flex-row items-center gap-3">
            <PhoneForwarded className="text-[#28A745]" />
            <p>90860-6745678</p>
          </div>
        </div>
      </div>
    </section>
  );
}
