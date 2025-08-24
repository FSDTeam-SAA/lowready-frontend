"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock3, Users } from "lucide-react";
import { getSingleBlog } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import BlogDetailsSkeleton from "./BlogDetailsSkeleton";

export default function BlogDetailes() {
  const pathName = usePathname();
  const pathParts = pathName.split("/");
  const id = pathParts[2];

  const {
    data: blogData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    enabled: !!id,
    queryFn: () => getSingleBlog(id!),
  });

  if (isLoading)
    return (
      <p className="text-center py-10">
        <BlogDetailsSkeleton />
      </p>
    );
  if (isError || !blogData?.data)
    return <p className="text-center py-10">Blog not found.</p>;

  const blog = blogData.data;

  // Optional: Calculate reading time dynamically
  const words = blog.description.split(" ").length;
  const readTime = Math.ceil(words / 200);  

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <article className="w-full mx-auto overflow-hidden">
        {/* Top Image */}
        <div className="w-full relative h-64 md:h-[420px] rounded-2xl overflow-hidden">
          <Image
            src={blog.image.url}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Meta: date & read time */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 px-4 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="text-[#68706A]">Chris T</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span className="text-[#68706A]">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4" aria-hidden="true" />
            <span className="text-[#68706A]">{readTime} min read</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="px-4 md:px-8 py-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#191D23] leading-snug mb-3">
            {blog.title}
          </h1>
          <p className="text-[#68706A] leading-relaxed text-base md:text-lg">
            {blog.description}
          </p>
        </div>
      </article>
    </section>
  );
}
