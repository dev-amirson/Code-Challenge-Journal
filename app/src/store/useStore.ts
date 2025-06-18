import { create } from 'zustand';
import { AuthState, JournalState, JournalEntry } from '../types';
import { User } from '../types/auth';

interface AppState extends Omit<AuthState, 'user'>, JournalState {
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;

  setEntries: (entries: JournalEntry[]) => void;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: number) => void;
  setJournalLoading: (isLoading: boolean) => void;
  setJournalError: (error: string | null) => void;
  setSelectedMood: (mood: string | null) => void;
  setSortBy: (sortBy: 'date' | 'moodScore') => void;
}

export const useStore = create<AppState>(set => ({
  user: null,
  isLoading: false,
  error: null,

  entries: [],
  selectedMood: null,
  sortBy: 'date',

  setUser: user => set({ user }),
  setAuthLoading: isLoading => set({ isLoading }),
  setAuthError: error => set({ error }),

  setEntries: entries => set({ entries }),
  addEntry: entry => set(state => ({ entries: [...state.entries, entry] })),
  updateEntry: entry =>
    set(state => ({
      entries: state.entries.map(e => (e.id === entry.id ? entry : e)),
    })),
  deleteEntry: id =>
    set(state => ({
      entries: state.entries.filter(e => e.id !== id),
    })),
  setJournalLoading: isLoading => set({ isLoading }),
  setJournalError: error => set({ error }),
  setSelectedMood: mood => set({ selectedMood: mood }),
  setSortBy: sortBy => set({ sortBy }),
}));
