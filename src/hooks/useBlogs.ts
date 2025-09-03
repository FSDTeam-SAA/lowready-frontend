"use client"

import { getAllBlogsPagination } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Get All Blogs
export function useAllBlogsPagination(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: () => getAllBlogsPagination(page, limit),
  });
}