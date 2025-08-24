import React from "react";
import Image from "next/image";
import { Calendar, Clock3, Users } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Choosing the Right Assisted Living",
    date: "14 August, 2025",
    readTime: "12 min read",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci adipiscing elit. Purus, elit nibh et nisl,  Purus, elit nibh et nisl, pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra diam lectus odio orci adipiscing elit. Purus, elit nibh et nisl pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra viverra.",
    image: "/images/blogImage.jpg",
    link: "#",
  },
];

export default function BlogDetailes() {
  const blog = blogs[0];

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <article className="w-full mx-auto overflow-hidden">
        {/* Top Image (full width inside container) */}
        <div className="w-full relative h-64 md:h-[420px] rounded-2xl overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Meta: date & read time */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 px-4 md:px-8 py-4  ">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="text-[#68706A]">Chris T</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span className="text-[#68706A]">{blog.date}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4" aria-hidden="true" />
            <span className="[#68706A]">{blog.readTime}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="px-4 md:px-8 py-4 md:py-6">
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
