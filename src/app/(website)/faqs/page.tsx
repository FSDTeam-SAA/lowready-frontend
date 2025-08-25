import FaqSection from "@/components/FaqSection/FaqSection";
import FindCare from "@/components/shared/FindPerfectCare";
import StillHaveQuestions from "@/components/shared/StillHaveQuestions";
import React from "react";

export default function page() {
  return (
    <div>
      <FindCare
        imageSrc="/contact/contactImage1.jpg"
        heading="Frequently Asked Questions"
        subHeading="Our team is ready to assist you with any questions, provide guidance, and help you confidently connect with the most suitable assisted living facilities for your loved ones."
        buttonText="Get Started"
        showButton={false}
      />
      <FaqSection />
      <StillHaveQuestions />
    </div>
  );
}
