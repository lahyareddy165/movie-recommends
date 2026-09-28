import React from 'react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Film, Sparkles } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: (movieId: string) => boolean;
  onToggleBookmark: (movie: Movie) => void;
  onResetFilters: () => void;
  title?: string;
  subtitle?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  onSelectMovie,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
  onResetFilters,
  title = 'Browse Movies',
  subtitle,
}) => {
  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{subtitle}</p>
          )}
        </div>
        <span className="text-xs text-zinc-500 tabular-nums">
          {movies.length} {movies.length === 1 ? 'title' : 'titles'} discovered
        </span>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="p-4 rounded-full bg-zinc-800/80 text-amber-400">
            <Film className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="font-display font-semibold text-lg text-white">
              No matching movies found
            </h3>
            <p className="text-xs text-zinc-400">
              Try adjusting your genre filters, rating threshold, or search keywords.
            </p>
          </div>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              onWatchTrailer={onWatchTrailer}
              isBookmarked={isBookmarked(movie.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </section>
  );
};
