import Link from "next/link";
import { Button } from "../ui/button";

const FindCare = ({
  imageSrc = "/images/findcare.jpg", // Default background image
  heading = "Ready to find the perfect care for your loved one?", // Default heading
  subHeading = "Easily search, compare, and connect with trusted assisted living facilities, helping your loved ones find a safe, comfortable, and supportive environment while giving you peace of mind every step of the way.", // Default subheading
  buttonText = "Book a Tour Now", // Default button text
  showButton = true, // Flag to conditionally render the button
  buttonlink = "/facilities"
}) => {
  return (
   <section className="p-4 sm:p-20 bg-[#F8F9FA] bg-cover">
      <div
        className="container mx-auto h-[275px] rounded-md bg-cover bg-center bg-black/60 bg-blend-overlay"
        style={{ backgroundImage: `url(${imageSrc})` }}  
      >
        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 lg:px-8">
          <h1
            className="text-2xl  md:text-4xl lg:text-[40px]  mb-6 md:mb-2 font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {heading.split(" ")[0]}{" "}
            <span className="text-green-500">{heading.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className=" text-sm font-normal tracking-wide text-[#F8F9FA] md:text-[16px]  w-[80%] text-center  leading-[150%]">
            {subHeading}
          </p>
          {showButton && (
            <div className="mt-8">
              <Link href={buttonlink} >
              <Button size="lg" className="w-[200px] text-[16px] cursor-pointer">
                {buttonText}
              </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FindCare;
