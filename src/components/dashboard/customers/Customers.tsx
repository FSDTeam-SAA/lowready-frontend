"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { getCustomers, getFacilities, mapApiBookingToBookingData, type BookingData } from "@/lib/api";

export function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch facilities
  const { data: facilityData, isLoading: isFacilitiesLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
  });

  const facilityId = facilityData?.data?.[0]?._id || "";

  // Fetch customers/bookings
  const { data, isLoading: isBookingsLoading, error } = useQuery({
    queryKey: ["customers", facilityId, currentPage, itemsPerPage],
    queryFn: () => getCustomers(facilityId, currentPage, itemsPerPage),
    enabled: !!facilityId,
  });

  const bookings: BookingData[] = useMemo(
    () => data?.data.map((b, i) => mapApiBookingToBookingData(b, i)) || [],
    [data]
  );

  const totalPages = data?.meta?.totalPages || 0;
  const totalResults = data?.meta?.totalItems || 0;

  // Pagination helpers
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  if (isFacilitiesLoading || isBookingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading bookings</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E6FAEE]">
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/50">
                <TableCell>{booking.invoice}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={booking.customer.avatar} alt={booking.customer.name} />
                      <AvatarFallback>
                        {booking.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{booking.customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{booking.location}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>${booking.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/customers/${booking.id}`}>
                    <Button className="bg-green-600 text-white hover:bg-green-700" variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-10">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalResults} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
