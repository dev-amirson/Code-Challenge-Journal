import { apiClient } from '../config/api';
import { JournalEntry, JournalEntryInput } from '../types';

export const journalService = {
  async getAllEntries(): Promise<JournalEntry[]> {
    try {
      const response = await apiClient.get<JournalEntry[]>('/journals/');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch journal entries'
      );
    }
  },

  async getEntry(id: number): Promise<JournalEntry> {
    try {
      const response = await apiClient.get<JournalEntry>(`/journals/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch journal entry'
      );
    }
  },

  async createEntry(entryData: JournalEntryInput): Promise<JournalEntry> {
    try {
      const response = await apiClient.post<JournalEntry>(
        '/journals/',
        entryData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create journal entry'
      );
    }
  },

  async updateEntry(
    id: number,
    entryData: JournalEntryInput
  ): Promise<JournalEntry> {
    try {
      const response = await apiClient.put<JournalEntry>(
        `/journals/${id}`,
        entryData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update journal entry'
      );
    }
  },

  async deleteEntry(id: number): Promise<void> {
    try {
      await apiClient.delete(`/journals/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete journal entry'
      );
    }
  },
};
