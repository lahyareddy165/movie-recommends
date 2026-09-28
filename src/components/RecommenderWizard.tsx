import React, { useState } from 'react';
import { Movie, Genre, Mood } from '../types/movie';
import { Sparkles, RefreshCw, X, Check, Star, Play, Bookmark, BookmarkCheck, MessageSquare } from 'lucide-react';

interface RecommenderWizardProps {
  allMovies: Movie[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isBookmarked: (movieId: string) => boolean;
  onToggleBookmark: (movie: Movie) => void;
}

const MOOD_OPTIONS: { mood: Mood; label: string; desc: string }[] = [
  { mood: 'Mind-Bending', label: 'Mind-Bending & Complex', desc: 'Films that make you ponder reality and puzzle over details' },
  { mood: 'Adrenaline Rush', label: 'High Octane & Thrilling', desc: 'Fast-paced action, spectacle, and intense thrills' },
  { mood: 'Emotional & Poetic', label: 'Poetic & Deeply Moving', desc: 'Character-driven stories that touch the heart' },
  { mood: 'Dark & Gritty', label: 'Dark, Neo-Noir & Atmospheric', desc: 'Psychological tension, crime, and moral ambiguity' },
  { mood: 'Heartwarming', label: 'Warm, Uplifting & Joyful', desc: 'Feel-good warmth, humor, and tender humanity' },
  { mood: 'Visually Epic', label: 'Grand Cinematic Spectacle', desc: 'Breathtaking visual design and immersive scale' },
  { mood: 'Laugh Out Loud', label: 'Clever Wit & Comedy', desc: 'Sharp humor, eccentric characters, and fun' },
  { mood: 'Edge of Seat', label: 'Nerve-Wracking Suspense', desc: 'Unrelenting tension where anything can happen' },
];

const GENRE_CHOICES: Genre[] = [
  'Sci-Fi', 'Drama', 'Action', 'Thriller', 'Crime', 'Comedy', 'Animation', 'Horror', 'Romance', 'Mystery'
];

export const RecommenderWizard: React.FC<RecommenderWizardProps> = ({
  allMovies,
  isOpen,
  onClose,
  onSelectMovie,
  onWatchTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood>('Mind-Bending');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(['Sci-Fi']);
  const [runtimePref, setRuntimePref] = useState<'any' | 'short' | 'epic'>('any');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [results, setResults] = useState<{ movie: Movie; score: number; reason: string; vibeHighlight?: string }[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [curatorNote, setCuratorNote] = useState<string>('');

  if (!isOpen) return null;

  const toggleGenre = (genre: Genre) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          genres: selectedGenres,
          runtimePref,
          customPrompt,
          candidateMovies: allMovies,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.recommendations && data.recommendations.length > 0) {
          const movieMap = new Map(allMovies.map((m) => [m.id, m]));
          const formatted = data.recommendations
            .map((rec: any) => {
              const movie = movieMap.get(rec.movieId);
              if (!movie) return null;
              return {
                movie,
                score: rec.score || 95,
                reason: rec.reason || movie.matchReason,
                vibeHighlight: rec.vibeHighlight,
              };
            })
            .filter(Boolean);

          if (formatted.length > 0) {
            setResults(formatted);
            setCuratorNote(data.curatorSummary || '');
            setIsGenerating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err);
    }

    // Local fallback calculation
    setTimeout(() => {
      const scored = allMovies.map((movie) => {
        let score = 50;

        if (movie.moods.includes(selectedMood)) {
          score += 35;
        }

        const matchingGenres = movie.genres.filter((g) => selectedGenres.includes(g));
        score += matchingGenres.length * 15;

        if (runtimePref === 'short' && movie.runtimeMinutes < 120) score += 15;
        if (runtimePref === 'epic' && movie.runtimeMinutes >= 140) score += 15;

        score += Math.round(movie.rating * 2);

        const finalScore = Math.min(score, 99);

        let customReason = movie.matchReason || '';
        if (movie.moods.includes(selectedMood)) {
          customReason = `Tailored for your "${selectedMood}" mood with seamless blend of ${movie.genres.join(', ')}.`;
        }

        return {
          movie,
          score: finalScore,
          reason: customReason,
          vibeHighlight: movie.tagline,
        };
      });

      scored.sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 3));
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#0e1017] border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Intelligent Movie Recommendation Engine
              </h2>
              <p className="text-xs text-zinc-400">
                Powered by server-side cinema curation to find your ideal film match
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Form or Results */}
        {!results ? (
          <div className="space-y-6">
            {/* Step 1: Mood */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-white">
                1. How are you feeling tonight? (Select your mood)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOOD_OPTIONS.map((item) => {
                  const isSelected = selectedMood === item.mood;
                  return (
                    <button
                      key={item.mood}
                      onClick={() => setSelectedMood(item.mood)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-display">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Genres */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-white">
                2. Which genres do you want in the mix? (Select one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRE_CHOICES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Runtime */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-white">
                3. Preferred runtime & pacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'any', label: 'Any Duration', desc: 'No time constraint' },
                  { id: 'short', label: 'Brisk & Focused', desc: 'Under 2 hours' },
                  { id: 'epic', label: 'Deep Epic Journey', desc: '2+ hours masterpiece' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setRuntimePref(opt.id as any)}
                    className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                      runtimePref === opt.id
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="font-semibold text-zinc-200">{opt.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Custom Vibe Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Specific request or vibe description (Optional)</span>
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., 'A rainy neo-noir mystery with philosophical depth', 'father daughter emotional bond'..."
                className="w-full px-3.5 py-2.5 bg-zinc-900/90 text-xs text-white placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-500/80"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Consulting CineScope AI Recommendation Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Reveal My Best Movie Matches</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-300">
                Found <strong className="text-amber-400">{results.length} Top Matches</strong> for{' '}
                <span className="text-white font-medium">"{selectedMood}"</span> with{' '}
                <span className="text-white font-medium">{selectedGenres.join(', ')}</span>
                {curatorNote && <div className="text-zinc-400 mt-1 italic">{curatorNote}</div>}
              </div>
              <button
                onClick={() => setResults(null)}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium shrink-0 ml-2"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refine Answers</span>
              </button>
            </div>

            <div className="space-y-4">
              {results.map(({ movie, score, reason, vibeHighlight }, idx) => {
                const bookmarked = isBookmarked(movie.id);

                return (
                  <div
                    key={movie.id}
                    className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    {/* Poster thumbnail */}
                    <div
                      onClick={() => {
                        onSelectMovie(movie);
                        onClose();
                      }}
                      className="relative w-full sm:w-36 aspect-[16/10] sm:aspect-[3/4] rounded-lg overflow-hidden bg-black shrink-0 cursor-pointer group"
                    >
                      <img
                        src={movie.backdropUrl}
                        alt={movie.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold font-mono">
                        #{idx + 1} Match
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="font-semibold text-emerald-400 tabular-nums">
                              {score}% Vibe Match
                            </span>
                            <span aria-hidden="true">·</span>
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span className="tabular-nums font-bold">{movie.rating.toFixed(1)}</span>
                            </div>
                            <span aria-hidden="true">·</span>
                            <span>{movie.year}</span>
                            <span aria-hidden="true">·</span>
                            <span>{movie.runtime}</span>
                          </div>
                          <h3
                            onClick={() => {
                              onSelectMovie(movie);
                              onClose();
                            }}
                            className="text-base sm:text-lg font-bold text-white font-display hover:text-amber-400 cursor-pointer mt-0.5"
                          >
                            {movie.title}
                          </h3>
                        </div>

                        {/* Watchlist toggle */}
                        <button
                          onClick={() => onToggleBookmark(movie)}
                          aria-label="Toggle watchlist"
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarked
                              ? 'bg-amber-500 text-black'
                              : 'bg-zinc-800 text-zinc-300 hover:text-white'
                          }`}
                        >
                          {bookmarked ? (
                            <BookmarkCheck className="w-4 h-4 fill-current" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Vibe Highlight Badge */}
                      {vibeHighlight && (
                        <div className="text-[11px] font-mono text-amber-400/90 font-medium">
                          ✦ {vibeHighlight}
                        </div>
                      )}

                      {/* Curation Reason */}
                      <p className="text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
                        <strong className="text-amber-400 font-semibold">Why this fits: </strong>
                        {reason}
                      </p>

                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {movie.synopsis}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            onWatchTrailer(movie);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Watch Trailer</span>
                        </button>
                        <button
                          onClick={() => {
                            onSelectMovie(movie);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-md"
                        >
                          Full Details & Cast
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
