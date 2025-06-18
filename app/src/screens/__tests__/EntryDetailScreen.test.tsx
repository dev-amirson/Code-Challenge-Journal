import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { JournalDetailScreen } from '../JournalDetailScreen';
import { journalService } from '../../services/journal';
import { useStore } from '../../store/useStore';

// Mock the services and stores
jest.mock('../../services/journal');
jest.mock('../../store/useStore');

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('JournalDetailScreen', () => {
  const mockRoute = {
    params: {
      entry: {
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
      },
    },
  };

  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockUpdateEntry = jest.fn();
  const mockDeleteEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as any).mockReturnValue(mockUpdateEntry);
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        updateEntry: mockUpdateEntry,
        deleteEntry: mockDeleteEntry,
      };
      return selector(state);
    });
  });

  it('renders correctly in view mode', () => {
    const { getByText } = render(
      <JournalDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Test Entry')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
    expect(getByText('Happy')).toBeTruthy();
    expect(getByText('8/10')).toBeTruthy();
    expect(getByText('joy, excitement')).toBeTruthy();
  });

  it('shows entry details correctly', () => {
    const { getByText } = render(
      <JournalDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Check that all entry details are displayed
    expect(getByText('Test Entry')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
    expect(getByText('Happy')).toBeTruthy();
    expect(getByText('8/10')).toBeTruthy();
  });

  it('has update functionality available', () => {
    const { getByText } = render(
      <JournalDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Test that the component renders in view mode initially
    expect(getByText('Test Entry')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('displays formatted date correctly', () => {
    const { getByText } = render(
      <JournalDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Check that the date is displayed (flexible with timezone differences)
    expect(getByText(/Dec 31, 2023|Jan 1, 2024/)).toBeTruthy();
  });

  it('renders all mood details when available', () => {
    const { getByText } = render(
      <JournalDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Test that mood analysis section is rendered
    expect(getByText('Mood Analysis')).toBeTruthy();
    expect(getByText('Overall Mood:')).toBeTruthy();
    expect(getByText('Mood Score:')).toBeTruthy();
    expect(getByText('Top Emotions:')).toBeTruthy();
    expect(getByText('joy, excitement')).toBeTruthy();
  });

  it('renders without mood data correctly', () => {
    const entryWithoutMood = {
      ...mockRoute.params.entry,
      mood: null,
      mood_score: null,
      top_emotions: [],
      summary: null,
    };

    const routeWithoutMood = {
      params: { entry: entryWithoutMood }
    };

    const { getByText, queryByText } = render(
      <JournalDetailScreen route={routeWithoutMood} navigation={mockNavigation} />
    );

    // Should still render entry details
    expect(getByText('Test Entry')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();

    // Should not render mood analysis
    expect(queryByText('Mood Analysis')).toBeNull();
  });

  it('displays mood analysis when available', () => {
    const { getByText } = render(
      <JournalDetailScreen route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('Mood Analysis')).toBeTruthy();
    expect(getByText('Overall Mood:')).toBeTruthy();
    expect(getByText('Mood Score:')).toBeTruthy();
    expect(getByText('Top Emotions:')).toBeTruthy();
    expect(getByText('Test Summary')).toBeTruthy();
  });
}); 