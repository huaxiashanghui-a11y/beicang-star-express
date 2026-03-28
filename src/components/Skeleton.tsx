export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`shimmer rounded ${className}`} />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function BannerSkeleton() {
  return (
    <div className="h-44 rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center p-3 bg-card rounded-xl">
      <Skeleton className="w-12 h-12 rounded-xl mb-2" />
      <Skeleton className="h-3 w-12" />
    </div>
  )
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Search Bar Skeleton */}
      <div className="sticky top-14 z-30 px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-12 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Banner Skeleton */}
        <div className="px-4 py-4">
          <BannerSkeleton />
        </div>

        {/* Categories Skeleton */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="px-4 pb-6 space-y-6">
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
