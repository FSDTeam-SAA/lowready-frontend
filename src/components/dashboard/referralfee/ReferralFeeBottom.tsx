"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookingData,
  getallFacilitiesdata,
  mapApiBookingToBookingData,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ReferralFeeBottom = () => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["customers", currentPage],
    queryFn: () =>
      getallFacilitiesdata(session?.user.id || "", currentPage, 10),
  });

  const bookings: BookingData[] = useMemo(
    () => data?.data.map((b) => mapApiBookingToBookingData(b)) || [],
    [data]
  );

  const totalPages = data?.meta?.totalPages || 0;
  const totalResults = data?.meta?.totalItems || 0;
  const currentMetaPage = data?.meta?.currentPage || 1;

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
  // Error State
  // -----------------
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertTriangle className="h-10 w-10 mb-2" />
        <p className="text-lg font-medium">Failed to load tour requests</p>
        <p className="text-sm text-muted-foreground">
          {(error as Error)?.message || "Something went wrong"}
        </p>
      </div>
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
    <div className="space-y-4 py-6 px-5">
      {/* Filters */}
      <div className="flex gap-10">
        <div>
          <Label className="text-[#343A40] text-[16px] py-1 pl-2">
            Sort by
          </Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">UnPaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#343A40] text-[16px] py-1 pl-2">
            Choose Calendar
          </Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E6FAEE]">
              <TableHead className="text-center">Invoice</TableHead>
              <TableHead className="text-center">Billing Month</TableHead>

              <TableHead className="text-center">Referral Fee (18%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No bookings found</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell>{booking.invoice}</TableCell>
                  <TableCell>{booking.date}</TableCell>

                  <TableCell>${(booking.price * 0.18).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-10 pt-4">
          <div className="text-sm text-muted-foreground">
            Showing page {currentMetaPage} of {totalPages} ({totalResults}{" "}
            results)
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
};

export default ReferralFeeBottom;
