"use client";

import AllReview from "@/components/allreview/AllReview";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <section>
      <div className="container mx-auto">
        <Suspense fallback={<h2 className="text-center py-10">Loading reviews...</h2>}>
          <AllReview />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
