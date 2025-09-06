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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTourRequest,
  statusCancelTourRequest,
  statusTourRequest,
  TourRequest,
} from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ToureRequest = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TourRequest | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tourrequest"],
    queryFn: getTourRequest,
  });

 
  const statusMutation = useMutation({
    mutationKey: ["status"],
    mutationFn: (id: string) => statusTourRequest(id),
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tourrequest"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const statusCancelMutation = useMutation({
    mutationKey: ["status-cancel"],
    mutationFn: (id: string) => statusCancelTourRequest(id),
    onSuccess: () => {
      toast.success("Status Cancel successfully");
      queryClient.invalidateQueries({ queryKey: ["tourrequest"] });
    },
    onError: () => {
      toast.error("Failed to update status Cancel");
    },
  });

  const tourbookings: TourRequest[] = data?.data?.bookings || [];
  const totalResults = data?.data?.pagination?.total || tourbookings.length;
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handelstatusChange = (booking: TourRequest) => {
    statusMutation.mutate(booking?._id);
  };

  const handelstatusCancel = (booking: TourRequest) => {
    statusCancelMutation.mutate(booking?._id);
  };

  const handleDetailsClick = (booking: TourRequest) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section className="p-6 space-y-4">
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
  if (!tourbookings || tourbookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-2xl text-muted-foreground">
        No Data Available
      </div>
    );
  }



  return (
    <section>
      <div className="space-y-4 p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E6FAEE]">
                <TableHead className="text-center">Invoice</TableHead>
                <TableHead >Customer</TableHead>
                <TableHead className="text-center">Location</TableHead>
                <TableHead className="text-center">Time</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {tourbookings.map((booking) => (
                <TableRow key={booking._id} className="hover:bg-muted/50">
                  <TableCell>{`#${booking._id.slice(0, 4)}`}</TableCell>
                  <TableCell className="text-start">
                    <div className="flex items-center  gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                        src={booking?.images?.[0]?.url}
                        alt={booking.name || 'user'}
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
                  <TableCell>{booking.facility.location || 'Not Found'}</TableCell>
                  <TableCell>{booking.visitTime}</TableCell>
                  <TableCell>
                    {new Date(booking.visitDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        className="bg-[#E6F9EB] text-[#1F9854] hover:bg-green-100"
                        variant="ghost"
                        size="sm"
                        onClick={() => handelstatusChange(booking)}
                      >
                        <Check />
                      </Button>
                      <Button
                        className="bg-[#FEECEE] text-[#E5102E] hover:bg-green-100"
                        variant="ghost"
                        size="sm"
                        onClick={() => handelstatusCancel(booking)}
                      >
                        <X />
                      </Button>
                      <Button
                        className="bg-gray-50 text-[#343A40] hover:bg-green-100"
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
