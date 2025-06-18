import { journalService } from '../journal';
import { apiClient } from '../../config/api';
import { JournalEntry, JournalEntryInput } from '../../types';

// Mock the API client
jest.mock('../../config/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('journalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEntries', () => {
    const mockEntries: JournalEntry[] = [
      {
        id: 1,
        title: 'Test Entry 1',
        content: 'Content 1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        mood: 'Happy',
        mood_score: 8,
        top_emotions: ['joy', 'excitement'],
        summary: 'Summary 1',
        analysis_completed: true,
        user_id: 1,
      },
      {
        id: 2,
        title: 'Test Entry 2',
        content: 'Content 2',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        mood: 'Sad',
        mood_score: 3,
        top_emotions: ['sadness', 'disappointment'],
        summary: 'Summary 2',
        analysis_completed: true,
        user_id: 1,
      },
    ];

    it('should fetch all journal entries successfully', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockEntries });

      const result = await journalService.getAllEntries();

      expect(apiClient.get).toHaveBeenCalledWith('/journals/');
      expect(result).toEqual(mockEntries);
    });

    it('should handle error when fetching entries', async () => {
      const errorMessage = 'Failed to fetch entries';
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(journalService.getAllEntries()).rejects.toThrow(errorMessage);
    });

    it('should handle network error when fetching entries', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(journalService.getAllEntries()).rejects.toThrow(
        'Failed to fetch journal entries'
      );
    });
  });

  describe('getEntry', () => {
    const mockEntry: JournalEntry = {
      id: 1,
      title: 'Test Entry',
      content: 'Test Content',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      mood: 'Happy',
      mood_score: 8,
      top_emotions: ['joy', 'excitement'],
      summary: 'Test Summary',
      analysis_completed: true,
      user_id: 1,
    };

    it('should fetch a single journal entry successfully', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockEntry });

      const result = await journalService.getEntry(1);

      expect(apiClient.get).toHaveBeenCalledWith('/journals/1');
      expect(result).toEqual(mockEntry);
    });

    it('should handle error when fetching entry', async () => {
      const errorMessage = 'Entry not found';
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(journalService.getEntry(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('createEntry', () => {
    const mockEntryInput: JournalEntryInput = {
      title: 'New Entry',
      content: 'New Content',
    };

    const mockCreatedEntry: JournalEntry = {
      id: 1,
      ...mockEntryInput,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      mood: 'Neutral',
      mood_score: 5,
      top_emotions: [],
      summary: '',
      analysis_completed: false,
      user_id: 1,
    };

    it('should create a new journal entry successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockCreatedEntry });

      const result = await journalService.createEntry(mockEntryInput);

      expect(apiClient.post).toHaveBeenCalledWith('/journals/', mockEntryInput);
      expect(result).toEqual(mockCreatedEntry);
    });

    it('should handle error when creating entry', async () => {
      const errorMessage = 'Invalid entry data';
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(journalService.createEntry(mockEntryInput)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateEntry', () => {
    const mockEntryInput: JournalEntryInput = {
      title: 'Updated Entry',
      content: 'Updated Content',
    };

    const mockUpdatedEntry: JournalEntry = {
      id: 1,
      ...mockEntryInput,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      mood: 'Happy',
      mood_score: 8,
      top_emotions: ['joy'],
      summary: 'Updated Summary',
      analysis_completed: true,
      user_id: 1,
    };

    it('should update a journal entry successfully', async () => {
      (apiClient.put as jest.Mock).mockResolvedValueOnce({ data: mockUpdatedEntry });

      const result = await journalService.updateEntry(1, mockEntryInput);

      expect(apiClient.put).toHaveBeenCalledWith('/journals/1', mockEntryInput);
      expect(result).toEqual(mockUpdatedEntry);
    });

    it('should handle error when updating entry', async () => {
      const errorMessage = 'Entry not found';
      (apiClient.put as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(journalService.updateEntry(1, mockEntryInput)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteEntry', () => {
    it('should delete a journal entry successfully', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValueOnce({});

      await journalService.deleteEntry(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/journals/1');
    });

    it('should handle error when deleting entry', async () => {
      const errorMessage = 'Entry not found';
      (apiClient.delete as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(journalService.deleteEntry(1)).rejects.toThrow(errorMessage);
    });
  });
}); 