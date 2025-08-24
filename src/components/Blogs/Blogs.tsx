import React from "react";
import FindCare from "../shared/FindPerfectCare";
import RecentBlogs from "./RecentBlogs";

export default function Blogs() {
  return (
    <div>
      <FindCare
        imageSrc="/blogs/blogImage.jpg"
        heading="Insights, Tips & Guidance for Families"
        subHeading="Explore helpful articles, expert advice, and real-life stories designed to guide families in making informed and confident decisions about senior care."
        buttonText="Get Started"
        showButton={false}
      />

      <RecentBlogs />
    </div>
  );
}
