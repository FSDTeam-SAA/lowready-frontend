"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface CallToActionProps {
  title?: string;
  title1?: string;
  title2?: string;
  description?: string;
  buttonText?: string;
  buttonlink: string;
  // optional additional styling
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  title1,
  title2,
  description,
  buttonText,
  buttonlink,
}) => {
  return (
    <section className={`py-8 md:py-[80px] `}>
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl  lg:text-4xl xl:text-6x md:mb-8 font-bold leading-tight  font-playfair text-gray-900 mb-4">
          {title}
          <span className="text-green-600"> {title1} </span>

          {title2}
        </h1>
        <p className="mb-[60px]">{description}</p>
        <Link href={buttonlink}>
          <Button
            size="lg"
            className="bg-[#28A745] text-[16px] cursor-pointer text-white px-10"
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
