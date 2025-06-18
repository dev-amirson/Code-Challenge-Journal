import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { JournalEntryCard } from '../JournalEntryCard';
import { JournalEntry } from '../../types';

describe('JournalEntryCard', () => {
  const mockOnPress = jest.fn();
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} />
    );

    expect(getByText('Test Entry')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Test Entry'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('displays mood emoji correctly', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} />
    );

    expect(getByText('😊')).toBeTruthy();
  });

  it('displays mood text correctly', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} />
    );

    expect(getByText('Happy')).toBeTruthy();
  });

  it('displays mood score correctly', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} />
    );

    expect(getByText('8/10')).toBeTruthy();
  });

  it('displays formatted date correctly', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} />
    );

    expect(getByText(/Dec 31, 2023|Jan 1, 2024/)).toBeTruthy();
  });

  it('handles entry without mood', () => {
    const entryWithoutMood = {
      ...mockEntry,
      mood: '',
      mood_score: 0,
    };

    const { queryByText, getByText } = render(
      <JournalEntryCard entry={entryWithoutMood} onPress={mockOnPress} />
    );

    expect(getByText('Test Entry')).toBeTruthy();
    expect(queryByText('😊')).toBeNull();
    expect(queryByText('Happy')).toBeNull();
  });

  it('handles entry with different mood', () => {
    const sadEntry = {
      ...mockEntry,
      mood: 'Sad',
      mood_score: 3,
    };

    const { getByText } = render(
      <JournalEntryCard entry={sadEntry} onPress={mockOnPress} />
    );

    expect(getByText('😢')).toBeTruthy();
    expect(getByText('Sad')).toBeTruthy();
    expect(getByText('3/10')).toBeTruthy();
  });

  it('handles delay prop correctly', () => {
    const { getByText } = render(
      <JournalEntryCard entry={mockEntry} onPress={mockOnPress} delay={500} />
    );

    expect(getByText('Test Entry')).toBeTruthy();
  });

  it('truncates long content', () => {
    const longContentEntry = {
      ...mockEntry,
      content: 'This is a very long content that should be truncated after three lines. '.repeat(10),
    };

    const { getByText } = render(
      <JournalEntryCard entry={longContentEntry} onPress={mockOnPress} />
    );

    expect(getByText(/This is a very long content/)).toBeTruthy();
  });
}); 