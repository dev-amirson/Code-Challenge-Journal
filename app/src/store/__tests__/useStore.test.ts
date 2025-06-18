import { useStore } from '../useStore';
import { JournalEntry } from '../../types';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      user: null,
      isLoading: false,
      error: null,
      entries: [],
      selectedMood: null,
      sortBy: 'date',
    });
  });

  describe('Auth State', () => {
    it('should set user correctly', () => {
      const user = { id: '1', email: 'test@example.com' };
      useStore.getState().setUser(user);
      expect(useStore.getState().user).toEqual(user);
    });

    it('should set auth loading state correctly', () => {
      useStore.getState().setAuthLoading(true);
      expect(useStore.getState().isLoading).toBe(true);
    });

    it('should set auth error correctly', () => {
      const error = 'Authentication failed';
      useStore.getState().setAuthError(error);
      expect(useStore.getState().error).toBe(error);
    });

    it('should clear auth error when set to null', () => {
      useStore.getState().setAuthError('Some error');
      useStore.getState().setAuthError(null);
      expect(useStore.getState().error).toBeNull();
    });
  });

  describe('Journal State', () => {
    const mockEntries: JournalEntry[] = [
      {
        id: 1,
        title: 'Entry 1',
        content: 'Content 1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        mood: 'Happy',
        mood_score: 8,
        top_emotions: ['joy'],
        summary: 'Summary 1',
        analysis_completed: true,
        user_id: 1,
      },
      {
        id: 2,
        title: 'Entry 2',
        content: 'Content 2',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        mood: 'Sad',
        mood_score: 3,
        top_emotions: ['sadness'],
        summary: 'Summary 2',
        analysis_completed: true,
        user_id: 1,
      },
    ];

    it('should set entries correctly', () => {
      useStore.getState().setEntries(mockEntries);
      expect(useStore.getState().entries).toEqual(mockEntries);
    });

    it('should add entry correctly', () => {
      const newEntry: JournalEntry = {
        id: 3,
        title: 'New Entry',
        content: 'New Content',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        mood: 'Neutral',
        mood_score: 5,
        top_emotions: [],
        summary: 'New Summary',
        analysis_completed: true,
        user_id: 1,
      };

      useStore.getState().setEntries(mockEntries);
      useStore.getState().addEntry(newEntry);
      expect(useStore.getState().entries).toHaveLength(3);
      expect(useStore.getState().entries[2]).toEqual(newEntry);
    });

    it('should update entry correctly', () => {
      useStore.getState().setEntries(mockEntries);
      const updatedEntry = {
        ...mockEntries[0],
        title: 'Updated Title',
        content: 'Updated Content',
      };

      useStore.getState().updateEntry(updatedEntry);
      expect(useStore.getState().entries[0]).toEqual(updatedEntry);
      expect(useStore.getState().entries[1]).toEqual(mockEntries[1]);
    });

    it('should delete entry correctly', () => {
      useStore.getState().setEntries(mockEntries);
      useStore.getState().deleteEntry(1);
      expect(useStore.getState().entries).toHaveLength(1);
      expect(useStore.getState().entries[0]).toEqual(mockEntries[1]);
    });

    it('should set journal loading state correctly', () => {
      useStore.getState().setJournalLoading(true);
      expect(useStore.getState().isLoading).toBe(true);
    });

    it('should set journal error correctly', () => {
      const error = 'Failed to fetch entries';
      useStore.getState().setJournalError(error);
      expect(useStore.getState().error).toBe(error);
    });

    it('should set selected mood correctly', () => {
      useStore.getState().setSelectedMood('Happy');
      expect(useStore.getState().selectedMood).toBe('Happy');
    });

    it('should clear selected mood when set to null', () => {
      useStore.getState().setSelectedMood('Happy');
      useStore.getState().setSelectedMood(null);
      expect(useStore.getState().selectedMood).toBeNull();
    });

    it('should set sort by correctly', () => {
      useStore.getState().setSortBy('moodScore');
      expect(useStore.getState().sortBy).toBe('moodScore');
    });

    it('should maintain sort by when setting entries', () => {
      useStore.getState().setSortBy('moodScore');
      useStore.getState().setEntries(mockEntries);
      expect(useStore.getState().sortBy).toBe('moodScore');
    });
  });
}); 