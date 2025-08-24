import { FacilitiesCarousel } from "@/components/landing/facilities-carousel";
import { ReviewFamilyCarousel } from "@/components/landing/FamilyReview";
import FAQ from "@/components/landing/FAQ";
import HowWorks from "@/components/landing/HowWorks";
import BlogsCard from "@/components/shared/blogs";
import FindCare from "@/components/shared/FindPerfectCare";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/shared/Hero";
// import Navbar from "@/components/shared/Navbar";
// import TopBanner from "@/components/shared/TopBanner";

export default function Home() {
  return (
    <main role="main">
      {/* <TopBanner />
      <Navbar /> */}
      <Hero />
      <FacilitiesCarousel />
      <FindCare />
      <HowWorks />
      <ReviewFamilyCarousel />
      <FindCare
        imageSrc="/images/findcare.jpg"
        heading="Looking for the best care for your loved ones?"
        subHeading="We help you find the safest and most comfortable assisted living facilities."
        buttonText="Get Started"
        showButton={true}
      />
      <FAQ />
      <BlogsCard />
      <Footer />
    </main>
  );
}
