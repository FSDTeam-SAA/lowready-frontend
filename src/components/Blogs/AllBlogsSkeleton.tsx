import { Card, CardContent } from "@/components/ui/card"

interface AllBlogsSkeletonProps {
  itemsPerPage?: number
}

export default function AllBlogsSkeleton({ itemsPerPage = 8 }: AllBlogsSkeletonProps) {
  return (
    <div className="px-6 py-12 mx-auto container">
      {/* Heading Skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
      </div>

      {/* Blog Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: itemsPerPage }, (_, i) => (
          <Card key={i} className="w-full bg-[#F8F9FA] shadow-none border-none rounded-lg">
            {/* Image Skeleton */}
            <div className="w-full h-[250px] bg-gray-200 rounded-t-lg animate-pulse" />

            <CardContent className="p-4">
              {/* Meta Info Skeleton */}
              <div className="flex justify-between items-center gap-4 mb-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-24 h-3 bg-gray-200 rounded ml-2 animate-pulse" />
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-3 bg-gray-200 rounded ml-2 animate-pulse" />
                </div>
              </div>

              {/* Title Skeleton */}
              <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse" />

              {/* Description Skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-8">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="flex items-center gap-2">
          {/* Pagination buttons skeleton */}
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
