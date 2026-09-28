import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { Star, Bookmark, BookmarkCheck, Play, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: boolean;
  onToggleBookmark: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-200 overflow-hidden hover:shadow-xl hover:shadow-black/50">
      {/* Poster / Backdrop Image Frame with Aspect Ratio 16:9 or 3:4 */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        {!imageError ? (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
          />
        ) : (
          /* Styled Fallback Container */
          <div
            className={`w-full h-full bg-gradient-to-br ${movie.posterBgGradient} flex flex-col items-center justify-center p-4 text-center`}
          >
            <Film className="w-8 h-8 text-zinc-500 mb-2" />
            <span className="font-display font-bold text-white text-sm line-clamp-1">{movie.title}</span>
            <span className="text-xs text-zinc-400 mt-1">{movie.director}</span>
          </div>
        )}

        {/* Ambient overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Actions: Bookmark & Content Rating */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-medium text-zinc-300 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded">
            {movie.contentRating}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(movie);
            }}
            aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
            className={`p-1.5 rounded-md backdrop-blur-md transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-black'
                : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Quick Trailer Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(movie);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-md shadow-lg transition-transform transform active:scale-95 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Trailer</span>
          </button>
        </div>
      </div>

      {/* Card Content & Clean Unboxed Metadata */}
      <div
        onClick={() => onSelect(movie)}
        className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer space-y-2.5"
      >
        <div>
          {/* Metadata Row: Rating, Year, Runtime */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-mono tabular-nums">{movie.rating.toFixed(1)}</span>
            </div>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="tabular-nums">{movie.year}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{movie.runtime}</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          {/* Director & Clean Genre separator */}
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
            Dir. <span className="text-zinc-300 font-medium">{movie.director}</span>
          </p>
        </div>

        {/* Unboxed Genres list */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400 line-clamp-1 truncate">
            {movie.genres.slice(0, 3).map((genre, idx) => (
              <React.Fragment key={genre}>
                <span className="text-zinc-300 font-medium">{genre}</span>
                {idx < Math.min(movie.genres.length, 3) - 1 && (
                  <span aria-hidden="true" className="text-zinc-600">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <span className="text-[11px] text-amber-400/90 font-medium shrink-0 group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
