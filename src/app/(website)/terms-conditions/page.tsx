import SmallHero from "@/components/shared/SmallHero";
import TermsConditions from "@/components/TermsConditions/TermsConditions";
import React from "react";

export default function page() {
  return (
    <div>
      <SmallHero
        imageSrc="/contact/contactImage1.jpg"
        heading="Reach Out to ALH Hub for "
        subHeading="Support & Guidance"
        description="Our team is ready to assist you with any questions, provide guidance, and help you confidently connect with the most suitable assisted living facilities for your loved ones."
      />
      <TermsConditions />
    </div>
  );
}
