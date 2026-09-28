import React from 'react';
import { Bookmark, Sparkles, Shuffle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'browse' | 'recommender' | 'watchlist';
  setActiveTab: (tab: 'browse' | 'recommender' | 'watchlist') => void;
  watchlistCount: number;
  onSurpriseMe: () => void;
  onOpenRecommender: () => void;
  onOpenWatchlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  onSurpriseMe,
  onOpenRecommender,
  onOpenWatchlist,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element Brand mark */}
        <button
          onClick={() => setActiveTab('browse')}
          className="text-left font-display text-xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors"
        >
          CineScope
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors hover:text-white ${
              activeTab === 'browse' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
            }`}
          >
            Browse Movies
          </button>
          <a
            href="#genres-section"
            className="transition-colors hover:text-white"
          >
            Genres
          </a>
          <a
            href="#curated-section"
            className="transition-colors hover:text-white"
          >
            Curated Collections
          </a>
          <button
            onClick={onOpenRecommender}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'recommender' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Recommender</span>
          </button>
          <button
            onClick={onOpenWatchlist}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'watchlist' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
            }`}
          >
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSurpriseMe}
            title="Random Movie Recommendation"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>
          
          <button
            onClick={onOpenWatchlist}
            className="relative p-2 text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg transition-colors"
            aria-label="View Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
