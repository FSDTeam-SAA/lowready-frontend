/* eslint-disable */
// @ts-nocheck

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ChevronLeft, ChevronRight, X, Edit } from "lucide-react";
import { toast } from "sonner";
import { getTourHistory, submitReview, rebookTour } from "@/lib/api";
import { cn } from "@/lib/utils";
import DashboardLayout from "./profile-dashboard-layout";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { RebookData } from "@/types/account";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  tour: any;
  isOpen: boolean;
  onClose: () => void;
}

function ReviewModal({ tour, isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const submitReviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["tourHistory"] });
      onClose();
      reset();
      setRating(0);
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    submitReviewMutation.mutate({
      userId: session?.user.id,
      facility: tour.facility._id,
      star: data.rating,
      comment: data.description,
    });
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  const handleCancel = () => {
    reset();
    setRating(0);
    setHoveredRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">
              Reviews <span className="alnhub-primary">Forms</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label>How happy are you with our service</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-smooth"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      hoveredRating >= star || rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-[#e5102e]">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="hello@example.com"
              rows={4}
              className={errors.description ? "border-[#e5102e]" : ""}
            />
            {errors.description && (
              <p className="text-sm text-[#e5102e]">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-[#e5102e] text-[#e5102e] hover:bg-[#feecee] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitReviewMutation.isPending}
              className="flex-1 bg-[#179649] hover:bg-[#33b34c]"
            >
              {submitReviewMutation.isPending
                ? "Submitting..."
                : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface TourDetailsModalProps {
  tour: any;
  isOpen: boolean;
  onClose: () => void;
}

function TourDetailsModal({ tour, isOpen, onClose }: TourDetailsModalProps) {
  const queryClient = useQueryClient();

  const rebookMutation = useMutation({
    mutationFn: (variables: { facilityId: string; bookingData: RebookData }) =>
      rebookTour(variables.facilityId, variables.bookingData),
    onSuccess: () => {
      toast.success("Tour rebooked successfully");
      queryClient.invalidateQueries({ queryKey: ["tourHistory"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to rebook tour");
    },
  });

  const handleRebook = () => {
    rebookMutation.mutate(tour._id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Tour Details</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {tour && (
          <div className="space-y-6">
            {/* Facility Image and Info */}
            <div className="relative">
              <Image
                width={400}
                height={200}
                src={
                  tour.facility.images[1]?.url ||
                  "/placeholder.svg?height=200&width=400&query=assisted living facility"
                }
                alt={tour.facility.name}
                className="w-full h-48 rounded-lg object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{tour.facility.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-[#68706a]">(32 reviews)</span>
                  </div>
                </div>
                <p className="text-[#68706a] text-sm mt-1">
                  <span className="inline-block w-4 h-4 mr-1">📍</span>
                  Handpicked for comfort, care, and community
                </p>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-[#e6f9eb] text-[#179649]"
                >
                  Available
                </Badge>
                <Badge variant="secondary">Private</Badge>
                <Badge variant="secondary">Wi-Fi</Badge>
                <Badge variant="secondary">Garden</Badge>
                <Badge variant="secondary">Private</Badge>
                <Badge variant="secondary">Private</Badge>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold">
                $ {tour.facility.price.toLocaleString()}
                <span className="text-base font-normal text-[#68706a]">
                  {" "}
                  / Month
                </span>
              </div>

              {/* Tour Details */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Visit Date:</span>{" "}
                  {new Date(tour.visitDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Visit Time:</span>{" "}
                  {tour.visitTime}
                </div>
                <div>
                  <span className="font-medium">Visitor:</span> {tour.name}
                </div>
                <div>
                  <span className="font-medium">Relation:</span>{" "}
                  {tour.relationWith}
                </div>
                {tour.message && (
                  <div>
                    <span className="font-medium">Message:</span> {tour.message}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                See Details
              </Button>
              <Button
                onClick={handleRebook}
                disabled={rebookMutation.isPending}
                className="flex-1 bg-[#179649] hover:bg-[#33b34c]"
              >
                {rebookMutation.isPending ? "Rebooking..." : "Re-Book"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function TourHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: toursData, isLoading } = useQuery({
    queryKey: ["tourHistory", currentPage],
    queryFn: () => getTourHistory(),
  });

  const tours = toursData?.data || [];

  const totalPages = Math.ceil((toursData?.total || 0) / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return (
          <Badge className="bg-[#e1ecf9] text-[#53a6ff] hover:bg-[#e1ecf9]">
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-[#e6f9eb] text-[#179649] hover:bg-[#e6f9eb]">
            Completed
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

  const handleFeedback = (tour: any) => {
    setSelectedTour(tour);
    setReviewModalOpen(true);
  };

  const handleRebook = (tour: any) => {
    setSelectedTour(tour);
    setDetailsModalOpen(true);
  };

  const handleViewDetails = (tour: any) => {
    setSelectedTour(tour);
    setDetailsModalOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#179649]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f9fa] border-b border-[#e6e7e6]">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-[#343a40] text-sm">
                      Place Name
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-[#343a40] text-sm">
                      Location
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-[#343a40] text-sm">
                      Scheduled Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-[#343a40] text-sm">
                      Scheduled Time
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-[#343a40] text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-[#343a40] text-sm">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tours?.bookings?.map((tour: any, index: number) => {
                    // Mock status for demo to match Figma
                    const statuses = [
                      "upcoming",
                      "completed",
                      "completed",
                      "completed",
                      "cancelled",
                      "completed",
                      "cancelled",
                      "completed",
                      "completed",
                      "cancelled",
                    ];
                    const status = statuses[index % statuses.length];

                    return (
                      <tr
                        key={tour._id}
                        className="border-b border-[#e6e7e6] hover:bg-[#f8f9fa] transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Image
                              width={48}
                              height={48}
                              src={
                                tour.facility.images[0]?.url ||
                                "/sunny-hills-assisted-living-facility.png"
                              }
                              alt="Sunny Hills Assisted Living"
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium text-[#343a40]">
                                {tour.facility.name}
                              </div>
                              <div className="text-sm text-[#68706a]">
                                {tour.facility.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[#68706a]">
                          {tour.facility.location}
                        </td>
                        <td className="py-4 px-6 text-[#68706a]">
                          {new Date(tour.visitDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-[#68706a]">
                          {tour.visitTime}
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(status)}</td>
                        <td className="py-4 px-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(tour)}
                            className="text-[#179649] hover:bg-[#e6f9eb] p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {tours?.bookings?.map((tour: any, index: number) => {
              const statuses = [
                "upcoming",
                "completed",
                "completed",
                "completed",
                "cancelled",
                "completed",
                "cancelled",
                "completed",
                "completed",
                "cancelled",
              ];
              const status = statuses[index % statuses.length];

              return (
                <Card key={tour._id} className="p-4 border border-[#e6e7e6]">
                  <div className="flex items-start gap-3">
                    <img
                      src="/sunny-hills-assisted-living-facility.png"
                      alt="Sunny Hills Assisted Living"
                      className="w-15 h-15 rounded object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="font-medium text-[#343a40]">
                          Sunny Hills Assisted Living
                        </div>
                        <div className="text-sm text-[#68706a]">
                          North Port, Florida
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#68706a]">
                          12/08/2025 at 11:00 AM
                        </span>
                        {getStatusBadge(status)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(tour)}
                          className="flex-1 border-[#179649] text-[#179649] hover:bg-[#e6f9eb]"
                        >
                          Feedback
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRebook(tour)}
                          className="flex-1 border-[#179649] text-[#179649] hover:bg-[#e6f9eb]"
                        >
                          Re Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-[#e6e7e6]">
              <p className="text-sm text-[#68706a]">
                Showing 1 to 5 of 12 results
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-[#e6e7e6]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  className="h-8 w-8 p-0 bg-[#179649] hover:bg-[#179649] text-white"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-[#e6e7e6] text-[#68706a] bg-transparent"
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-[#e6e7e6] text-[#68706a] bg-transparent"
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-[#e6e7e6] text-[#68706a] bg-transparent"
                >
                  ...
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-[#e6e7e6] text-[#68706a] bg-transparent"
                  onClick={() => setCurrentPage(8)}
                >
                  8
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-[#e6e7e6]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Review Modal */}
        <ReviewModal
          tour={selectedTour}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedTour(null);
          }}
        />

        {/* Tour Details Modal */}
        <TourDetailsModal
          tour={selectedTour}
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedTour(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
