"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CirclePlus, CircleMinus } from "lucide-react";

const FAQ = () => {
  const faqData = [
    {
      id: "item-1",
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
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
    <div className=" bg-gray-200 bg-cover  ">
      <div className="container mx-auto space-y-4 lg:space-y-20 p-20">
        <div className="">
          <div className="text-center mb-12">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 md:mb-8 font-bold leading-tight font-bold text-gray-900 mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Frequently <span className="text-green-600">Asked Questions</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find quick answers to the most common questions about our
              facilities and services.
            </p>
          </div>
        </div>
        <div className=" ">
          <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl"
              value={openItem || undefined}
              onValueChange={(value) => setOpenItem(value)}
            >
              {faqData.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-300 relative">
                  <AccordionTrigger className="flex justify-between items-center w-full text-left py-4 hover:no-underline group [&>svg]:hidden">
                    <span className="font-medium text-[18px] text-shadow-gray-900 pr-6">{faq.question}</span>
                  </AccordionTrigger>
                  
                  {/* Custom icons positioned absolutely */}
                  <div className="absolute right-0 top-4">
                    {openItem === faq.id ? (
                      <CircleMinus className="h-5 w-5 text-primary transition-transform duration-200" />
                    ) : (
                      <CirclePlus className="h-5 w-5 text-primary transition-transform duration-200" />
                    )}
                  </div>
                  
                  <AccordionContent className="text-gray-600 text-start pb-4 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col items-center justify-center h-full  text-center px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 md:mb-8 font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Still Have
              <span className="text-green-500"> Questions? </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our team is here to provide personalized guidance and support
              reach out anytime.
            </p>

            <div className="mt-8">
              <Button size="lg" className="w-[200px] cursor-pointer">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
