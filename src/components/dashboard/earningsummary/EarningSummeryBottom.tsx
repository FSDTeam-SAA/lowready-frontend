'use client'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData, getallFacilitiesdata, mapApiBookingToBookingData } from "@/lib/api";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import {  MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const EarningSummeryBottom = () => {
  const { data: session } = useSession();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: recentPlacement } = useQuery({
    queryKey: ["bookings", session],
    queryFn: () =>
      getallFacilitiesdata(session?.user.id || "", currentPage, itemsPerPage),
    enabled: !!session,
  });
   const bookings: BookingData[] =
      recentPlacement?.data.map((b) => mapApiBookingToBookingData(b)) || [];
  return (
    <section className="px-5  py-[24px]">
      <div className="flex justify-between gap-5 ">
        <div className="w-1/2">
             <Card className="bg-white p-5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Placements
              </CardTitle>
              <Link href="/dashboard/placements">
                <button className="text-green-600 text-sm font-medium cursor-pointer hover:text-green-700">
                  See all
                </button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={booking.images?.[0]?.url}
                            alt={booking.customer.name}
                          />
                          <AvatarFallback>
                            {booking.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.bookerInfo.emailAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {booking.location}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${booking.price.toLocaleString()}
                        </p>
                      </div>
                      <Link className="cursor-pointer" href={`/dashboard/placements/`}>
                        <button className="px-3 py-1.5 cursor-pointer text-xs font-medium rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-500">No recent placements</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-1/2">
          <Card className="bg-white p-5 w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4 w-full">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Referral Fee (18%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 gap-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        OR
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Olivia Rhye
                      </p>
                      <p className="text-xs text-gray-500">
                        example@example.com
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      $2,000
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">$2,000</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EarningSummeryBottom;
