"use client";
import React from "react";

export default function FaqSkeleton() {
  // Render 5 placeholder FAQ items
  const skeletonItems = Array.from({ length: 6 });

  return (
    <section className="bg-[#F8F9FA]">
      <div className="mx-auto container py-8">
        <div className="flex flex-col rounded-xl space-y-4">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="px-6 py-5 border-b border-gray-200 cursor-pointer animate-pulse"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Question placeholder */}
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>

                {/* Icon placeholder */}
                <div className="w-7 h-7 border border-gray-300 rounded-full"></div>
              </div>

              {/* Answer placeholder */}
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
