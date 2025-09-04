import React from "react";

interface SmallHeroProps {
  imageSrc?: string;
  heading?: string;
  subHeading?: string;
  description?: string;
}

export default function SmallHero({
  imageSrc = "/images/smallhero.jpg",
  heading = "Default Heading",
  subHeading = "Default Subheading",
  description = "This is a reusable hero section. Pass props to customize content easily.",
}: SmallHeroProps) {
  return (
    <section className="p-6 sm:p-12 bg-[#F8F9FA] bg-cover">
      <div
        className="container mx-auto h-72 rounded-md bg-cover bg-center bg-black/50 bg-blend-overlay py-10"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6">
          {/* Heading + Subheading in same line */}
          <h2
            className="text-2xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {heading}{" "}
            <span className="text-[#28A745]">{subHeading}</span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-300 max-w-4xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
