import React from "react";
import RecentBlogs from "./RecentBlogs";
// import StayUpdated from "./StayUpdated";
import AllBlogs from "./AllBlogs";
import SmallHero from "../shared/SmallHero";
import CallToAction from "../shared/CallToAction";

export default function Blogs() {
  return (
    <div>
      {/* <FindCare
        imageSrc="/blogs/blogImage.jpg"
        heading="Insights, Tips & Guidance for Families"
        subHeading="Explore helpful articles, expert advice, and real-life stories designed to guide families in making informed and confident decisions about senior care."
        buttonText="Get Started"
        showButton={false}
      /> */}

      <SmallHero
        imageSrc="/contact/contactImage1.jpg"
        heading="Insights, Tips & Guidance"
        subHeading="for Families"
        description="Explore helpful articles, expert advice, and real-life stories designed to guide families in making informed and confident decisions about senior care.."
      />
      <RecentBlogs />
      <div className="container mx-auto">
        <CallToAction
          title="Own or manage a residential facility? "
          title1=" Join ALH Hub to connect"
          title2="with families directly."
          description="Showcase your residential facility, manage tour bookings seamlessly, and build direct, meaningful connections with families looking for trusted assisted living care for their loved ones."
          buttonText="List Your Facility"
          buttonlink="/facilities"
        />
      </div>
      {/* <StayUpdated /> */}
      <AllBlogs />
    </div>
  );
}
