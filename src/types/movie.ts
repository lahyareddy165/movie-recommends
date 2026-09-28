export type Genre =
  | 'All'
  | 'Sci-Fi'
  | 'Action'
  | 'Drama'
  | 'Thriller'
  | 'Crime'
  | 'Comedy'
  | 'Animation'
  | 'Adventure'
  | 'Horror'
  | 'Romance'
  | 'Mystery'
  | 'Fantasy';

export type Mood =
  | 'Mind-Bending'
  | 'Adrenaline Rush'
  | 'Emotional & Poetic'
  | 'Dark & Gritty'
  | 'Heartwarming'
  | 'Visually Epic'
  | 'Laugh Out Loud'
  | 'Edge of Seat';

export interface StreamingPlatform {
  name: string;
  type: 'Subscription' | 'Rent' | 'Buy';
  icon?: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  rating: number; // e.g. 8.8
  voteCount: string; // e.g. "1.8M"
  runtime: string; // e.g. "2h 49m"
  runtimeMinutes: number;
  genres: Genre[];
  director: string;
  cast: string[];
  synopsis: string;
  tagline: string;
  backdropUrl: string;
  posterBgGradient: string;
  posterAccent: string;
  moods: Mood[];
  awards?: string;
  contentRating: 'G' | 'PG' | 'PG-13' | 'R';
  streamingOn: StreamingPlatform[];
  featured?: boolean;
  matchReason?: string;
}

export type SortOption = 'rating-desc' | 'rating-asc' | 'year-desc' | 'year-asc' | 'title-asc';
