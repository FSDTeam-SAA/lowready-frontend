import Image from "next/image";
import React from "react";

const WhyAlhHub = () => {
  return (
    <div className="bg-[#F8F9FA] bg-cover">
      <div className="container mx-auto space-y-4 lg:space-y-20 py-10 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-20 lg:px-12 xl:p-20 ">
        <div className="">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1
              className="text-2xl  font-playfair  sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6"
            >
              Why Choose <span className="text-green-600">ALH Hub</span>
            </h1>
            <p className="text-gray-600 w-full mx-auto text-sm sm:text-base leading-relaxed px-2 sm:px-0">
              Trusted, transparent, and easy to everything families need to find
              the perfect care for their loved ones.
            </p>
          </div>
        </div>

        {/* Main content - responsive layout */}
        <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[700px] mt-5 gap-6 md:gap-8">
  {/* Left Images - full width on mobile/tablet, half on desktop */}
  <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-3 md:gap-4">
    
    {/* Main image */}
    <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-[450px] lg:h-full">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src="/images/Alh-hub-1.jpg"
          alt="ALH Hub facility"
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    </div>

    {/* Secondary images */}
    <div className="w-full md:w-1/2 flex flex-col gap-3 md:gap-4">
      <div className="relative w-full h-64 sm:h-80 md:h-[220px] lg:h-1/2 rounded-lg overflow-hidden">
        <Image
          src="/images/Alh-hub-2.jpg"
          alt="ALH Hub care"
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="relative w-full h-64 sm:h-80 md:h-[220px] lg:h-1/2 rounded-lg overflow-hidden">
        <Image
          src="/images/Alh-hub-3.jpg"
          alt="ALH Hub service"
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    </div>
  </div>

  {/* Right Content - full width on mobile/tablet, half on desktop */}
  <div className="w-full lg:w-1/2 px-0 md:px-4 lg:px-10 space-y-6 md:space-y-12 lg:space-y-16">
    {[
      {
        img: "/images/01.png",
        title: "Transparent Search",
        text: "Easily explore assisted living facilities with clear, upfront information and no hidden fees or commissions.",
      },
      {
        img: "/images/02.png",
        title: "Personalized Assistance",
        text: "Get tailored recommendations based on your needs and preferences.",
      },
      {
        img: "/images/03.png",
        title: "Verified Listings",
        text: "All listings are thoroughly verified for trust and safety.",
      },
      {
        img: "/images/04.png",
        title: "24/7 Support",
        text: "Our team is available around the clock to assist you.",
      },
    ].map((item, index) => (
      <div
        key={index}
        className="relative flex flex-col justify-center p-6"
      >
        {/* Icon in background */}
        <Image
          src={item.img}
          alt="icon"
          width={120}
          height={120}
          className="absolute top-0 left-0 opacity-70 z-0"
        />
        {/* Text content */}
        <div className="relative z-10">
          <h3 className="text-gray-800 font-bold mb-2 text-2xl">
            {item.title}
          </h3>
          <p className="text-gray-500 text-base">{item.text}</p>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

export default WhyAlhHub;
