"use client";

import React, { useState } from "react";
import { ToureDialog } from "./TourDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTourRequest,
  statusCancelTourRequest,
  statusTourRequest,
  TourRequest,
} from "@/lib/api";
import { toast } from "sonner";

const ToureRequest = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TourRequest | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["tourrequest"],
    queryFn: getTourRequest,
  });

  const statusMutation = useMutation({
    mutationKey: ["status"],
    mutationFn: (id: string) => statusTourRequest(id),
    onSuccess: () => {
      // Invalidate and refetch
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tourrequest"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
  const statusCancelMutation = useMutation({
    mutationKey: ["status"],
    mutationFn: (id: string) => statusCancelTourRequest(id),
    onSuccess: () => {
      // Invalidate and refetch
      toast.success("Status Cancel successfully");
      queryClient.invalidateQueries({ queryKey: ["tourrequest"] });
    },
    onError: () => {
      toast.error("Failed to update status Cancel");
    },
  });

  // Ensure bookings is always an array
  const tourbookings: TourRequest[] = data?.data?.bookings || [];
  const totalResults = data?.data?.pagination?.total || tourbookings.length;
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handelstatusChange = (bookingring: TourRequest) => {
    statusMutation.mutate(bookingring?._id);
  };

  const handelstatusCancel = (bookingring: TourRequest) => {
    statusCancelMutation.mutate(bookingring?._id);
  };

  const handleDetailsClick = (booking: TourRequest) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };
  console.log("tour data", data);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings</p>;

  return (
    <section>
      <div className="space-y-4 py-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E6FAEE]">
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tourbookings.map((booking, index) => (
                <TableRow key={booking._id} className="hover:bg-muted/50">
                  <TableCell>{`INV-${index + 1}`}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={booking.userId.firstName}
                        />
                        <AvatarFallback>
                          {booking.userId.firstName[0]}
                          {booking.userId.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {booking.userId.firstName} {booking.userId.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.userId.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.facility.name}</TableCell>
                  <TableCell>{booking.visitTime}</TableCell>
                  <TableCell>
                    {new Date(booking.visitDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="bg-[#E6F9EB] text-[#1F9854]  hover:bg-green-100 cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => handelstatusChange(booking)}
                      >
                        <Check />
                      </Button>
                      <Button
                        className="bg-[#FEECEE] text-[#E5102E] hover:bg-green-100 cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => handelstatusCancel(booking)}
                      >
                        <X />
                      </Button>

                      <Button
                        className="bg-gray-50 text-[#343A40] hover:bg-green-100 cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDetailsClick(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
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
            {Math.min(currentPage * itemsPerPage, totalResults)} of{" "}
            {totalResults} results
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ToureDialog
          booking={selectedBooking}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </section>
  );
};

export default ToureRequest;
