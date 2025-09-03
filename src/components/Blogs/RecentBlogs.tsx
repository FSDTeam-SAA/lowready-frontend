"use client";

import Image from "next/image";
import { Calendar, Clock3 } from "lucide-react";
import React from "react";
import RecentBlogsSkeleton from "./RecentBlogsSkeleton";
import { getAllBlogs } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

// Define Blog type
interface Blog {
  _id: string;
  title: string;
  description: string;
  image?: { url: string };
  createdAt: string;
}

export default function RecentBlogs() {
  const { data: allBlogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => getAllBlogs(),
  });

  if (isLoading) {
    return <RecentBlogsSkeleton />;
  }

  // Use the fetched blogs data
  const blogs: Blog[] = allBlogs?.data || [];

  return (
    <section className="py-10 md:py-20 lg:py-20 bg-[#F8F9FA]">
      <div className="mx-auto container">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Recent blog posts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Big Blog */}
          {blogs[0] && (
            <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
              <Image
                src={blogs[0].image?.url || ""}
                alt={blogs[0].title}
                width={600}
                height={600}
                className="w-full h-56 md:h-48 object-cover"
              />
              <div className="p-5">
                {/* Meta */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(blogs[0].createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} />5 min read
                  </span>
                </div>
                {/* Title */}
                <Link href={`/blogs/${blogs[0]._id}`}>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 hover:underline hover:text-primary">
                    {blogs[0].title}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-2">
                  {blogs[0].description.split(" ").slice(0, 30).join(" ")}...
                  <Link
                    href={`/blogs/${blogs[0]._id}`}
                    className="text-green-600 font-medium hover:underline"
                  >
                    Read More
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Right Two Small Blogs */}
          <div className="flex flex-col gap-6">
            {blogs.slice(1, 3).map((blog: Blog) => (
              <div
                key={blog._id}
                className="flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Image
                  src={blog.image?.url || ""}
                  alt={blog.title}
                  width={176}
                  height={150}
                  className="object-cover"
                />
                <div className="p-4 flex flex-col justify-between">
                  {/* Meta */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={14} />5 min read
                    </span>
                  </div>
                  {/* Title */}
                  <Link href={`/blogs/${blog._id}`}>
                    <h3 className="text-md md:text-lg font-semibold text-gray-900 mb-1 hover:underline hover:text-primary">
                      {blog.title}
                    </h3>
                  </Link>
                  {/* Desc */}
                  <p className="text-sm text-gray-600">
                    {blog.description.split(" ").slice(0, 33).join(" ")}...
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="text-green-600 font-medium hover:underline"
                    >
                      Read More
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}