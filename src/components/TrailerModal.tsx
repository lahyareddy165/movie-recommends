import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Star } from 'lucide-react';

interface TrailerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Official Cinema Preview
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-sm font-bold text-white line-clamp-1">{movie.title} ({movie.year})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group select-none">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isPlaying ? 'scale-105 filter brightness-95' : 'scale-100 filter brightness-70'
            }`}
          />

          {/* Cinematic Letterbox Bars */}
          <div className="absolute top-0 inset-x-0 h-4 bg-black/80" />
          <div className="absolute bottom-0 inset-x-0 h-4 bg-black/80" />

          {/* Center Play/Pause Overlay indicator */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            {!isPlaying && (
              <div className="p-4 rounded-full bg-amber-500/90 text-black shadow-2xl transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black" />
              </div>
            )}
          </div>

          {/* Cinematic Watermark / Quality */}
          <div className="absolute top-6 left-6 text-xs font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
            4K UHD · Dolby Atmos
          </div>

          {/* Tagline Watermark */}
          <div className="absolute bottom-16 left-6 max-w-md pointer-events-none">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              Now Previewing
            </div>
            <div className="text-lg sm:text-2xl font-display font-bold text-white drop-shadow-md">
              {movie.title}
            </div>
            {movie.tagline && (
              <p className="text-xs text-zinc-300 drop-shadow line-clamp-1 mt-0.5 italic">
                "{movie.tagline}"
              </p>
            )}
          </div>

          {/* Video Control Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
            {/* Progress Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(percentage);
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden group/bar"
            >
              <div
                className="h-full bg-amber-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                  {Math.floor((progress * 1.5) / 60)}:
                  {Math.floor((progress * 1.5) % 60)
                    .toString()
                    .padStart(2, '0')}{' '}
                  / 2:30
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-mono tabular-nums">{movie.rating.toFixed(1)}</span>
                </div>
                <button
                  onClick={() => {
                    const elem = document.documentElement;
                    if (!document.fullscreenElement) {
                      elem.requestFullscreen?.().catch(() => {});
                    } else {
                      document.exitFullscreen?.().catch(() => {});
                    }
                  }}
                  className="hover:text-white text-zinc-400 transition-colors"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
