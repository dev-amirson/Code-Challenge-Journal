export { User } from './auth';

export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  mood: string;
  mood_score: number;
  top_emotions: string[];
  summary: string;
  analysis_completed: boolean;
  user_id: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  selectedMood: string | null;
  sortBy: 'date' | 'moodScore';
}

export interface JournalEntryInput {
  title: string;
  content: string;
}
