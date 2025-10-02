import SimilarBlogs from "@/components/Blogs/SimilarBlogs";
import ResidentialFacility from "@/components/facilities/ResidentialFacility";
import { FacilitiesCarousel } from "@/components/landing/facilities-carousel";
import { ReviewFamilyCarousel } from "@/components/landing/FamilyReview";
import FAQ from "@/components/landing/FAQ";
import HowWorks from "@/components/landing/HowWorks";
import WhyAlhHub from "@/components/landing/WhyAlhHub";

import FindCare from "@/components/shared/FindPerfectCare";
import Hero from "@/components/shared/Hero";
import StillHaveQuestions from "@/components/shared/StillHaveQuestions";

export default function Home() {
  return (
    <main role="main">
      <Hero />
      <HowWorks />
      <FacilitiesCarousel />
      <WhyAlhHub />
      <ReviewFamilyCarousel />
      <FindCare
        imageSrc="/images/findcare.jpg"
        heading="Ready to find the perfect care for your loved one?"
        subHeading="Easily search, compare, and connect with trusted assisted living facilities, helping your loved ones find a safe, comfortable, and supportive environment while giving you peace of mind every step of the way."
        buttonText="Book a Tour"
        showButton={true}
      />
      <SimilarBlogs />
      <ResidentialFacility />
      <FAQ />
      <StillHaveQuestions />
    </main>
  );
}
