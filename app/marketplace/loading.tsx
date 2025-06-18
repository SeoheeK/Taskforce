import { Skeleton } from "@/components/ui/skeleton"

export default function MarketplaceLoading() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Category Skeletons */}
      {[1, 2].map((categoryIdx) => (
        <div key={categoryIdx} className="space-y-4">
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((itemIdx) => (
              <Skeleton key={itemIdx} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
