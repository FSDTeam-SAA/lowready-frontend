import React from "react";
import RecentBlogs from "./RecentBlogs";
import StayUpdated from "./StayUpdated";
import AllBlogs from "./AllBlogs";
import SmallHero from "../shared/SmallHero";

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
      <StayUpdated />
      <AllBlogs />
    </div>
  );
}
