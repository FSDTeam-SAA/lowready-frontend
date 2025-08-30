"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

import Image from "next/image";
import { Facility } from "@/lib/api";

interface FacilityCardProps {
  facility: Facility;
  onEdit: () => void;
}

export function FacilityCard({ facility, onEdit }: FacilityCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Image */}
        <div className="w-64 h-48 bg-gray-200 flex-shrink-0">
          <Image
            src={
              facility.images?.[0]?.url ||
              "/placeholder.svg?height=192&width=256&query=assisted living facility"
            }
            alt={facility.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {facility.name}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{facility.location}</span>
              </div>
              <Badge
                variant={
                  facility.availability === true ? "default" : "secondary"
                }
                className={
                  facility.availability === true
                    ? "bg-green-100 text-green-800"
                    : "bg-[#FCD9DE] text-[#E5102E] "
                }
              >
                {facility.availability ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {facility.description}
          </p>

          {/* Amenities */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {facility.amenities.slice(0, 12).map((amenity, index) => (
              <div
                key={index}
                className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
              >
                {amenity}
              </div>
            ))}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                $ {facility.price.toLocaleString()}
              </span>
              <span className="text-gray-600 ml-1">/ {facility.base}</span>
            </div>
            <Button
              onClick={onEdit}
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
            >
              Edit Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
