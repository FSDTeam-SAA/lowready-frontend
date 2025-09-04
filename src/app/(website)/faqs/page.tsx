import FaqSection from "@/components/FaqSection/FaqSection";
import SmallHero from "@/components/shared/SmallHero";
// import FindCare from "@/components/shared/FindPerfectCare";
import StillHaveQuestions from "@/components/shared/StillHaveQuestions";
import React from "react";

export default function page() {
  return (
    <div>
      <SmallHero
        imageSrc="/contact/contactImage1.jpg"
        heading="Frequently"
        subHeading="Asked Questions"
        description="Our team is ready to assist you with any questions, provide guidance, and help you confidently connect with the most suitable assisted living facilities for your loved ones."
      />

      <FaqSection />

      <StillHaveQuestions />
    </div>
  );
}
