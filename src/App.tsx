/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { GENRES, MOVIES_DATABASE } from './data/moviesData';
import { Movie, Genre, SortOption } from './types/movie';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { GenreSelector } from './components/GenreSelector';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { CuratedSections } from './components/CuratedSections';
import { MovieDetailModal } from './components/MovieDetailModal';
import { TrailerModal } from './components/TrailerModal';
import { RecommenderWizard } from './components/RecommenderWizard';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Sparkles, Shuffle, Bookmark } from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'browse' | 'recommender' | 'watchlist'>('browse');

  // Filter & Search states
  const [selectedGenre, setSelectedGenre] = useState<Genre>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

  // Modal states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [surpriseToast, setSurpriseToast] = useState<string | null>(null);

  // Watchlist persisted state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinescope_watchlist');
      return saved ? JSON.parse(saved) : ['interstellar', 'oppenheimer', 'past-lives'];
    } catch {
      return ['interstellar', 'oppenheimer', 'past-lives'];
    }
  });

  const [watchedIds, setWatchedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cinescope_watched');
      return saved ? new Set(JSON.parse(saved)) : new Set(['interstellar']);
    } catch {
      return new Set(['interstellar']);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinescope_watchlist', JSON.stringify(watchlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [watchlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cinescope_watched', JSON.stringify(Array.from(watchedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [watchedIds]);

  // Bookmark actions
  const isBookmarked = (movieId: string) => watchlistIds.includes(movieId);

  const toggleBookmark = (movie: Movie) => {
    setWatchlistIds((prev) => {
      if (prev.includes(movie.id)) {
        return prev.filter((id) => id !== movie.id);
      } else {
        return [...prev, movie.id];
      }
    });
  };

  const toggleWatched = (movieId: string) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (next.has(movieId)) {
        next.delete(movieId);
      } else {
        next.add(movieId);
      }
      return next;
    });
  };

  const removeFromWatchlist = (movieId: string) => {
    setWatchlistIds((prev) => prev.filter((id) => id !== movieId));
  };

  // Genre counts calculation
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MOVIES_DATABASE.length };
    GENRES.forEach((g) => {
      if (g !== 'All') {
        counts[g] = MOVIES_DATABASE.filter((m) => m.genres.includes(g)).length;
      }
    });
    return counts;
  }, []);

  // Available unique moods for filtering
  const availableMoods = useMemo(() => {
    const moodsSet = new Set<string>();
    MOVIES_DATABASE.forEach((m) => m.moods.forEach((mood) => moodsSet.add(mood)));
    return Array.from(moodsSet);
  }, []);

  // Filtered & Sorted movies
  const filteredMovies = useMemo(() => {
    let list = [...MOVIES_DATABASE];

    // Filter by Watchlist view tab
    if (activeTab === 'watchlist') {
      list = list.filter((m) => watchlistIds.includes(m.id));
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((actor) => actor.toLowerCase().includes(q)) ||
          m.genres.some((genre) => genre.toLowerCase().includes(q)) ||
          m.synopsis.toLowerCase().includes(q) ||
          (m.tagline && m.tagline.toLowerCase().includes(q)) ||
          (m.awards && m.awards.toLowerCase().includes(q)) ||
          m.contentRating.toLowerCase().includes(q) ||
          m.moods.some((mood) => mood.toLowerCase().includes(q))
      );
    }

    // Filter by minimum rating
    if (minRating > 0) {
      list = list.filter((m) => m.rating >= minRating);
    }

    // Filter by mood
    if (selectedMood) {
      list = list.filter((m) => m.moods.includes(selectedMood as any));
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return list;
  }, [activeTab, watchlistIds, selectedGenre, searchQuery, minRating, selectedMood, sortBy]);

  // Featured spotlight movies
  const featuredMovies = useMemo(() => {
    return MOVIES_DATABASE.filter((m) => m.featured);
  }, []);

  // Watchlist movies list for drawer
  const watchlistMovies = useMemo(() => {
    const map = new Map<string, Movie>();
    MOVIES_DATABASE.forEach((m) => map.set(m.id, m));
    return watchlistIds.map((id) => map.get(id)).filter((m): m is Movie => m !== undefined);
  }, [watchlistIds]);

  // Surprise Me Handler
  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * MOVIES_DATABASE.length);
    const randomMovie = MOVIES_DATABASE[randomIndex];
    setSelectedMovie(randomMovie);
    setSurpriseToast(`Recommended for you: ${randomMovie.title}!`);
    setTimeout(() => setSurpriseToast(null), 3500);
  };

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSearchQuery('');
    setMinRating(0);
    setSelectedMood('');
    setSortBy('rating-desc');
    setActiveTab('browse');
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#edeef2] flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistIds.length}
        onSurpriseMe={handleSurpriseMe}
        onOpenRecommender={() => setIsRecommenderOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
      />

      {/* Surprise Recommendation Toast Notification */}
      {surpriseToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-amber-500 text-black font-semibold text-xs rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{surpriseToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Cinematic Hero Section with rotating spotlight movies */}
        <HeroFeatured
          featuredMovies={featuredMovies}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          onWatchTrailer={(movie) => setTrailerMovie(movie)}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 mt-6">
          {/* Active Tab Notice if on Watchlist */}
          {activeTab === 'watchlist' && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-amber-200">
                <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                <span>
                  Viewing your <strong>Saved Watchlist</strong> ({watchlistIds.length} titles)
                </span>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                className="text-xs text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                ← Return to All Movies
              </button>
            </div>
          )}

          {/* Recommender Banner Prompt */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Unsure what to watch tonight?</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Try the Intelligent Movie Recommendation Matcher
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl">
                Match your exact mood, pacing, and genre tastes to find the perfect film with tailored reasons why you will love it.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsRecommenderOpen(true)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
              >
                Launch Recommender
              </button>
              <button
                onClick={handleSurpriseMe}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-lg border border-zinc-700 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                <span>Spin Random</span>
              </button>
            </div>
          </div>

          {/* Interactive Genre Selector */}
          <GenreSelector
            genres={GENRES}
            selectedGenre={selectedGenre}
            onSelectGenre={(genre) => setSelectedGenre(genre)}
            genreCounts={genreCounts}
          />

          {/* Search, Filter & Sort Controls */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalResults={filteredMovies.length}
            minRating={minRating}
            setMinRating={setMinRating}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            availableMoods={availableMoods}
          />

          {/* Main Movie Catalog Grid */}
          <MovieGrid
            movies={filteredMovies}
            onSelectMovie={(movie) => setSelectedMovie(movie)}
            onWatchTrailer={(movie) => setTrailerMovie(movie)}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onResetFilters={handleResetFilters}
            title={
              activeTab === 'watchlist'
                ? 'Your Saved Watchlist'
                : selectedGenre === 'All'
                ? searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'All Recommended Movies'
                : `${selectedGenre} Recommendations`
            }
            subtitle={
              activeTab === 'watchlist'
                ? 'Films you have bookmarked to experience'
                : selectedGenre === 'All'
                ? 'Critically acclaimed motion pictures and modern masterpieces'
                : `Top rated titles in the ${selectedGenre} category`
            }
          />

          {/* Curated Theme Collections */}
          <CuratedSections
            allMovies={MOVIES_DATABASE}
            onSelectMovie={(movie) => setSelectedMovie(movie)}
            onWatchTrailer={(movie) => setTrailerMovie(movie)}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
          />
        </div>
      </main>

      {/* Movie Details Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onWatchTrailer={(movie) => setTrailerMovie(movie)}
        isBookmarked={selectedMovie ? isBookmarked(selectedMovie.id) : false}
        onToggleBookmark={toggleBookmark}
        allMovies={MOVIES_DATABASE}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
      />

      {/* Trailer Screening Modal */}
      <TrailerModal
        movie={trailerMovie}
        onClose={() => setTrailerMovie(null)}
      />

      {/* Smart Recommender Wizard */}
      <RecommenderWizard
        allMovies={MOVIES_DATABASE}
        isOpen={isRecommenderOpen}
        onClose={() => setIsRecommenderOpen(false)}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onWatchTrailer={(movie) => setTrailerMovie(movie)}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
      />

      {/* Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistMovies={watchlistMovies}
        watchedMovieIds={watchedIds}
        onToggleWatched={toggleWatched}
        onRemoveFromWatchlist={removeFromWatchlist}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        onWatchTrailer={(movie) => setTrailerMovie(movie)}
      />

      {/* Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#06070a] py-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-white">CineScope</span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span>Curated film recommendations and cinema discovery</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Back to Top
            </button>
            <button
              onClick={() => setIsRecommenderOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Recommender
            </button>
            <button
              onClick={() => setIsWatchlistOpen(true)}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Watchlist ({watchlistIds.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
