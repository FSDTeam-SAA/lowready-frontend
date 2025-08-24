"use client";

import React, { useState } from "react";
import { Clock3 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Blog = {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  link: string;
};

const blogs: Blog[] = [
  // ---- Demo blogs ----
  ...Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Blog Post ${i + 1}`,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ur adipiscing elit. Purus, elit nibh et nisl,  Purus, elit nibh et nisl, pellentesque scelerisque ur adipiscing elit. Purus, elit nibh et nisl,  faucibus facilisis at.",
    date: "14 August, 2025",
    readTime: "12 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  })),
];

const ITEMS_PER_PAGE = 4;

export default function AllBlogs() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = blogs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function for pagination numbers with ellipsis
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
        {currentBlogs.map((blog) => (
          <Card
            key={blog.id}
            className="w-full bg-[#F8F9FA] hover:shadow-xl hover:drop-shadow-xl shadow-none border-none transition-shadow duration-300 rounded-lg"
          >
            {/* Image */}
            <Image
              src={blog.image}
              alt={blog.title}
              width={400}
              height={250}
              className="w-full object-cover rounded-t-lg"
            />

            <CardContent className="p-4">
              {/* Meta Info */}
              <div className="flex justify-between items-center gap-4 text-gray-500 text-sm mb-2">
                <span className="flex justify-center items-center ">
                  {/* Calendar SVG */}
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
                  <span className="ml-1">{blog.date}</span>
                </span>

                <span className="flex justify-center items-center text-[#8E938F]">
                  <Clock3 className="w-4 h-4" />
                  <span className="ml-1">{blog.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#191D23] mb-2">
                {blog.title}
              </h3>

              {/* Description + Read More */}
              <p className="text-[16px] text-[#68706A] mb-3">
                {blog.description.split(" ").slice(0, 25).join(" ")}
                {blog.description.split(" ").length > 25 && " ... "}
                <a
                  href={blog.link}
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
