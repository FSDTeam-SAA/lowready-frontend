"use client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteReview, getReviewRating } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data: session } = useSession();

  const { data, isLoading } = useQuery<ReviewResponse>({
    queryKey: ["reviews", session],
    queryFn: () => getReviewRating(),
    enabled: !!session,
  });

  console.log("review", data);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: ["delete"],
    mutationFn: (id: string) => DeleteReview(id),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      toast.success(data.message);
    },
  });

  const reviews = data?.data || [];
  const totalResults = reviews.length;

  const totalPages = Math.ceil(totalResults / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalResults);
  const paginatedReviews = reviews.slice(startItem - 1, endItem);



  const handelDelete = (id: string) => {
    deleteMutation.mutate(id);
  };



  if (isLoading)
    return (
      <section className="p-6">
        <div className="space-y-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E6FAEE]">
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Review</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-4 w-4" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    );

if (!reviews || reviews.length === 0) {
  return (
    <div className="flex items-center justify-center h-64 text-xl text-muted-foreground">
      No Review Data
    </div>
  );
}

  return (
    <section className="p-6">
      <div className="space-y-4">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E6FAEE]">
                <TableHead className="">Customer</TableHead>
                <TableHead className="text-center">Review</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {paginatedReviews.map((review) => (
                <TableRow key={review._id} className="hover:bg-muted/50">
                  {/* Customer */}
                  <TableCell className="text-start">
                    <div className="flex items-center justify-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={review.userId.firstName} />
                        <AvatarFallback className=" shadow-2xs">
                          {review.userId.firstName[0]}
                          {review.userId.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="">
                        <div className="font-medium text-[#343A40] text-[16px]">
                          {review.userId.firstName} {review.userId.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
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
                  <TableCell className="flex justify-center gap-1">
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
                  <TableCell className="flex justify-center gap-2">
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
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}

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
        )}
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-6">
          {selectedReview && (
            <div className="space-y-4">
              {/* 🔑 Hidden title for accessibility */}
              <VisuallyHidden>
                <DialogTitle>Review Details</DialogTitle>
              </VisuallyHidden>

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
                    <h3 className="font-semibold text-[#343A40] text-lg">
                      {selectedReview.userId.firstName}{" "}
                      {selectedReview.userId.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {/* location or extra info */}
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
