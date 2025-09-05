"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { facilitiesLocation, Location } from "@/lib/api";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (location: string, query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Find assisted living homes near you",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const router = useRouter();

  // Fetch locations
  const { data: locationdata } = useQuery({
    queryKey: ["locationdata"],
    queryFn: facilitiesLocation,
  });
  // Get unique locations by removing duplicates based on location name
  const locations: Location[] = useMemo(() => {
    if (!locationdata?.data) return [];

    const uniqueLocations = locationdata.data.reduce(
      (acc: Location[], current: Location) => {
        const existingLocation = acc.find(
          (loc) => loc.location === current.location
        );
        if (!existingLocation) {
          acc.push(current);
        }
        return acc;
      },
      []
    );

    return uniqueLocations;
  }, [locationdata]);

  // Initialize location once data is available - use the same location for both
  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      const defaultLocation = locations[0].location; // Use first location consistently
      setSelectedLocation(defaultLocation);
      setQuery(defaultLocation);
    }
  }, [locations, selectedLocation]);

  const handleSearch = () => {
    if (onSearch) onSearch(selectedLocation, query);

    router.push(
      `/search?location=${encodeURIComponent(
        selectedLocation
      )}&q=${encodeURIComponent(query)}`
    );
    setSelectedLocation("");
  };

  // ✅ when location changes, also set query
  const handleLocationChange = (val: string) => {
    setSelectedLocation(val);
    setQuery(val);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile-first: Stack vertically on small screens, horizontal on larger screens */}
      <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden">
        {/* Location Selector */}
        <div className="flex items-center gap-2 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-gray-200 sm:min-w-0 sm:flex-shrink-0">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="p-0 border-none text-gray-600 min-w-0 flex-1 sm:w-auto sm:min-w-[120px] sm:max-w-[160px] shadow-none focus:ring-0">
              <SelectValue placeholder="Location" className="truncate" />
            </SelectTrigger>
            <SelectContent className="max-w-[90vw] sm:max-w-none">
              {locations.map((loc) => (
                <SelectItem
                  key={loc._id}
                  value={loc.location}
                  className="cursor-pointer"
                >
                  {loc.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="flex-1 min-w-0">
          <Input
            className="border-none focus-visible:ring-0 shadow-none text-gray-700 placeholder:text-gray-400 px-4 py-3 sm:py-2 h-auto rounded-none bg-transparent"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Search Button */}
        <div className="p-2 sm:p-1">
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 flex items-center justify-center gap-2 font-medium transition-colors duration-200"
            size="sm"
          >
            <Search className="h-4 w-4" />
            <span className="sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
