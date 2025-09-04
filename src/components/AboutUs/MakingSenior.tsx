import Image from "next/image";
import React from "react";

export default function MakingSenior() {
  return (
    <section className="bg-[#F8F9FA]">
      <div className="mx-auto container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-10">
          {/* Left side - images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="row-span-2">
              <Image
                src="/about/aboutImage1.png"
                alt="about image 1"
                width={400}
                height={400}
                className="rounded-lg object-cover w-full h-full "
              />
            </div>
            <Image
              src="/about/aboutImage2.png"
              alt="about image 2"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full h-full"
            />
            <Image
              src="/about/aboutImage3.png"
              alt="about image 3"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          {/* Right side - text */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold"  style={{ fontFamily: "var(--font-playfair)" }}>
              Making Senior Care{" "}
              <span className="text-primary">Accessible and Transparent</span>
            </h2>
            <p className="text-[#68706A] leading-relaxed text-base">
              At ALH Hub, our mission is to bridge the gap between families
              seeking quality care for their loved ones and the smaller
              residential assisted living facilities that often go unnoticed. We
              believe every family deserves transparency, trust, and direct
              access to the people who will be providing care. By removing
              unnecessary intermediaries, we make the process faster, simpler,
              and more personal giving families the confidence to make informed
              decisions.
            </p>
            <p className="text-[#68706A] leading-relaxed text-base">
              For facilities, our platform offers the opportunity to shine in a
              competitive market without being overshadowed by larger providers.
              We provide tools to manage leads, schedule tours, update
              availability, and showcase services in a way that truly reflects
              their values and care standards. Our goal is to create a space
              where meaningful connections are made, ensuring that residents
              receive the right care in the right place at the right time and
              right day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
