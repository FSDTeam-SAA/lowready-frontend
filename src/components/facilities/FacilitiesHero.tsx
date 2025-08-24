import React from "react";
import FindCare from "../shared/FindPerfectCare";

const FacilitiesHero = () => {
  return (
    <section>
      <div className="">
        <FindCare
          imageSrc="/images/facilitieshero.jpg"
          heading="Explore Assisted Living Facilities Near You"
          buttonText="Get Started"
          subHeading="Browse a wide selection of assisted living facilities, compare their services, and discover the best match for your loved one’s needs all in one place."
          showButton={false}
        />
      </div>
    </section>
  );
};

export default FacilitiesHero;
