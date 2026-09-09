export type FeedbackState = 'neutral' | 'correct' | 'close' | 'wrong';

// The Data representation
export interface GameLevel {
  id: string;
  metric: string; 
  data: {
    label: string;
    value: string; // <--- Add this
    correctIndex: number;
  }[];
}

// The UI representation
export interface OrdinalItem {
  id: string;
  label: string;
  value: string; // <--- Add this
  correctIndex: number; 
  state: FeedbackState;
}

export interface GameStats {
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null; // To check if they already played today (optional for now)
}