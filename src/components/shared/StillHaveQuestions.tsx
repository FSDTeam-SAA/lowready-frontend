import React from "react";

export default function StillHaveQuestions() {
  return (
    <section
      className={`bg-[#F8F9FA] py-20`}>

      <div className="container mx-auto px-4  bg-[url(/images/BG.png)] bg-no-repeat">
        {/* Inner card/container background */}
        <div className=" py-16 rounded-xl relative overflow-hidden">
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
