/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getBookingDetails, getUserBookings } from "@/lib/api";
import { cn } from "@/lib/utils";
import DashboardLayout from "./profile-dashboard-layout";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
        <DialogContent className="sm:max-w-2xl">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#179649]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        {booking && (
          <div className="space-y-6">
            {/* Facility Info */}
            <div className="flex gap-4">
              <Image
                src={
                  booking.data.facility.images[0]?.url ||
                  "/placeholder.svg?height=80&width=80&query=facility"
                }
                width={80}
                height={80}
                alt={booking.data.facility.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {booking.data.facility.name}
                </h3>
                <p className="text-[#68706a]">
                  {booking.data.facility.location}
                </p>
                <p className="text-lg font-semibold alnhub-primary">
                  ${booking.data.facility.price}/Month
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Booking Information</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Starting Date:</span>{" "}
                    {new Date(booking.data.startingDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>{" "}
                    {booking.data.duration} months
                  </div>
                  <div>
                    <span className="font-medium">Total Price:</span> $
                    {booking.data.totalPrice}
                  </div>
                  <div>
                    <span className="font-medium">Payment Status:</span>
                    <Badge
                      className={cn(
                        "ml-2",
                        booking.data.paymentStatus === "paid"
                          ? "bg-[#e6f9eb] text-[#179649] hover:bg-[#e6f9eb]"
                          : "bg-[#feecee] text-[#e5102e] hover:bg-[#feecee]"
                      )}
                    >
                      {booking.data.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Resident Information</h4>
                {booking.data.residentialInfo.map(
                  (resident: any, index: number) => (
                    <div key={index} className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {resident.name}
                      </div>
                      <div>
                        <span className="font-medium">Date of Birth:</span>{" "}
                        {new Date(resident.dateOfBirth).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span>{" "}
                        {resident.gender}
                      </div>
                      <div>
                        <span className="font-medium">Requirements:</span>{" "}
                        {resident.requirements}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Facility Description */}
            <div>
              <h4 className="font-medium mb-2">About the Facility</h4>
              <p className="text-sm text-[#68706a]">
                {booking.data.facility.description}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function BookingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const itemsPerPage = 10;

  // Get session data first
  const { data: session, status: sessionStatus } = useSession();

  // Add debugging
  console.log("Session data:", session);
  console.log("Session status:", sessionStatus);
  console.log("User ID:", session?.user?.id);

  // Use the session data in the query with proper dependency
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
      console.log("Calling getUserBookings with:", {
        userId: session.user.id,
        currentPage,
        itemsPerPage,
      });
      return getUserBookings(session.user.id, currentPage, itemsPerPage);
    },
    enabled: !!session?.user?.id, // Only run when we have a user ID
    retry: 3,
    retryDelay: 1000,
  });

  // Add error logging
  if (error) {
    console.error("Error fetching bookings:", error);
  }

  const bookings = bookingsData?.data || [];
  const totalPages = Math.ceil(
    (bookingsData?.pagination?.totalPages || 0) / itemsPerPage
  );
  console.log(bookingsData);
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-[#e6f9eb] text-[#179649] hover:bg-[#e6f9eb]">
            Paid
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
        <Card>
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
                                  className="text-[#179649] hover:bg-[#e6f9eb]"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#e5102e] hover:bg-[#feecee]"
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
      </div>
    </DashboardLayout>
  );
}
