"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselNavigation } from "@/components/shared/carousel-navigation";
// import { Clock3 } from "lucide-react";
import { getAllBlogs } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import SimilarBlogsSkeleton from "./SimilarBlogsSkeleton";

// Blog type based on API
interface Blog {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  readTime?: string;
  image: { url: string; public_id: string };
}

export default function SimilarBlogs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const { data: blogsResponse, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => getAllBlogs(),
  });

  // Use API data if available, otherwise fallback to empty array
  const blogs: Blog[] = blogsResponse?.data || [];

  // Responsive slides
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1280) {
        setSlidesToShow(4);
      } else if (window.innerWidth >= 1024) {
        setSlidesToShow(3);
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const totalSlides = Math.max(0, blogs.length - slidesToShow + 1);

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Helper function: strip HTML tags
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  if (isLoading) return <SimilarBlogsSkeleton />;

  return (
    <div className="container mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair">
          Similar <span className="text-primary">Blogs</span>
        </h2>
        <p className="text-[#68706A] mt-3 mx-auto  ">
          Explore helpful articles, tips, and updates on senior care, assisted
          living, and making informed decisions for your loved ones.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden py-6 lg:py-6">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
          }}
        >
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              <Card className="w-full bg-[#F8F9FA] hover:shadow-xl hover:drop-shadow-xl shadow-none border-none transition-shadow duration-300 rounded-lg">
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
                <CardContent className="p-4">
                  {/* Meta */}
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
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                    {/* <span className="flex justify-center items-center text-[#8E938F]">
                      <Clock3 className="w-4 h-4" />
                      <span className="ml-1">
                        {blog.readTime || "5 min read"}
                      </span>
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
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {totalSlides > 1 && (
        <CarouselNavigation
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onDotClick={handleDotClick}
        />
      )}
    </div>
  );
}
