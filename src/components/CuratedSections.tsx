import React, { useRef } from 'react';
import { Movie } from '../types/movie';
import { CURATED_COLLECTIONS } from '../data/moviesData';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface CuratedSectionsProps {
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: (movieId: string) => boolean;
  onToggleBookmark: (movie: Movie) => void;
}

export const CuratedSections: React.FC<CuratedSectionsProps> = ({
  allMovies,
  onSelectMovie,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const movieMap = React.useMemo(() => {
    const map = new Map<string, Movie>();
    allMovies.forEach((m) => map.set(m.id, m));
    return map;
  }, [allMovies]);

  return (
    <section id="curated-section" className="w-full space-y-12 py-8">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <Compass className="w-5 h-5 text-amber-400" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Curated Film Collections
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hand-picked selections tailored to distinct cinematic moods and styles
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {CURATED_COLLECTIONS.map((collection) => {
          const collectionMovies = collection.movieIds
            .map((id) => movieMap.get(id))
            .filter((m): m is Movie => m !== undefined);

          if (collectionMovies.length === 0) return null;

          return (
            <CarouselRow
              key={collection.id}
              title={collection.title}
              subtitle={collection.subtitle}
              movies={collectionMovies}
              onSelectMovie={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
              isBookmarked={isBookmarked}
              onToggleBookmark={onToggleBookmark}
            />
          );
        })}
      </div>
    </section>
  );
};

interface CarouselRowProps {
  title: string;
  subtitle: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: (movieId: string) => boolean;
  onToggleBookmark: (movie: Movie) => void;
}

const CarouselRow: React.FC<CarouselRowProps> = ({
  title,
  subtitle,
  movies,
  onSelectMovie,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360 * 2;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            {title}
          </h3>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-[280px] sm:w-[320px] shrink-0">
            <MovieCard
              movie={movie}
              onSelect={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
              isBookmarked={isBookmarked(movie.id)}
              onToggleBookmark={onToggleBookmark}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
