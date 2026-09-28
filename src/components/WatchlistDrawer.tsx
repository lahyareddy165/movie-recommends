import React from 'react';
import { Movie } from '../types/movie';
import { X, Trash2, CheckCircle2, Circle, Clock, Star, Film, Play } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistMovies: Movie[];
  watchedMovieIds: Set<string>;
  onToggleWatched: (movieId: string) => void;
  onRemoveFromWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistMovies,
  watchedMovieIds,
  onToggleWatched,
  onRemoveFromWatchlist,
  onSelectMovie,
  onWatchTrailer,
}) => {
  if (!isOpen) return null;

  const totalRuntimeMinutes = watchlistMovies.reduce(
    (acc, m) => acc + (m.runtimeMinutes || 120),
    0
  );
  const totalHours = Math.floor(totalRuntimeMinutes / 60);
  const remainingMins = totalRuntimeMinutes % 60;

  const watchedCount = watchlistMovies.filter((m) => watchedMovieIds.has(m.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#0d0e14] border-l border-zinc-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-white">
              My Watchlist
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span>{watchlistMovies.length} saved</span>
              <span aria-hidden="true">·</span>
              <span>{watchedCount} watched</span>
              {watchlistMovies.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span className="font-mono tabular-nums">{totalHours}h {remainingMins}m</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {watchlistMovies.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-semibold text-white">Your Watchlist is empty</h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                Browse our catalog, click the bookmark icon on any movie card, and save films to watch later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
              >
                Browse Recommended Movies
              </button>
            </div>
          ) : (
            watchlistMovies.map((movie) => {
              const isWatched = watchedMovieIds.has(movie.id);

              return (
                <div
                  key={movie.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isWatched
                      ? 'bg-zinc-900/40 border-zinc-800/50 opacity-70'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Watched toggle circle */}
                  <button
                    onClick={() => onToggleWatched(movie.id)}
                    title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
                    className="mt-1 text-zinc-400 hover:text-amber-400 transition-colors shrink-0"
                  >
                    {isWatched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                    className="w-16 h-12 rounded-lg bg-black overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={movie.backdropUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        onSelectMovie(movie);
                        onClose();
                      }}
                      className={`text-sm font-bold text-white hover:text-amber-400 cursor-pointer truncate ${
                        isWatched ? 'line-through text-zinc-400' : ''
                      }`}
                    >
                      {movie.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                      <div className="flex items-center gap-0.5 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-mono tabular-nums">{movie.rating.toFixed(1)}</span>
                      </div>
                      <span aria-hidden="true">·</span>
                      <span>{movie.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{movie.runtime}</span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <button
                        onClick={() => {
                          onWatchTrailer(movie);
                          onClose();
                        }}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Play className="w-3 h-3 fill-amber-400" />
                        <span>Trailer</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWatchlist(movie.id)}
                        className="text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        {watchlistMovies.length > 0 && (
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40 text-center text-xs text-zinc-500">
            List saved automatically in your browser storage
          </div>
        )}
      </div>
    </div>
  );
};
