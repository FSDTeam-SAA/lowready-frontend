"use client";

import React, { useState } from "react";
// import { Clock3 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAllBlogsPagination } from "@/lib/api";
import Link from "next/link";
import AllBlogsSkeleton from "./AllBlogsSkeleton";

type Blog = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  readTime?: string;
  image: { url: string; public_id: string };
};

const ITEMS_PER_PAGE = 8;

export default function AllBlogs() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch blogs using React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allBlogs", currentPage],
    queryFn: () => getAllBlogsPagination(currentPage, ITEMS_PER_PAGE),
    // keepPreviousData: true,
  });

  const blogs: Blog[] = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  // Helper function: strip HTML tags
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  if (isLoading) return <AllBlogsSkeleton />;
  if (isLoading) return <div>loading...</div>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load blogs.</p>;

  return (
    <div className="px-6 py-12 mx-auto container">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          All <span className="text-green-600">Blogs</span>
        </h2>
        <p className="text-gray-500 mt-2 mx-auto">
          Browse all our articles, tips, and stories to stay informed and make
          the best decisions for your loved ones’ care.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            className="w-full bg-[#F8F9FA] hover:shadow-xl hover:drop-shadow-xl shadow-none border-none transition-shadow duration-300 rounded-lg"
          >
            {/* Image */}
            <div className="w-full h-56 md:h-64 lg:h-72 relative">
              <Image
                src={blog.image?.url || "/images/blogImage.jpg"}
                alt={blog.title}
                fill
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           25vw"
                priority={false}
              />
            </div>

            <CardContent className="">
              {/* Meta Info */}
              <div className="flex justify-between items-center gap-4 text-gray-500 text-sm mb-2">
                <span className="flex justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M11.3359 2.00033H14.0026C14.3708 2.00033 14.6693 2.29881 14.6693 2.66699V13.3337C14.6693 13.7019 14.3708 14.0003 14.0026 14.0003H2.0026C1.63442 14.0003 1.33594 13.7019 1.33594 13.3337V2.66699C1.33594 2.29881 1.63442 2.00033 2.0026 2.00033H4.66927V0.666992H6.0026V2.00033H10.0026V0.666992H11.3359V2.00033ZM2.66927 6.00033V12.667H13.3359V6.00033H2.66927ZM4.0026 7.33366H5.33594V8.66699H4.0026V7.33366ZM4.0026 10.0003H5.33594V11.3337H4.0026V10.0003ZM6.66927 7.33366H12.0026V8.66699H6.66927V7.33366ZM6.66927 10.0003H10.0026V11.3337H6.66927V10.0003Z"
                      fill="#8E938F"
                    />
                  </svg>
                  <span className="ml-1">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>

                {/* <span className="flex justify-center items-center text-[#8E938F]">
                  <Clock3 className="w-4 h-4" />
                  <span className="ml-1">{blog.readTime || "5 min read"}</span>
                </span> */}
              </div>

              {/* Title */}
              <Link href={`/blogs/${blog._id}`}>
                <h3 className="text-lg font-semibold text-[#191D23] mb-2 hover:underline">
                  {/* {blog.title} */}
                  {blog.title.split(" ").slice(0, 10).join(" ")}
                  {blog.title.split(" ").length > 10 && " ... "}
                </h3>
              </Link>

              {/* Description + Read More */}
              <p className="text-[16px] text-[#68706A] mb-3">
                {stripHtml(blogs[0].description)
                  .split(" ")
                  .slice(0, 30)
                  .join(" ")}
                ...
                <a
                  href={`/blogs/${blog._id}`}
                  className="text-green-600 font-medium hover:underline"
                >
                  Read More
                </a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-gray-600 text-sm">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
          results
        </p>
        <div className="flex items-center gap-2">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            ‹
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-3 py-1">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => handlePageChange(page as number)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-green-600 text-white border-green-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
