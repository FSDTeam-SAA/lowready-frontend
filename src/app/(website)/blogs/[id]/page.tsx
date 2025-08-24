import BlogDetailes from "@/components/Blogs/BlogDetailes";
import SimilarBlogs from "@/components/Blogs/SimilarBlogs";
import StayUpdated from "@/components/Blogs/StayUpdated";
import React from "react";

export default function page() {
  return (
    <div>
      <BlogDetailes />
      <StayUpdated />
      <SimilarBlogs />
    </div>
  );
}
