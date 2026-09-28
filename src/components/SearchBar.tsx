import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SortOption } from '../types/movie';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  totalResults: number;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  availableMoods: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  totalResults,
  minRating,
  setMinRating,
  selectedMood,
  setSelectedMood,
  availableMoods,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const quickSearchTags = [
    'Nolan',
    'Villeneuve',
    'Mind-Bending',
    'Oscar Winner',
    'Space',
    'Cyberpunk',
  ];

  const handleClear = () => {
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery !== '' || minRating > 0 || selectedMood !== '';

  const handleResetAll = () => {
    setSearchQuery('');
    setMinRating(0);
    setSelectedMood('');
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, director, actor, or themes (e.g. Inception, Nolan, Space)..."
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/90 text-sm text-white placeholder-zinc-500 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border text-xs font-medium transition-all ${
            hasActiveFilters || showFilters
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        {/* Sort Select */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-500 hidden lg:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-2"
            >
              <option value="rating-desc" className="bg-zinc-900 text-white">Top Rated (Highest First)</option>
              <option value="rating-asc" className="bg-zinc-900 text-white">Rating (Lowest First)</option>
              <option value="year-desc" className="bg-zinc-900 text-white">Release Year (Newest First)</option>
              <option value="year-asc" className="bg-zinc-900 text-white">Release Year (Oldest First)</option>
              <option value="title-asc" className="bg-zinc-900 text-white">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Advanced Filter Drawer */}
      {showFilters && (
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Minimum Rating Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
                <span className="font-semibold text-white">Minimum IMDb Rating</span>
                <span className="text-amber-400 font-mono font-bold tabular-nums">
                  {minRating > 0 ? `★ ${minRating.toFixed(1)}+` : 'Any Rating'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9.0"
                step="0.2"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>All</span>
                <span>★ 7.5+</span>
                <span>★ 8.0+</span>
                <span>★ 8.5+</span>
                <span>★ 9.0</span>
              </div>
            </div>

            {/* Mood / Vibe Filter */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
                <span className="font-semibold text-white">Mood / Narrative Vibe</span>
                {selectedMood && (
                  <button
                    onClick={() => setSelectedMood('')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Clear mood
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableMoods.map((mood) => {
                  const isSelected = selectedMood === mood;
                  return (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(isSelected ? '' : mood)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        isSelected
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reset Filters Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
            <span className="text-zinc-400">
              Showing <strong className="text-white tabular-nums">{totalResults}</strong> movies matching criteria
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetAll}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Search Tag Suggestions */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 overflow-x-auto pb-1 no-scrollbar">
        <span className="shrink-0 text-zinc-500">Popular:</span>
        {quickSearchTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchQuery(tag)}
            className="hover:text-amber-400 text-zinc-300 transition-colors shrink-0 underline decoration-zinc-700 underline-offset-4"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
