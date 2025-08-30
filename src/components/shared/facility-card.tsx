"use client";

import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { FacilityCards } from "@/lib/api";
import Link from "next/link";

interface FacilityCardProps {
  facility: FacilityCards;
  onSeeDetails: (facilityId: string) => void;
  onBookTour: (facilityId: string) => void;
}

export default function FacilityCard({
  facility,

  onBookTour,
}: FacilityCardProps) {
  console.log("facility asa", facility);

  return (
    <Card className="w-full overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 py-0 ">
      <div className="relative ">
        <Image
          src={facility?.images?.[0]?.url || "/search.png"}
          alt={facility?.name}
          width={490}
          height={321}
          className="object-cover h-[321px] "
        />
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {facility?.name}
            </h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900">
                  {facility?.rating ?? 0}
                </span>
                <span className="text-sm text-gray-500">
                  ({facility?.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{facility?.location}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {facility.amenities?.map((category) => (
            <p className="px-4 py-2 rounded-sm" key={category}>
              {category}
            </p>
          ))}
        </div>

        {/* Price */}
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              ${facility?.price?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/ Month</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="w-1/2" variant="outline">
            <Link
              className="w-full h-full cursor-pointer"
              href={`/facilities/details/${facility?._id}`}
            >
              See Details
            </Link>
          </Button>
          <Button
            className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onBookTour(facility?._id)}
          >
            Book a Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
