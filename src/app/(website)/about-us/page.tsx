import Gallary from "@/components/AboutUs/Gallary";
import MakingSenior from "@/components/AboutUs/MakingSenior";
import WhyWeStarted from "@/components/AboutUs/WhyWeStarted";
import HowWorks from "@/components/landing/HowWorks";
import FindCare from "@/components/shared/FindPerfectCare";
import React from "react";

export default function page() {
  return (
    <div>
      <FindCare
        imageSrc="/about/about-us.jpg"
        heading="Reach Out to ALH Hub for Support & Guidance"
        subHeading="Our team is ready to assist you with any questions, provide guidance, and help you confidently connect with the most suitable assisted living facilities for your loved ones."
        buttonText="Get Started"
        showButton={false}
      />
      <MakingSenior />
      <HowWorks />
      <WhyWeStarted />
      <Gallary />
      <FindCare
        imageSrc="/about/aboutImage10.jpg"
        heading="Ready to find the perfect care for your loved one?"
        subHeading="Easily search, compare, and connect with trusted assisted living facilities, helping your loved ones find a safe, comfortable, and supportive environment while giving you peace of mind every step of the way."
        buttonText="Book a Tour Now"
        showButton={true}
      />
    </div>
  );
}
