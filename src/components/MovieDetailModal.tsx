import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { X, Star, Bookmark, BookmarkCheck, Play, Award, Tv, Users, Clapperboard, Share2, Check, Sparkles, RefreshCw } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: boolean;
  onToggleBookmark: (movie: Movie) => void;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
  allMovies,
  onSelectMovie,
}) => {
  const [copied, setCopied] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedPromptType, setSelectedPromptType] = useState<string>('');

  if (!movie) return null;

  // Find similar movies based on shared genres or director
  const similarMovies = allMovies
    .filter(
      (m) =>
        m.id !== movie.id &&
        (m.director === movie.director || m.genres.some((g) => movie.genres.includes(g)))
    )
    .slice(0, 4);

  const handleShare = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      }
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAI = async (promptType: string) => {
    setSelectedPromptType(promptType);
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: movie.title,
          director: movie.director,
          year: movie.year,
          synopsis: movie.synopsis,
          questionType: promptType,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight || 'An extraordinary cinematic masterpiece.');
      } else {
        setAiInsight(`${movie.title} (${movie.year}) represents an exceptional highlight in ${movie.director}'s filmography.`);
      }
    } catch (err) {
      console.warn('AI insight fetch failed:', err);
      setAiInsight(`${movie.title} (${movie.year}) directed by ${movie.director} features phenomenal narrative pacing and profound thematic impact.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-2xl bg-[#0d0e14] border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90 border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner */}
        <div className="relative w-full h-64 sm:h-80 bg-zinc-950 overflow-hidden">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-[#0d0e14]/50 to-transparent" />

          {/* Quick Actions in Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300 font-medium">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-mono tabular-nums text-sm">{movie.rating.toFixed(1)}</span>
                </div>
                <span className="text-zinc-500 tabular-nums">({movie.voteCount} reviews)</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{movie.year}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{movie.runtime}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="font-mono text-zinc-400">{movie.contentRating}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-xs sm:text-sm italic text-amber-300/80 font-serif">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onWatchTrailer(movie)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm rounded-lg transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Trailer</span>
              </button>

              <button
                onClick={() => onToggleBookmark(movie)}
                className={`p-2 sm:px-3 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-black/60 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                aria-label="Share movie link"
                className="p-2 rounded-lg bg-black/60 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main synopsis */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Synopsis
            </h3>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* AI Cinephile Critic Section */}
          <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask CineScope AI Critic</span>
              </div>
              {aiInsight && (
                <button
                  onClick={() => setAiInsight(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Why is this a must-watch?',
                'Explain visual style & direction',
                'Who would love this most?',
              ].map((promptLabel) => (
                <button
                  key={promptLabel}
                  onClick={() => handleAskAI(promptLabel)}
                  disabled={isAiLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedPromptType === promptLabel && aiInsight
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {promptLabel}
                </button>
              ))}
            </div>

            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-300/80 pt-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Consulting Gemini film critic...</span>
              </div>
            )}

            {aiInsight && !isAiLoading && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {aiInsight}
              </div>
            )}
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-zinc-800">
            {/* Director */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">Directed By</span>
              </div>
              <p className="text-sm font-medium text-white">{movie.director}</p>
            </div>

            {/* Cast */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">Leading Cast</span>
              </div>
              <p className="text-sm text-zinc-200">{movie.cast.join(', ')}</p>
            </div>

            {/* Genres */}
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 font-semibold">Genres</div>
              <div className="flex flex-wrap gap-1 text-xs text-zinc-300">
                {movie.genres.map((g, idx) => (
                  <span key={g}>
                    {g}{idx < movie.genres.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Awards Note if available */}
          {movie.awards && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold">Critical Recognition: </strong>
                <span>{movie.awards}</span>
              </div>
            </div>
          )}

          {/* Streaming Platforms */}
          {movie.streamingOn && movie.streamingOn.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Where to Stream</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.streamingOn.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
                  >
                    <span className="font-medium text-white">{platform.name}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-[11px] text-zinc-400">{platform.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This (Similar Movies Carousel) */}
          {similarMovies.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-white font-display">
                Recommended Because You Viewed This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarMovies.map((simMovie) => (
                  <div
                    key={simMovie.id}
                    onClick={() => onSelectMovie(simMovie)}
                    className="group cursor-pointer rounded-lg bg-zinc-900/80 border border-zinc-800 p-2 hover:border-amber-500/40 transition-all space-y-1.5"
                  >
                    <div className="aspect-[16/10] rounded overflow-hidden bg-black">
                      <img
                        src={simMovie.backdropUrl}
                        alt={simMovie.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {simMovie.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>★ {simMovie.rating.toFixed(1)}</span>
                      <span>{simMovie.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
