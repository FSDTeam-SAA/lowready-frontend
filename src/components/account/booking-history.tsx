/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getBookingDetails, getUserBookings, deletePlacement } from "@/lib/api";
import DashboardLayout from "./profile-dashboard-layout";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ---------------- Delete Confirm Modal ----------------
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Booking Details Modal (Updated for Screenshot Style) ----------------
interface BookingDetailsModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

function BookingDetailsModal({
  bookingId,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const { data: booking, isLoading } = useQuery({
    queryKey: ["bookingDetails", bookingId],
    queryFn: () => getBookingDetails(bookingId),
    enabled: isOpen && !!bookingId,
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#179649]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl">
        {booking && (
          <div className="w-full">
            {/* Top Image */}
            <div className="relative w-full h-60">
              <Image
                src={
                  booking.data.facility.images[0]?.url ||
                  "/placeholder.svg?height=240&width=400&query=facility"
                }
                alt={booking.data.facility.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title & Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {booking.data.facility.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Handpicked for comfort, care, and community
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="text-yellow-500">★</span>
                  <span>
                    {booking.data.facility?.rating || "4.8"} (
                    {booking.data.facility?.reviews || "32"} reviews)
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#e6f9eb] text-[#179649]">Available</Badge>
                <Badge variant="secondary">Private</Badge>
                <Badge variant="secondary">Wi-Fi</Badge>
                <Badge variant="secondary">Garden</Badge>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold">
                ${booking.data.facility.price}/
                <span className="text-base font-normal text-gray-600">
                  Month
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#179649] text-[#179649] cursor-pointer"
                >
                  See Details
                </Button>
                <Button className="flex-1 bg-[#179649] hover:bg-[#148a41] cursor-pointer">
                  See Over
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Main Booking History Page ----------------
export default function BookingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Get session data
  const { data: session, status: sessionStatus } = useSession();

  const queryClient = useQueryClient();

  // Delete booking mutation
  const { mutate: deleteBooking } = useMutation({
    mutationFn: (id: string) => deletePlacement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
      setDeleteId(null);
      toast.success("Deleted Successfully!");
    },
    onError: (err) => {
      console.error("Delete failed:", err);
    },
  });

  // Use the session data in the query
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookingHistory", session?.user?.id, currentPage],
    queryFn: () => {
      if (!session?.user?.id) {
        throw new Error("User ID is required");
      }
      return getUserBookings(session.user.id, currentPage, itemsPerPage);
    },
    enabled: !!session?.user?.id,
    retry: 3,
    retryDelay: 1000,
  });

  const bookings = bookingsData?.data || [];
  const totalPages = Math.ceil(
    (bookingsData?.pagination?.totalPages || 0) / itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-[#E6FAEE] text-[#27BE69] hover:bg-[#E6FAEE]">
            Placed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-[#E1ECF9] text-[#53A6FF] hover:bg-[#E1ECF9]">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-[#feecee] text-[#e5102e] hover:bg-[#feecee]">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show loading while session is loading
  if (sessionStatus === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#179649]"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error if session failed to load
  if (sessionStatus === "unauthenticated") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">
              Please log in to view your booking history.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error if API call failed
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">Failed to load booking history.</p>
            <p className="text-sm text-gray-600 mt-2">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="p-[24px]">
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookings found.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            Place Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Booked Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Check-In Time
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking: any) => (
                          <tr
                            key={booking._id}
                            className="border-b hover:bg-[#f7f8f8] transition-smooth"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <Image
                                  width={100}
                                  height={100}
                                  src={
                                    booking.facility.images[0]?.url ||
                                    "/placeholder.svg?height=40&width=40&query=facility"
                                  }
                                  alt={booking.facility.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div>
                                  <div className="font-medium">
                                    {booking.facility.name}
                                  </div>
                                  <div className="text-sm text-[#68706a]">
                                    {booking.facility.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">12:00 PM</td>
                            <td className="py-4 px-4">
                              {getStatusBadge(booking.paymentStatus)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedBookingId(booking._id)
                                  }
                                  className="text-[#179649] hover:bg-[#e6f9eb] cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#e5102e] hover:bg-[#feecee] cursor-pointer"
                                  onClick={() => setDeleteId(booking._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {bookings.map((booking: any) => (
                    <Card key={booking._id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Image
                          width={60}
                          height={60}
                          src={
                            booking.facility.images[0]?.url ||
                            "/placeholder.svg?height=60&width=60&query=facility"
                          }
                          alt={booking.facility.name}
                          className="w-15 h-15 rounded object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="font-medium">
                              {booking.facility.name}
                            </div>
                            <div className="text-sm text-[#68706a]">
                              {booking.facility.location}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>
                              Booked:{" "}
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </span>
                            {getStatusBadge(booking.paymentStatus)}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBookingId(booking._id)}
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#e5102e] border-[#e5102e] hover:bg-[#feecee] bg-transparent"
                              onClick={() => setDeleteId(booking._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-[#68706a]">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        bookingsData?.pagination?.totalPages || 0
                      )}{" "}
                      of {bookingsData?.pagination?.totalPages || 0} results
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={
                                currentPage === page
                                  ? "bg-[#179649] hover:bg-[#33b34c]"
                                  : ""
                              }
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Booking Details Modal */}
        <BookingDetailsModal
          bookingId={selectedBookingId || ""}
          isOpen={!!selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            if (deleteId) {
              deleteBooking(deleteId);
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}
