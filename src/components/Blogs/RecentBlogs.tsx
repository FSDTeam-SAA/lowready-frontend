"use client";

import Image from "next/image";
import { Calendar, Clock3 } from "lucide-react";
import React from "react";

const blogs = [
  {
    id: 1,
    title: "Choosing the Right Assisted Living",
    date: "14 August, 2025",
    readTime: "12 min read",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra ...",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 2,
    title: "Choosing the Right Assisted Living",
    date: "14 August, 2025",
    readTime: "12 min read",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, Purus, adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra  elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci  pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci...",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Choosing the Right Assisted Living",
    date: "14 August, 2025",
    readTime: "12 min read",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, Purus, adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra  elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra  elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci...",
    image: "/images/blogImage.jpg",
    link: "#",
  },
];

export default function RecentBlogs() {
  return (
    <section className="py-10 md:py-20 lg:py-20 bg-[#F8F9FA]">
      <div className=" mx-auto container">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 ">
          Recent blog posts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Big Blog */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
            <Image
              src={blogs[0].image}
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
                  {blogs[0].date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock3 size={14} />
                  {blogs[0].readTime}
                </span>
              </div>
              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {blogs[0].title}
              </h3>
              {/* Description */}
              <p className="text-sm text-gray-600 mb-2">
                {blogs[0].description.split(" ").slice(0, 30).join(" ")}
                {"... "}
                <a
                  href={blogs[0].link}
                  className="text-green-600 font-medium hover:underline"
                >
                  Read More
                </a>
              </p>
            </div>
          </div>

          {/* Right Two Small Blogs */}
          <div className="flex flex-col gap-6">
            {blogs.slice(1).map((blog) => (
              <div
                key={blog.id}
                className="flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={400}
                  className="w-32 md:w-44 h-40 object-cover"
                />
                <div className="p-4 flex flex-col justify-between">
                  {/* Meta */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={14} />
                      {blog.readTime}
                    </span>
                  </div>
                  {/* Title */}
                  <h3 className="text-md md:text-lg font-semibold text-gray-900 mb-1">
                    {blog.title}
                  </h3>
                  {/* Desc */}
                  <p className="text-sm text-gray-600">
                    {blog.description.split(" ").slice(0, 33).join(" ")}{" "}
                    <a
                      href={blog.link}
                      className="text-green-600 font-medium hover:underline"
                    >
                      Read More
                    </a>
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
