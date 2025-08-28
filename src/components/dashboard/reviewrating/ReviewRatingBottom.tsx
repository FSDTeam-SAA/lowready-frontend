"use client";

import React, { useState } from "react";
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
import { Eye, Trash2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteReview, getFacilities, getReviewRating } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Review {
  _id: string;
  comment: string;
  star: number;
  createdAt: string;
  updatedAt: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  facility: {
    _id: string;
    name: string;
  };
}

interface ReviewResponse {
  success: boolean;
  total: number;
  data: Review[];
}

const ReviewRatingBottom = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteReview, setDeleteReview] = useState<Review | null>(null);

  const { data: facilityData } = useQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
  });

  const facilityId = facilityData?.data?.[0]?._id || "";

  const { data, isLoading } = useQuery<ReviewResponse>({
    queryKey: ["reviews", facilityId],
    queryFn: () => getReviewRating(facilityId),
    enabled: !!facilityId,
  });
  console.log(data);

  const deleteMutation = useMutation({
    mutationKey: ["delete"],
    mutationFn: (id: string) => DeleteReview(id),
    onError: () => {
      toast.error("Failed to delete review. Please try again.");
    },
    onSuccess: () => {
      toast.success("Review Deleted Successfully");
    },
  });

  const reviews = data?.data || [];
  const totalResults = data?.total || 0;

  const totalPages = Math.ceil(totalResults / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalResults);
  const paginatedReviews = reviews.slice(startItem - 1, endItem);

  if (isLoading) return <p>Loading...</p>;

  const handelDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <section className="py-6 px-5">
      <div className="space-y-4">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E6FAEE]">
                <TableHead>Customer</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReviews.map((review) => (
                <TableRow key={review._id} className="hover:bg-muted/50">
                  {/* Customer */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={review.userId.firstName} />
                        <AvatarFallback>
                          {review.userId.firstName[0]}
                          {review.userId.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {review.userId.firstName} {review.userId.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.userId.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Review Text */}
                  <TableCell className="max-w-xs truncate">
                    {review.comment}
                  </TableCell>

                  {/* Stars */}
                  <TableCell className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="flex gap-2">
                    {/* Details dialog trigger */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="h-4 w-4 text-green-600" />
                    </Button>

                    {/* Delete dialog trigger */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteReview(review)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-6">
          {selectedReview && (
            <div className="space-y-4">
              {/* Header with avatar, name and close */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={selectedReview.userId.firstName} />
                    <AvatarFallback>
                      {selectedReview.userId.firstName[0]}
                      {selectedReview.userId.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedReview.userId.firstName}{" "}
                      {selectedReview.userId.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {/* {selectedReview.userId.city || "Unknown Location"} */}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < selectedReview.star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed">
                {selectedReview.comment}
              </p>

              {/* Date */}
              <p className="text-sm text-gray-400">
                {new Date(selectedReview.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteReview} onOpenChange={() => setDeleteReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this review?</p>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteReview(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                // 👉 Here you can call your API
                console.log("Delete review", deleteReview?._id);
                setDeleteReview(null);
                handelDelete(deleteReview?._id || "");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewRatingBottom;
