"use client";
import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useSearchParams } from "next/navigation";
import {  fetchReviews, Review } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";


const AllReviewCard = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id") || "";

  const {
    data: reviewsResponse,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
    enabled: !!id,
  });

  const reviews = reviewsResponse?.data || [];

  if (isLoadingReviews) {
    <div>
      <h2>Loding....</h2>
    </div>;
  }
  if (reviewsError) {
    <div>
      <h2>Error</h2>
    </div>;
  }
  console.log('reviewssss',reviews);
  
  return (
    <section>
      <div className="container mx-auto">
        <div className="text-center pt-[40px] lg:pt-[80px]">
          <h2 className="text-[40px] font-bold leading-[150%] ">
            What Families Say <span className="text-[#28A745]">About Us</span>{" "}
          </h2>
          <p className="text-[16px] leading-[150%] font-normal text-[#68706A] pt-1">
            Honest experiences and heartfelt stories from residents and their
            loved ones.
          </p>
        </div>
        {reviews.map((item: Review, id:number) => (
          <Card key={id} className="mt-[40px] lg:mt-[80px]">
            <CardHeader className="flex justify-between">
              <div className="flex items-center">
                <Image
                  src={"/reviewprofile.png"}
                  alt="review profile "
                  width={40}
                  height={40}
                />
                <div>
                  <h2 className="text-[20px] font-semibold leading-[150%] text-[#343A40]">
                    {item.userId.firstName} {item.userId.lastName}
                  </h2>
                  <p>Protiand OR</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < item.star
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm pt-4 text-[#68706A] font-medium ">
                {item.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AllReviewCard;
