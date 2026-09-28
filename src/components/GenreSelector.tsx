import React from 'react';
import { Genre } from '../types/movie';
import { Film } from 'lucide-react';

interface GenreSelectorProps {
  genres: Genre[];
  selectedGenre: Genre;
  onSelectGenre: (genre: Genre) => void;
  genreCounts: Record<string, number>;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
  genreCounts,
}) => {
  return (
    <div id="genres-section" className="w-full py-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-display">
            Filter by Genre
          </h2>
        </div>
        <span className="text-xs text-zinc-400 tabular-nums">
          {genres.length - 1} Categories available
        </span>
      </div>

      {/* Horizontal Scrollable Genre Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {genres.map((genre) => {
          const isActive = selectedGenre === genre;
          const count = genreCounts[genre] || 0;

          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span>{genre}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
