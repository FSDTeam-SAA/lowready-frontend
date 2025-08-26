import React from "react";
import Image from "next/image";

export default function WhyWeStarted() {
  return (
    <section className="mt-20">
      <div className="px-4 sm:px-8 lg:px-16 py-10 md:py-14 lg:py-16 bg-[#F8F9FA] ">
        <div className=" mx-auto container">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1
              className="text-4xl font-semibold text-[#343A40]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Why We <span className="text-primary">Started</span>
            </h1>
            <p className="mt-2 text-gray-500">
              Created with a vision to make finding the right care simple,
              transparent, and compassionate.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text Section */}
            <div className="order-2 md:order-1">
              <p className="text-gray-700 leading-relaxed">
                The idea for ALH Hub was born from a simple observation —
                families searching for the right assisted living facility often
                face frustration, confusion, and a lack of transparency.
                Smaller, high-quality residential facilities frequently go
                unnoticed, overshadowed by larger corporations or lost in a sea
                of referral agencies that prioritize commissions over genuine
                connections. We saw the need for a platform that could strip
                away the noise, give families control over their search, and let
                facilities present their true value without unnecessary
                middlemen.
                <br />
                <br />
                Our vision is to create a trusted, easy-to-use space where
                meaningful relationships can form between families and care
                providers. By combining powerful search tools, direct
                communication channels, and transparent information, we aim to
                empower families to make confident decisions while helping
                smaller facilities thrive. ALH Hub is more than a directory — it’s
                a bridge that connects compassion, quality care, and the people
                who need it most.
              </p>
            </div>

            {/* Image Section */}
            <div className="rounded-lg overflow-hidden shadow-md order-1 md:order-2">
              <Image
                src="/about/aboutImage4.png"
                alt="Two women talking over tea"
                width={800}
                height={700}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
