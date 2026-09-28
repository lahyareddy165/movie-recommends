import React, { useState } from 'react';
import { Bookmark, Sparkles, Shuffle, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveTab('browse');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element Brand mark */}
        <button
          onClick={() => {
            setActiveTab('browse');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left font-display text-xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors cursor-pointer"
        >
          CineScope
        </button>

        {/* Zone 2: 4-5 clean text navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          <button
            onClick={() => {
              setActiveTab('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'browse' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
            }`}
          >
            Browse Movies
          </button>

          <button
            onClick={() => scrollTo('genres-section')}
            className="transition-colors hover:text-white cursor-pointer"
          >
            Genres
          </button>

          <button
            onClick={() => scrollTo('curated-section')}
            className="transition-colors hover:text-white cursor-pointer"
          >
            Curated Collections
          </button>

          <button
            onClick={() => {
              setActiveTab('recommender');
              onOpenRecommender();
            }}
            className={`transition-colors hover:text-white flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'recommender' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Recommender</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('watchlist');
              onOpenWatchlist();
            }}
            className={`transition-colors hover:text-white flex items-center gap-1.5 cursor-pointer ${
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
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSurpriseMe}
            title="Random Movie Recommendation"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('watchlist');
              onOpenWatchlist();
            }}
            className="relative p-2 text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 rounded-lg transition-colors cursor-pointer"
            aria-label="View Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0d0e14] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setActiveTab('browse');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors"
          >
            Browse Movies
          </button>
          <button
            onClick={() => scrollTo('genres-section')}
            className="w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors"
          >
            Filter by Genre
          </button>
          <button
            onClick={() => scrollTo('curated-section')}
            className="w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors"
          >
            Curated Collections
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveTab('recommender');
              onOpenRecommender();
            }}
            className="w-full text-left py-2 text-sm font-medium text-amber-400 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Recommender</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveTab('watchlist');
              onOpenWatchlist();
            }}
            className="w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-amber-400 flex items-center justify-between"
          >
            <span>My Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 tabular-nums">
                {watchlistCount} titles
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
