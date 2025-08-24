"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailsSkeleton() {
  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <article className="w-full mx-auto overflow-hidden animate-pulse">
        {/* Top Image Skeleton */}
        <Skeleton className="w-full h-64 md:h-[420px] rounded-2xl mb-6" />

        {/* Meta Skeleton */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <Skeleton className="w-16 h-4 rounded" />
          <Skeleton className="w-20 h-4 rounded" />
          <Skeleton className="w-8 h-4 rounded" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-4">
          <Skeleton className="w-full md:w-3/4 h-8 md:h-10 rounded mb-3" />
          <Skeleton className="w-full h-4 rounded mb-2" />
          <Skeleton className="w-full h-4 rounded mb-2" />
          <Skeleton className="w-5/6 h-4 rounded" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-4/5 h-4 rounded" />
        </div>
      </article>
    </section>
  );
}
