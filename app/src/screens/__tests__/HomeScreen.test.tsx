import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { JournalListScreen } from '../JournalListScreen';
import { journalService } from '../../services/journal';
import { useStore } from '../../store/useStore';

// Mock the services and stores
jest.mock('../../services/journal');
jest.mock('../../store/useStore');

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('JournalListScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockEntries = [
    {
      id: 1,
      title: 'Test Entry 1',
      content: 'Test Content 1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      mood: 'Happy',
      mood_score: 8,
      top_emotions: ['joy'],
      summary: 'Test Summary 1',
      analysis_completed: true,
      user_id: 1,
    },
    {
      id: 2,
      title: 'Test Entry 2',
      content: 'Test Content 2',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      mood: 'Sad',
      mood_score: 3,
      top_emotions: ['sadness'],
      summary: 'Test Summary 2',
      analysis_completed: true,
      user_id: 1,
    },
  ];

  const mockSetEntries = jest.fn();
  const mockSetSelectedMood = jest.fn();
  const mockSetSortBy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        entries: mockEntries,
        selectedMood: null,
        sortBy: 'date',
        setEntries: mockSetEntries,
        setSelectedMood: mockSetSelectedMood,
        setSortBy: mockSetSortBy,
      };
      return selector(state);
    });
    (journalService.getAllEntries as jest.Mock).mockResolvedValue(mockEntries);
  });

  it('renders correctly with entries', async () => {
    const { getByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Test Entry 1')).toBeTruthy();
      expect(getByText('Test Entry 2')).toBeTruthy();
    });
  });

  it('loads entries on mount', async () => {
    render(<JournalListScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(journalService.getAllEntries).toHaveBeenCalled();
      expect(mockSetEntries).toHaveBeenCalledWith(mockEntries);
    });
  });

  it('navigates to new journal screen when FAB is pressed', () => {
    const { getByTestId } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('NewJournal');
  });

  it('navigates to journal detail when entry is pressed', async () => {
    const { getByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      const entryCard = getByText('Test Entry 1');
      fireEvent.press(entryCard);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('JournalDetail', {
        entry: mockEntries[0],
      });
    });
  });

  it('filters entries by mood', async () => {
    // Mock store with Happy mood selected
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        entries: mockEntries,
        selectedMood: 'Happy',
        sortBy: 'date',
        setEntries: mockSetEntries,
        setSelectedMood: mockSetSelectedMood,
        setSortBy: mockSetSortBy,
      };
      return selector(state);
    });

    const { getByText, queryByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Test Entry 1')).toBeTruthy();
      expect(queryByText('Test Entry 2')).toBeNull();
    });
  });

  it('handles mood filter selection', async () => {
    const { getAllByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      // Get the first "Happy" which should be the mood chip (not from journal entry)
      const happyChips = getAllByText('Happy');
      fireEvent.press(happyChips[0]);
      expect(mockSetSelectedMood).toHaveBeenCalledWith('Happy');
    });
  });

  it('handles mood filter deselection', async () => {
    // Mock store with Happy mood already selected
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        entries: mockEntries,
        selectedMood: 'Happy',
        sortBy: 'date',
        setEntries: mockSetEntries,
        setSelectedMood: mockSetSelectedMood,
        setSortBy: mockSetSortBy,
      };
      return selector(state);
    });

    const { getAllByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      // Get the first "Happy" which should be the mood chip (not from journal entry)
      const happyChips = getAllByText('Happy');
      fireEvent.press(happyChips[0]);
      expect(mockSetSelectedMood).toHaveBeenCalledWith(null);
    });
  });

  it('handles sort menu selection', async () => {
    const { getByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      // Test that the sort text is displayed
      expect(getByText('Sort by: Date')).toBeTruthy();
    });
  });

  it('displays empty state when no entries', async () => {
    // Mock empty entries
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        entries: [],
        selectedMood: null,
        sortBy: 'date',
        setEntries: mockSetEntries,
        setSelectedMood: mockSetSelectedMood,
        setSortBy: mockSetSortBy,
      };
      return selector(state);
    });

    const { getByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    expect(getByText('No journal entries yet')).toBeTruthy();
    expect(getByText('Tap the + button to create your first entry')).toBeTruthy();
  });

  it('handles load error', async () => {
    (journalService.getAllEntries as jest.Mock).mockRejectedValueOnce(
      new Error('Load failed')
    );

    render(<JournalListScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Load Error',
        'Failed to load journal entries. Please try again.',
        [{ text: 'OK' }]
      );
    });
  });

  it('shows mood chips when entries exist', async () => {
    const { getAllByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      const happyElements = getAllByText('Happy');
      const sadElements = getAllByText('Sad');
      expect(happyElements.length).toBeGreaterThan(0);
      expect(sadElements.length).toBeGreaterThan(0);
    });
  });

  it('does not show mood chips when no entries', async () => {
    // Mock empty entries
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        entries: [],
        selectedMood: null,
        sortBy: 'date',
        setEntries: mockSetEntries,
        setSelectedMood: mockSetSelectedMood,
        setSortBy: mockSetSortBy,
      };
      return selector(state);
    });

    const { queryByText } = render(
      <JournalListScreen navigation={mockNavigation} />
    );

    expect(queryByText('Happy')).toBeNull();
    expect(queryByText('Sad')).toBeNull();
  });
});
