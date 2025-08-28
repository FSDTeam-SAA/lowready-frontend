import React from "react";

export default function StayUpdated() {
  return (
    <section className="bg-green-50 mx-auto container my-20 py-16 px-4 md:px-20 rounded-xl relative overflow-hidden">
      {/* Optional decorative circles */}
      <div className="absolute w-96 h-96 rounded-full border-7 border-green-200 opacity-15 top-[-50px] left-[800px]"></div>
      <div className="absolute w-96 h-96 rounded-full border-7 border-green-200 opacity-15 bottom-[-20px] right-[150px]"></div>

      <div className="relative z-10 text-center   mx-auto">
        <h2
          className="text-2xl md:text-4xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Stay Updated with{" "}
          <span className="text-primary">Senior Care Insights</span>
        </h2>
        <p className="text-sm md:text-base text-[#68706A] mb-14 mt-1 w-full">
          Subscribe to our newsletter for the latest articles, tips, and
          resources to help you make confident decisions for your loved ones.
        </p>

        <form className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-green-300 rounded-md pl-3 pr-14 py-3 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 w-full sm:w-auto cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
