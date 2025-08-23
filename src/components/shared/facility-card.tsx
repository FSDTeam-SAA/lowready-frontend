"use client";

import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Facility } from "@/types/facility";

interface FacilityCardProps {
  facility: Facility;
  onSeeDetails: (facilityId: string) => void;
  onBookTour: (facilityId: string) => void;
}

export default function FacilityCard({
  facility,
  onSeeDetails,
  onBookTour,
}: FacilityCardProps) {
  return (
    <Card className="w-full overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={facility.image || "/placeholder.svg"}
          alt={facility.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {facility.name}
          </h3>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {facility.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({facility.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{facility.description}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {facility.categories.map((category) => (
            <Badge
              key={category.id}
              variant={category.type === "available" ? "default" : "secondary"}
              className={`text-xs px-2 py-1 ${
                category.type === "available"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Price */}
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              ${facility.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/ Month</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
            onClick={() => onSeeDetails(facility.id)}
          >
            See Details
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onBookTour(facility.id)}
          >
            Book a Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
