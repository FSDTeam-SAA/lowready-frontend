import ContactInformation from "@/components/ContactUs/ContactInformation";
import GetInTouch from "@/components/ContactUs/GetInTouch";
import FindCare from "@/components/shared/FindPerfectCare";
import React from "react";

export default function page() {
  return (
    <div>
      <FindCare
        imageSrc="/contact/contactImage1.jpg"
        heading="Reach Out to ALH Hub for Support & Guidance "
        subHeading="Our team is ready to assist you with any questions, provide guidance, and help you confidently connect with the most suitable assisted living facilities for your loved ones."
        buttonText="Get Started"
        showButton={false}
      />
      <GetInTouch />
      <ContactInformation  />
    </div>
  );
}
