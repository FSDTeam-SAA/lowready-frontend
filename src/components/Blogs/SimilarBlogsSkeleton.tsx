"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimilarBlogsSkeleton() {
  return (
    <div className="container mx-auto py-16">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-48 mx-auto mb-4" />
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>

      {/* Blog Cards Skeleton (4 items for grid/slider look) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="w-full bg-[#F8F9FA] shadow-none border-none rounded-lg"
          >
            {/* Image skeleton */}
            <Skeleton className="w-full h-56 md:h-64 lg:h-72 rounded-t-lg" />

            <CardContent className="p-4">
              {/* Meta Skeleton */}
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Title Skeleton */}
              <Skeleton className="h-5 w-3/4 mb-2" />

              {/* Description Skeleton */}
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-3" />

              {/* Read More button Skeleton */}
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
