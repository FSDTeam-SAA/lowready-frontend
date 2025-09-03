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
  placeholder = "Find assisted living homes near you...",
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
  const locations: Location[] = useMemo(
    () => locationdata?.data || [],
    [locationdata]
  );

  // initialize location once data is available
  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[locations.length-1].location);
      setQuery(locations[0].location); 
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
    <div className="flex items-center py-3 px-3 w-full bg-white rounded-md overflow-hidden">
      {/* Location Selector */}
      <div className="flex items-center gap-1 px-3 border-r">
        <MapPin className="h-6 w-6 text-primary cursor-pointer" />
        <Select value={selectedLocation} onValueChange={handleLocationChange}>
          <SelectTrigger className="p-0 border-none text-[#68706A] w-[125px] overflow-hidden cursor-pointer shadow-none">
            <SelectValue
              placeholder={`${selectedLocation} || Location`}
              className="focus-visible:ring-[0px] outline-none border-none"
            />
          </SelectTrigger>
          <SelectContent className="shadow-none cursor-pointer border-none">
            {locations.map((loc) => (
              <SelectItem
                key={loc._id}
                value={loc.location}
                className="shadow-none  cursor-pointer border-none"
              >
                {loc.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <Input
        className="flex px-3 rounded-none  focus-visible:ring-[0px] shadow-none text-[#8E938F] outline-none h-full border-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 flex items-center gap-1"
      >
        <Search className="h-4 w-4" /> Search
      </Button>
    </div>
  );
};