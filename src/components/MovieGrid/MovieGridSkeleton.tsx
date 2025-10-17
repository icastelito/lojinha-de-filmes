import MovieCardSkeleton from '../MovieCard/MovieCardSkeleton';

interface MovieGridSkeletonProps {
  count?: number;
}

function MovieGridSkeleton({ count = 20 }: MovieGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default MovieGridSkeleton;
