"use client";

import React from "react";
import { Button } from "../ui/button";

interface CallToActionProps {
  title?: string;
  title1?: string;
  title2?: string;
  description?: string;
  buttonText?: string;

  // optional additional styling
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  title1,
  description,
  buttonText,
}) => {
  return (
    <section className={`py-[80px] `}>
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-[32px] lg:text-[40px] font-playfair leading-[150%] font-bold mb-[16px]">
          {title}
          <span className="text-[#28A745]"> {title1}</span>

          {title}
        </h3>
        <p className="mb-[60px]">{description}</p>
        <Button size="lg" className="bg-[#28A745] text-[16px] text-white px-10">{buttonText}</Button>
      </div>
    </section>
  );
};

export default CallToAction;
