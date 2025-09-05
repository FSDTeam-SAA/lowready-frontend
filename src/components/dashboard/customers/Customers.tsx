"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getallFacilitiesdata,
  mapApiBookingToBookingData,
  type BookingData,
  type ApiBooking,
  type PaginatedResponse,
} from "@/lib/api";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export function Customers() {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Typed useQuery ---
  const { data, isLoading } = useQuery<PaginatedResponse<ApiBooking>>({
    queryKey: ["customers", currentPage, itemsPerPage],
    queryFn: () =>
      getallFacilitiesdata(session?.user.id || "", currentPage, itemsPerPage),
   
  });

  // --- Map API data to BookingData ---
  const bookings: BookingData[] = useMemo(
    () => data?.data.map((b) => mapApiBookingToBookingData(b)) || [],
    [data]
  );

  // --- Pagination info from API meta ---
  const totalPages = data?.meta?.totalPages ?? 0;
  const totalResults = data?.meta?.totalItems ?? 0;
  const currentMetaPage = data?.meta?.currentPage ?? 1;

  const startItem = (currentMetaPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentMetaPage * itemsPerPage, totalResults);

  if (isLoading) {
    return (
      <section className="p-6 space-y-4">
        <div className="border rounded-lg">
          <Table>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    );
  }



  // -----------------
  // No Data State
  // -----------------
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-2xl text-muted-foreground">
        No Data Available
      </div>
    );
  }



  return (
    <div className="space-y-4 p-6">
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
                <TableCell>#{booking.invoice}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={booking.customer.avatar}
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
                <TableCell>{booking.date}</TableCell>
                <TableCell>${booking.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/customers/${booking.id}`}>
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      variant="ghost"
                      size="sm"
                    >
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-10">
          <div className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalResults} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentMetaPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentMetaPage === page ? "default" : "outline"}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentMetaPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
