"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  getCustomers,
  getFacilities,
  mapApiBookingToBookingData,
  type BookingData,
} from "@/lib/api";
import { BookingDetailsDialog } from "./PlacementDialog";

export function BookingsTable() {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: facilityData, isLoading: isFacilitiesLoading } = useQuery({
    queryKey: ["facilityId"],
    queryFn: () => getFacilities(),
  });
  
  const facilityId = facilityData?.data?.[0]?._id || "";

  const { data, error, isLoading } = useQuery({
    queryKey: ["bookings", facilityId, currentPage, itemsPerPage],
    queryFn: () => getCustomers(facilityId, currentPage, itemsPerPage),
    enabled: !!facilityId,
  });
 
  console.log('placement',data);
  
  const bookings: BookingData[] =
    data?.data.map((b, i) => mapApiBookingToBookingData(b, i)) || [];
  const totalPages = data?.pagination?.totalPages || 0;
  const totalResults = data?.pagination?.totalItems || 0;

  const handleDetailsClick = (booking: BookingData) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  // Generate pagination range with ellipsis
  const generatePaginationRange = () => {
    const delta = 1; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (isFacilitiesLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        {error instanceof Error ? error.message : "Error loading bookings"}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center justify-center font-bold h-50 text-4xl text-muted-foreground">
        No Placements available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E6FAEE] text-center">
              <TableHead className="text-center">Invoice</TableHead>
              <TableHead className="text-center">Customer</TableHead>
              <TableHead className="text-center"> Location</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Referral Fee</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/50">
                <TableCell>{booking.invoice}</TableCell>
                <TableCell className="text-start">
                  <div className="flex items-center justify-center gap-3">
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
                    <div>
                      <div className="font-medium">{booking.customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.customer.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{booking.location}</TableCell>
                <TableCell>${booking.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === "Paid" ? "default" : "destructive"
                    }
                    className={`text-[16px] font-medium px-3 py-1 ${booking.status === 'Paid' ? 'bg-[#E6FAEE]  font-medium text-[#27BE69]' : 'bg-[#FEECEE] text-[#E5102E]'}`}
                  > 
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  {booking.status === "Cancelled"
                    ? "-"
                    : `$${booking.referralFee}`}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-[#E6F9EB] text-[#28A745] cursor-pointer hover:bg-green-400 hover:text-white px-3 py-1"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDetailsClick(booking)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-10">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults}{" "}
          results
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {generatePaginationRange().map((page, index) => {
            if (page === "...") {
              return (
                <Button
                  key={`ellipsis-${index}`}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  disabled
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(Number(page))}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}