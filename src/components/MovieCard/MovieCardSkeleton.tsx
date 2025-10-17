import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Poster Skeleton */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <Skeleton className="absolute inset-0" />
      </div>

      <CardHeader className="pb-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>

      <CardContent className="pb-3 space-y-2">
        {/* Genre Skeleton */}
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex-col gap-2">
        {/* Price Skeleton */}
        <Skeleton className="h-7 w-24" />
        
        {/* Buttons Skeleton */}
        <div className="flex gap-2 w-full">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default MovieCardSkeleton;
