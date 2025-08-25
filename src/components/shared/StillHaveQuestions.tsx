import React from "react";

export default function StillHaveQuestions() {
  return (
 
    <section className="bg-[#F8F9FA]">
      <div className="container mx-auto px-4  md:px-20">
        {/* Inner card/container background */}
        <div className="bg-white py-16 rounded-xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute w-80 h-96 rounded-full border-7 border-green-200 opacity-15 top-[-50px] left-[800px]"></div>
          <div className="absolute w-80 h-96 rounded-full border-7 border-green-200 opacity-15 bottom-[-20px] right-[150px]"></div>

          {/* Content */}
          <div className="relative z-10 text-center mx-auto">
            <h2
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-2" 
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Still Have <span className="text-primary">Questions?</span>
            </h2>
            <p className="text-sm md:text-base text-[#68706A] mb-14 mt-1 w-full">
              Our team is here to provide personalized guidance and support —
              reach out anytime.
            </p>

            <form className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 w-full sm:w-auto cursor-pointer"
              >
                Contact Us
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
