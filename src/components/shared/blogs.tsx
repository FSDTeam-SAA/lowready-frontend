"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselNavigation } from "@/components/shared/carousel-navigation"; // ✅ import navigation
import { Clock3 } from "lucide-react";

// Blog type
interface Blog {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  link: string;
}

// Dummy blog data
const blogsData: Blog[] = [
  {
    id: 1,
    title: "Choosing the Right Assisted Living",
    description:
      "This is the answer for the second question. You can nibh condimentum class. Augue orci conubia suscipit in condimentum consectetur adipiscing elit. Purus, elit nibh et nisl Lobortis euismod lacinia maecenas convallis tincidunt pharetra dui, ridiculus nec ultrices non curabitur aliquam, nibh platea vestibulum placerat dapibus nunc. Metus curae erat ac class pulvinar eleifend consequat condimentum sapien, in a mi tristique posuere porttitor laoreet dictum, parturient diam at faucibus massa commodo aliquet ultricies....",
    date: "14 August, 2025",
    readTime: "12 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 2,
    title: "How to Support Senior Loved Ones",
    description:
      "Pellentesque scelerisque faucibus facilisis at. Placerat morbi sem viverra Lobortis euismod lacinia maecenas convallis tincidunt pharetra dui, ridiculus nec ultrices non curabitur aliquam, nibh platea vestibulum placerat dapibus nunc. Metus curae erat ac class pulvinar eleifend consequat condimentum sapien, in a mi tristique posuere porttitor laoreet dictum, parturient diam at faucibus massa commodo aliquet ultricies....",
    date: "12 August, 2025",
    readTime: "8 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Making Informed Care Decisions",
    description:
      "Curabitur sit amet elit in sapien varius interdum non vel justo. Etiam in feugiat eros Lobortis euismod lacinia maecenas convallis tincidunt pharetra dui, ridiculus nec ultrices non curabitur aliquam, nibh platea vestibulum placerat dapibus nunc. Metus curae erat ac class pulvinar eleifend consequat condimentum sapien, in a mi tristique posuere porttitor laoreet dictum, parturient diam at faucibus massa commodo aliquet ultricies....",
    date: "10 August, 2025",
    readTime: "10 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 4,
    title: "Tips for Healthy Aging",
    description:
      "Integer aliquet, orci in bibendum luctus, turpis ante pretium velit Lobortis euismod lacinia maecenas convallis tincidunt pharetra dui, ridiculus nec ultrices non curabitur aliquam, nibh platea vestibulum placerat dapibus nunc. Metus curae erat ac class pulvinar eleifend consequat condimentum sapien, in a mi tristique posuere porttitor laoreet dictum, parturient diam at faucibus massa commodo aliquet ultricies....",
    date: "8 August, 2025",
    readTime: "7 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 4,
    title: "Tips for Healthy Aging",
    description:
      "Integer aliquet, orci in bibendum luctus, turpis ante pretium velit Lobortis euismod lacinia maecenas convallis tincidunt pharetra dui, ridiculus nec ultrices non curabitur aliquam, nibh platea vestibulum placerat dapibus nunc. Metus curae erat ac class pulvinar eleifend consequat condimentum sapien, in a mi tristique posuere porttitor laoreet dictum, parturient diam at faucibus massa commodo aliquet ultricies....",
    date: "8 August, 2025",
    readTime: "7 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  },
  {
    id: 4,
    title: "Tips for Healthy Aging",
    description:
      "Integer aliquet, orci in bibendum luctus, turpis ante pretium velit Lobortis euismod lacinia maecenas convallis tincidunt pharetra dui, ridiculus nec ultrices non curabitur aliquam, nibh platea vestibulum placerat dapibus nunc. Metus curae erat ac class pulvinar eleifend consequat condimentum sapien, in a mi tristique posuere porttitor laoreet dictum, parturient diam at faucibus massa commodo aliquet ultricies....",
    date: "8 August, 2025",
    readTime: "7 min read",
    image: "/images/blogImage.jpg",
    link: "#",
  },
];

export default function BlogPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  // Responsive slides
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1280) {
        setSlidesToShow(4); // Large desktop
      } else if (window.innerWidth >= 1024) {
        setSlidesToShow(3); // Desktop
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2); // Tablet
      } else {
        setSlidesToShow(1); // Mobile
      }
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const totalSlides = Math.max(0, blogsData.length - slidesToShow + 1);

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="container mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-playfair">
          Latest <span className="text-primary">Insights & Resources</span>
        </h2>
        <p className="text-[#68706A] mt-3 mx-auto max-w-2xl">
          Explore helpful articles, tips, and updates on senior care, assisted
          living, and making informed decisions for your loved ones.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden py-6 lg:py-10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
          }}
        >
          {blogsData.map((blog) => (
            <div
              key={blog.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              <Card className="w-full bg-[#F8F9FA] hover:shadow-xl hover:drop-shadow-xl shadow-none border-none transition-shadow duration-300 rounded-lg">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={250}
                  className="w-full object-cover rounded-t-lg"
                />
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
