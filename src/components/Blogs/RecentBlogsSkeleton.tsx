export default function RecentBlogsSkeleton() {
  return (
    <section className="py-10 md:py-20 lg:py-20 bg-[#F8F9FA]">
      <div className="mx-auto container">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-64 mb-6 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Big Blog Skeleton */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Image Skeleton */}
            <div className="w-full h-56 md:h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-5">
              {/* Meta Skeleton */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              {/* Description Skeleton */}
              <div className="space-y-2 mb-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Two Small Blogs Skeleton */}
          <div className="flex flex-col gap-6">
            {/* First Small Blog Skeleton */}
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Image Skeleton */}
              <div className="w-32 md:w-44 h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-4 flex flex-col justify-between flex-1">
                {/* Meta Skeleton */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-14 animate-pulse"></div>
                  </div>
                </div>
                {/* Title Skeleton */}
                <div className="h-5 bg-gray-200 rounded w-4/5 mb-1 animate-pulse"></div>
                {/* Description Skeleton */}
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Second Small Blog Skeleton */}
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Image Skeleton */}
              <div className="w-32 md:w-44 h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-4 flex flex-col justify-between flex-1">
                {/* Meta Skeleton */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-14 animate-pulse"></div>
                  </div>
                </div>
                {/* Title Skeleton */}
                <div className="h-5 bg-gray-200 rounded w-4/5 mb-1 animate-pulse"></div>
                {/* Description Skeleton */}
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
