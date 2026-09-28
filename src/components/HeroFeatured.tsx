import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { Play, Info, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface HeroFeaturedProps {
  featuredMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: (movieId: string) => boolean;
  onToggleBookmark: (movie: Movie) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  featuredMovies,
  onSelectMovie,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  const bookmarked = isBookmarked(currentMovie.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <section className="relative w-full h-[540px] md:h-[620px] overflow-hidden bg-black select-none">
      {/* Background Cinematic Still with Fallback */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdropUrl}
          alt={currentMovie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.75] transition-all duration-700 ease-out transform scale-105"
        />
        {/* Measured contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/40 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative mx-auto max-w-7xl h-full flex flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4">
          {/* Spotlight Tag & Clean Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-zinc-300">
            <span className="text-amber-400 font-semibold tracking-wide uppercase">
              Spotlight Recommendation
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="tabular-nums">{currentMovie.rating.toFixed(1)}</span>
            </div>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{currentMovie.year}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{currentMovie.runtime}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{currentMovie.contentRating}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
            {currentMovie.title}
          </h1>

          {/* Tagline or Synopsis */}
          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed">
            {currentMovie.synopsis}
          </p>

          {/* Genres as clean typography */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span>Genres:</span>
            {currentMovie.genres.map((genre, idx) => (
              <React.Fragment key={genre}>
                <span className="text-zinc-200">{genre}</span>
                {idx < currentMovie.genres.length - 1 && (
                  <span aria-hidden="true" className="text-zinc-600">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onWatchTrailer(currentMovie)}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-lg transition-all transform active:scale-95 shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => onSelectMovie(currentMovie)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg backdrop-blur-sm transition-all whitespace-nowrap"
            >
              <Info className="w-4 h-4" />
              <span>Full Details</span>
            </button>

            <button
              onClick={() => onToggleBookmark(currentMovie)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                bookmarked
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-black/40 border-white/15 text-zinc-300 hover:text-white hover:bg-black/60'
              }`}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Add to Watchlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Indicators */}
      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 z-10">
        <button
          onClick={handlePrev}
          aria-label="Previous movie"
          className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 px-2">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          aria-label="Next movie"
          className="p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
