import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export default function StillHaveQuestions() {
  return (
    <section className={`bg-[#F8F9FA] py-20`}>
      <div className="container mx-auto px-4  bg-[url(/images/BG.png)] bg-no-repeat">
        {/* Inner card/container background */}
        <div className=" py-16 rounded-xl relative overflow-hidden">
          {/* Content */}
          <div className="relative z-10 text-center mx-auto">
            <h2
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Still Have <span className="text-primary">Questions?</span>
            </h2>
            <p className="text-sm md:text-base text-[#68706A] mb-14 mt-1 w-full">
              Our team is here to provide personalized guidance and support —
              reach out anytime.
            </p>

            <div className="mt-6 sm:mt-8">
              <Link href="/contact-us">
                <Button
                  size="lg"
                  className="w-full sm:w-[200px] cursor-pointer"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
