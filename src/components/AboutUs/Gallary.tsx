"use client";

import Image from "next/image";
import React from "react";

export default function Gallary() {
  return (
    <section className="bg-[#F8F9FA] py-12">
      <div className="container mx-auto px-4">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
          {/* Row 1 */}
          <div className="lg:col-span-4 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary1.jpg"
              alt="Gallery Image 1"
              fill
              
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-4 aspect-auto relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary2.jpg"
              alt="Gallery Image 2"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-4 aspect-auto relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary3.jpg"
              alt="Gallery Image 3"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Row 2 */}
          <div className="lg:col-span-3 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary4.jpg"
              alt="Gallery Image 4"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-3 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary5.jpg"
              alt="Gallery Image 5"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-6 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary6.jpg"
              alt="Gallery Image 6"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Row 3 */}
          <div className="lg:col-span-4 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary7.jpg"
              alt="Gallery Image 7"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-4 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary8.jpg"
              alt="Gallery Image 8"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-4 relative h-56 sm:h-64 lg:h-72 overflow-hidden rounded-xl">
            <Image
              src="/gallary/gallary9.jpg"
              alt="Gallery Image 9"
              fill
              className="object-cover aspect-auto rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
