import React from "react";
import FindCare from "../shared/FindPerfectCare";

const FacilitiesDecide = () => {
  return (
    <section>
      <FindCare
        imageSrc="/images/facilitiesdecide.jpg"
        heading="Can&apos;t Decide Which Facility is Right for Your Family?"
        buttonText="Contact Us"
        subHeading="We understand choosing senior care can feel overwhelming. That&apos;s why ALH Hub makes it simple to compare services, amenities, and reviews—helping you confidently find the best fit for your loved one."
        showButton={true}
        buttonlink="/contact-us"
      />
    </section>
  );
};

export default FacilitiesDecide;
