"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "Is there a free trial available?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa in, nibh condimentum class. Augue orci conubia suscipit in condimentum maecenas congue magna velit, eros elementum platea semper odio cras feugiat placerat. Massa nibh sed erat ac est viverra nostra tellus, et aenean a phasellus rhoncus penatibus curae leo molestie, dui hendrerit duis vestibulum libero mi nam.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "This is the answer for the second question. You can nibh condimentum class. Augue orci conubia suscipit in condimentum maecenas congue magna velit, eros elementum platea semper odio cras feugiat placerat.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "This is the answer for the third question. Just keep nibh condimentum class. Augue orci conubia suscipit in condimentum maecenas congue magna velit, eros elementum platea semper odio cras feugiat placerat.",
  },
  {
    question: "Can other info be added to an invoice?",
    answer:
      "Yes, you can add extra info to invoices. Just keep nibh condimentum class. Augue orci conubia suscipit in condimentum maecenas congue magna velit.",
  },
  {
    question: "How does billing work?",
    answer:
      "Billing is handled monthly. Massa nibh sed erat ac est viverra nostra tellus, et aenean a phasellus rhoncus penatibus curae leo molestie.",
  },
  {
    question: "How do I change my account email?",
    answer:
      "This is the answer for updating your email. Just keep nibh condimentum class. Augue orci conubia suscipit in condimentum maecenas congue magna velit.",
  },
  {
    question:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at libero ultrices?",
    answer:
      "This is the answer for the long question example. Massa nibh sed erat ac est viverra nostra tellus, et aenean a phasellus rhoncus penatibus curae leo molestie.",
  },
  {
    question:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at libero ultrices?",
    answer:
      "Another answer example. Massa nibh sed erat ac est viverra nostra tellus, et aenean a phasellus rhoncus penatibus curae leo molestie.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#F8F9FA]">
      <div className="mx-auto container py-8">
        <div className=" ">
          <div className="flex flex-col rounded-xl ">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`px-6 py-5 cursor-pointer ${
                  index !== faqData.length - 1 ? "border-b border-gray-200" : ""
                }`}
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base md:text-lg font-medium text-[#343A40]">
                    {faq.question}
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
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
