"use client";

import React, { useState } from "react";
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

interface SearchBarProps {
  locations?: string[];
  placeholder?: string;
  onSearch?: (location: string, query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  locations = ["Location 1", "Location 2", "Location 3"],
  placeholder = "Find assisted living homes near you...",
  onSearch,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(selectedLocation, query);
  };

  return (
    <div className="flex items-center py-3 px-3 w-full bg-white rounded-md overflow-hidden">
      {/* MapPin with right border */}
      <div className="flex items-center px-3 border-r">
        <MapPin className="h-6 w-6 text-primary" />
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="p-0 border-none bg-transparent  shadow-none">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="shadow-none border-none">
            {locations.map((loc) => (
              <SelectItem
                key={loc}
                value={loc}
                className="shadow-none border-none"
              >
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <Input
        className="flex px-3 rounded-none focus:ring-0 shadow-none h-full border-none"
        placeholder={placeholder}
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
      />

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="bg-green-600 hover:bg-green-700 text-white px-4 flex items-center gap-1"
      >
        <Search className="h-4 w-4" /> Search
      </Button>
    </div>
  );
};
