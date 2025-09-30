"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useAllFaq } from "@/hooks/useAllFaq";
import FaqSkeleton from "./FaqSkelaton";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  faq: boolean;
  home: boolean;
  __v: number;
}

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Fetch real FAQ data from your API
  const { data: faqResponse, isLoading, isError } = useAllFaq();

  // Toggle FAQ open/close
  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle loading/error states
  if (isLoading) return <><FaqSkeleton/></>;
  if (isError || !faqResponse?.data)
    return <p className="text-center py-10">Failed to load FAQs.</p>;

  // Extract FAQ array from API response
  const faqData = faqResponse.data;

  return (
    <section className="bg-[#F8F9FA]">
      <div className="mx-auto container py-8">
        <div className="flex flex-col rounded-xl">
          {faqData.map((faqItem: FaqItem, index: number) => (
            <div
              key={faqItem._id}
              className={`px-6 py-5 cursor-pointer ${
                index !== faqData.length - 1 ? "border-b border-gray-200" : ""
              }`}
              onClick={() => toggleFaq(index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base md:text-lg font-medium text-[#343A40]">
                  {faqItem.question}
                </h3>

                {/* Icon */}
                <span className="flex items-center justify-center w-7 h-7 border border-primary rounded-full text-primary transition-all duration-300">
                  {activeIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </div>

              {/* Answer */}
              {activeIndex === index && (
                <p className="mt-3 text-[#68706A] leading-relaxed text-sm md:text-base">
                  {faqItem.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
