"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useSearchParams } from "next/navigation";
import { fetchReviews, Review } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

const REVIEWS_PER_PAGE = 8;

const AllReviewCard = () => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("id") || "";

  const [page, setPage] = useState(1);

  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", facilityId, page],
    queryFn: () => fetchReviews(facilityId, page, REVIEWS_PER_PAGE),
  });

  const reviews = reviewsResponse?.data || [];
  const totalPages = reviewsResponse?.meta.totalPages || 1;

  if (isLoading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error loading reviews</h2>
      </div>
    );
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <section>
      <div className="container mx-auto">
        <div className="text-center pt-[40px] lg:pt-[80px]">
          <h2 className="text-[40px] font-bold leading-[150%]">
            What Families Say <span className="text-[#28A745]">About Us</span>
          </h2>
          <p className="text-[16px] leading-[150%] font-normal text-[#68706A] pt-1">
            Honest experiences and heartfelt stories from residents and their
            loved ones.
          </p>
        </div>

        {reviews.map((item: Review, idx: number) => (
          <Card key={idx} className="mt-[24px] lg:mt-[24px] py-5">
            <CardHeader className="flex justify-between">
              <div className="flex gap-3 items-center">
                <Image
                  src={"/reviewprofile.png"}
                  alt="review profile"
                  width={50}
                  height={50}
                />
                <div>
                  <h2 className="text-[20px] font-semibold leading-[150%] text-[#343A40]">
                    {item.userId.firstName} {item.userId.lastName}
                  </h2>
                  <p>{item.userId.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < item.star
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-[#C0C3C1] fill-[#C0C3C1]"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-[16px] pt-4 text-[#68706A] font-medium">
                {item.comment}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Pagination */}
        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2  cursor-pointer bg-green-400 rounded disabled:opacity-50"
          >
            Prev
          </Button>

          <span className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <Button className="cursor-pointer"
                  key={pageNumber}
                  variant={pageNumber === page ? "default" : "outline"}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              )
            )}
          </span>

          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-green-400 cursor-pointer rounded disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AllReviewCard;
