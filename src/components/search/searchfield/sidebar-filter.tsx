"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Filter, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchFilters } from "./SearchField";
// import { number, string } from "zod";

interface Location {
  _id: string;
  location: string;
}

// interface FacilityFilters {
//   minPrice: number;
//   maxPrice?: number;
//   location: string;
//   availability: string[];
//   rating?: number;
//   careServices: string[];
//   amenities: string[];
//   page: number;
//   limit: number;
// }

interface FiltersSidebarProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  locations: Location[];
  minPriceInput: string;
  maxPriceInput: string;
  handleMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Collapsible Filter Section Component
const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
};

// Mobile Filter Sheet
const MobileFilterSheet = ({
  filters,
  setFilters,
  locations,
  minPriceInput,
  maxPriceInput,
  handleMinPriceChange,
  handleMaxPriceChange,
}: FiltersSidebarProps) => {
  const [open, setOpen] = useState(false);

  const handleResetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000000,
      location: "",
      availability: ["available", "unavailable", "limited"],
      rating: 0,
      careServices: [],
      amenities: [],
      page: 1,
      limit: 6,
    });
  };
  const uniqueLocations = locations.reduce((acc: Location[], current) => {
    const existingLocation = acc.find(
      (loc) => loc.location === current.location
    );
    if (!existingLocation) {
      acc.push(current);
    }
    return acc;
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice && filters.maxPrice < 1000000) count++;
    if (!filters.availability) count++;
    if (filters.rating) count++;
    if (filters.careServices.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden fixed bottom-4 right-4 z-[999999999999] shadow-lg border-green-500 border-1 "
          size="lg"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center justify-between  mt-5">
            <span >Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-red-500 hover:text-red-600 pr-5"
            >
              Clear All
            </Button>
          </SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect facility
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-0">
          {/* Price Range */}
          <FilterSection title="Price Range ">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPriceInput}
                  onChange={handleMinPriceChange}
                  className="h-10"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={maxPriceInput}
                  onChange={handleMaxPriceChange}
                  className="h-10"
                />
              </div>
            </div>
          </FilterSection>

          {/* Location */}
          <FilterSection title="Location">
            <Select
              value={filters.location}
              onValueChange={(val) => setFilters({ ...filters, location: val })}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map((loc) => (
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
          </FilterSection>

          {/* Availability */}
          <FilterSection title="Availability">
            {["available", "unavailable", "limited"].map((status) => (
              <div key={status} className="flex items-center gap-2">
                <Checkbox
                  id={`availability-${status}`}
                  checked={filters.availability.includes(status)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      ...filters,
                      availability: checked
                        ? [...filters.availability, status]
                        : filters.availability.filter((s) => s !== status),
                    });
                  }}
                />
                <label
                  htmlFor={`availability-${status}`}
                  className="capitalize cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </FilterSection>

          {/* Ratings */}
          <FilterSection title="Minimum Rating">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center space-x-3">
                  <Checkbox
                    id={`rating-${star}`}
                    checked={filters.rating === star}
                    onCheckedChange={() =>
                      setFilters({
                        ...filters,
                        rating: filters.rating === star ? undefined : star,
                      })
                    }
                  />
                  <label
                    htmlFor={`rating-${star}`}
                    className="flex items-center cursor-pointer gap-2"
                  >
                    {star}
                    <span className="flex items-center">
                      {[...Array(star)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Services */}
          <FilterSection title="Care Services">
            <div className="space-y-3">
              {["Personal Care", "Medical Support", "Housekeeping"].map(
                (service) => (
                  <div key={service} className="flex items-center space-x-3">
                    <Checkbox
                      id={`service-${service}`}
                      checked={filters.careServices?.includes(service)}
                      onCheckedChange={(val) =>
                        setFilters({
                          ...filters,
                          careServices: val
                            ? [...(filters.careServices || []), service]
                            : (filters.careServices || []).filter(
                                (s) => s !== service
                              ),
                        })
                      }
                    />
                    <label
                      htmlFor={`service-${service}`}
                      className="text-sm cursor-pointer"
                    >
                      {service}
                    </label>
                  </div>
                )
              )}
            </div>
          </FilterSection>

          {/* Amenities */}
          <FilterSection title="Amenities">
            <div className="space-y-3">
              {["Transportation", "WiFi", "Garden"].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters?.amenities?.includes(amenity)}
                    onCheckedChange={(val) =>
                      setFilters({
                        ...filters,
                        amenities: val
                          ? [...(filters.amenities || []), amenity]
                          : (filters.amenities || []).filter(
                              (a) => a !== amenity
                            ),
                      })
                    }
                  />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm cursor-pointer"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t pt-4 pb-2">
          <Button onClick={() => setOpen(false)} className="w-full h-12">
            Apply Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2">({activeFiltersCount})</span>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Desktop Filters Sidebar
const DesktopFiltersSidebar = ({
  filters,
  setFilters,
  locations,
  minPriceInput,
  maxPriceInput,
  handleMinPriceChange,
  handleMaxPriceChange,
}: FiltersSidebarProps) => {
  const handleResetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000000,
      location: "",
      availability: ["available", "unavailable", "limited"],
      rating: 0,
      careServices: [],
      amenities: [],
      page: 1,
      limit: 6,
    });
  };
  const uniqueLocations = locations.reduce((acc: Location[], current) => {
    const existingLocation = acc.find(
      (loc) => loc.location === current.location
    );
    if (!existingLocation) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <aside className="hidden lg:block w-1/5 p-6 space-y-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-white">
      {/* Price Range */}
      <div className="">
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={handleMinPriceChange}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={handleMaxPriceChange}
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        {["available", "unavailable", "limited"].map((status) => (
          <div key={status} className="flex items-center gap-2">
            <Checkbox
              id={`availability-${status}`}
              checked={filters.availability.includes(status)}
              onCheckedChange={(checked) => {
                setFilters({
                  ...filters,
                  availability: checked
                    ? [...filters.availability, status]
                    : filters.availability.filter((s) => s !== status),
                });
              }}
            />
            <label
              htmlFor={`availability-${status}`}
              className="capitalize cursor-pointer"
            >
              {status}
            </label>
          </div>
        ))}
      </div>

      {/* </div> */}

      {/* Locations */}
      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <Select
          value={filters.location}
          onValueChange={(val) => setFilters({ ...filters, location: val })}
        >
          <SelectTrigger className="w-full cursor-pointer h-[44px] px-3">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {uniqueLocations.map((loc) => (
              <SelectItem
                className="cursor-pointer"
                key={loc._id}
                value={loc.location}
              >
                {loc.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="font-semibold mb-3">Ratings</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-3">
              <Checkbox
                id={`rating-${star}`}
                checked={filters.rating === star}
                onCheckedChange={() =>
                  setFilters({
                    ...filters,
                    rating: filters.rating === star ? undefined : star,
                  })
                }
              />
              <label
                htmlFor={`rating-${star}`}
                className="flex items-center cursor-pointer gap-2"
              >
                {star}
                <span className="flex items-center">
                  {[...Array(star)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="font-semibold mb-3">Services</h3>
        <div className="space-y-2">
          {["Personal Care", "Medical Support", "Housekeeping"].map(
            (service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.careServices?.includes(service)}
                  onCheckedChange={(val) =>
                    setFilters({
                      ...filters,
                      careServices: val
                        ? [...(filters.careServices || []), service]
                        : (filters.careServices || []).filter(
                            (s) => s !== service
                          ),
                    })
                  }
                />
                <span>{service}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="space-y-2">
          {["Transportation", "WiFi", "Garden"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                checked={filters?.amenities?.includes(amenity)}
                onCheckedChange={(val) =>
                  setFilters({
                    ...filters,
                    amenities: val
                      ? [...(filters.amenities || []), amenity]
                      : (filters.amenities || []).filter((a) => a !== amenity),
                  })
                }
              />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        onClick={handleResetFilters}
        className="w-full text-red-500 border-red-500 hover:bg-red-50"
      >
        Clear All Filters
      </Button>
    </aside>
  );
};

// Main Filters Component
export const FiltersSidebar = (props: FiltersSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopFiltersSidebar {...props} />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet {...props} />
    </>
  );
};
