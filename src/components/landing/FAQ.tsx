"use client";
import React, { useState } from "react";
// import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CirclePlus, CircleMinus } from "lucide-react";
// import Link from "next/link";

const FAQ = () => {
  const faqData = [
    {
      id: "item-1",
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      id: "item-2",
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan anytime from your account settings.",
    },
    {
      id: "item-3",
      question: "What is your cancellation policy?",
      answer:
        "You can cancel anytime. If you cancel within 30 days, you'll get a full refund.",
    },
    {
      id: "item-4",
      question: "Can other info be added to an invoice?",
      answer:
        "Yes, you can add additional details like company name, VAT number, etc.",
    },
  ];

  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="bg-[#F8F9FA] bg-cover">
      <div className="container mx-auto space-y-4 lg:space-y-20 py-10 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-12 xl:p-20">
        <div className="">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6x md:mb-8 font-bold leading-tight  font-playfair text-gray-900 mb-4">
              Frequently <span className="text-green-600">Asked Questions</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-2 sm:px-0">
              Find quick answers to the most common questions about our
              facilities and services.
            </p>
          </div>
        </div>
        <div className="">
          <div className="w-full px-2 sm:px-4 md:px-6">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={openItem ?? ""}
              onValueChange={(value) => setOpenItem(value)}
            >
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-gray-300 relative"
                >
                  <AccordionTrigger className="flex justify-between items-center cursor-pointer w-full text-left py-3 sm:py-4 hover:no-underline group [&>svg]:hidden pr-6 sm:pr-8">
                    <span className="font-medium text-base sm:text-[18px] text-gray-900 pr-4 sm:pr-6 text-left">
                      {faq.question}
                    </span>
                    <div className="absolute right-2 sm:right-4 top-3 cursor-pointer sm:top-4">
                      {openItem === faq.id ? (
                        <CircleMinus className="h-4 w-4 sm:h-5 sm:w-5 text-primary transition-transform duration-200" />
                      ) : (
                        <CirclePlus className="h-4 w-4 sm:h-5 sm:w-5 text-primary transition-transform duration-200" />
                      )}
                    </div>
                  </AccordionTrigger>


                  <AccordionContent className="text-gray-600 text-start pb-3 sm:pb-4 pt-1 sm:pt-2 text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
