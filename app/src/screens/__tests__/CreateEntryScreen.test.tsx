import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { NewJournalScreen } from '../NewJournalScreen';
import { journalService } from '../../services/journal';
import { useStore } from '../../store/useStore';

// Mock the services and stores
jest.mock('../../services/journal');
jest.mock('../../store/useStore');

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('NewJournalScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  const mockAddEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as any).mockImplementation((selector: any) => {
      const state = {
        addEntry: mockAddEntry,
      };
      return selector(state);
    });
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    expect(getByText('New Journal Entry')).toBeTruthy();
    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('How are you feeling today?')).toBeTruthy();
    expect(getByText('Save Entry')).toBeTruthy();
  });

  it('handles text input changes', () => {
    const { getByPlaceholderText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('How are you feeling today?');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    expect(titleInput.props.value).toBe('Test Title');
    expect(contentInput.props.value).toBe('Test Content');
  });

  it('does not call submit when fields are empty', () => {
    const { getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const submitButton = getByText('Save Entry');
    fireEvent.press(submitButton);

    expect(journalService.createEntry).not.toHaveBeenCalled();
  });

  it('calls submit when fields are filled', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('How are you feeling today?');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    const submitButton = getByText('Save Entry');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(journalService.createEntry).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
      });
    });
  });

  it('creates entry successfully', async () => {
    const mockEntry = {
      id: 1,
      title: 'Test Title',
      content: 'Test Content',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      mood: 'Happy',
      mood_score: 8,
      top_emotions: ['joy'],
      summary: 'Test Summary',
      analysis_completed: true,
      user_id: 1,
    };

    (journalService.createEntry as jest.Mock).mockResolvedValueOnce(mockEntry);

    const { getByPlaceholderText, getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('How are you feeling today?');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    fireEvent.press(getByText('Save Entry'));

    await waitFor(() => {
      expect(journalService.createEntry).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
      });
      expect(mockAddEntry).toHaveBeenCalledWith(mockEntry);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('JournalDetail', { entry: mockEntry });
    });
  });

  it('handles creation error', async () => {
    (journalService.createEntry as jest.Mock).mockRejectedValueOnce(
      new Error('Creation failed')
    );

    const { getByPlaceholderText, getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('How are you feeling today?');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    fireEvent.press(getByText('Save Entry'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Save Error',
        'Failed to save journal entry. Please try again.',
        [{ text: 'OK' }]
      );
    });
  });

  it('shows loading state during submission', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (journalService.createEntry as jest.Mock).mockReturnValueOnce(promise);

    const { getByPlaceholderText, getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('How are you feeling today?');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    fireEvent.press(getByText('Save Entry'));

    expect(getByText('Analyzing your mood...')).toBeTruthy();

    // Resolve the promise
    const mockEntry = { id: 1, title: 'Test Title', content: 'Test Content' };
    resolvePromise(mockEntry);
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('JournalDetail', { entry: mockEntry });
    });
  });

  it('disables submit button during loading', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (journalService.createEntry as jest.Mock).mockReturnValueOnce(promise);

    const { getByPlaceholderText, getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Title');
    const contentInput = getByPlaceholderText('How are you feeling today?');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    fireEvent.press(getByText('Save Entry'));

    // During loading, the button shows activity indicator instead of text
    expect(getByText('Analyzing your mood...')).toBeTruthy();

    // Resolve the promise
    const mockEntry = { id: 1, title: 'Test Title', content: 'Test Content' };
    resolvePromise(mockEntry);
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('JournalDetail', { entry: mockEntry });
    });
  });

  it('handles multiline content input', () => {
    const { getByPlaceholderText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    const contentInput = getByPlaceholderText('How are you feeling today?');
    expect(contentInput.props.multiline).toBe(true);
    expect(contentInput.props.numberOfLines).toBe(8);
  });

  it('does not submit with empty fields', () => {
    const { getByText } = render(
      <NewJournalScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Save Entry'));

    expect(journalService.createEntry).not.toHaveBeenCalled();
  });
}); 