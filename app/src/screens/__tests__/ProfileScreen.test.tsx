import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ProfileScreen } from '../ProfileScreen';
import { authService } from '../../services/auth';
import { useStore } from '../../store/useStore';

// Mock the auth service
jest.mock('../../services/auth', () => ({
  authService: {
    logout: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ProfileScreen', () => {
  const mockUser = {
    id: '1',
    email: 'john@example.com',
    displayName: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    createdAt: '2024-03-21T10:00:00Z',
  };

  const mockUserWithoutDisplayName = {
    id: '1',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    createdAt: '2024-03-21T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.setState({
      user: mockUser,
      entries: [],
      isLoading: false,
      error: null,
    });
  });

  it('renders correctly with user data', () => {
    const { getAllByText, getByText } = render(<ProfileScreen />);

    // Check that email appears (might appear multiple times)
    expect(getAllByText('john@example.com').length).toBeGreaterThan(0);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  it('renders correctly without display name', () => {
    useStore.setState({ user: mockUserWithoutDisplayName });
    const { getAllByText, queryByText, getByText } = render(<ProfileScreen />);

    // Check that email appears (might appear multiple times)
    expect(getAllByText('john@example.com').length).toBeGreaterThan(0);
    expect(queryByText('John Doe')).toBeTruthy(); // This will still show because first_name and last_name exist
    expect(getByText('Logout')).toBeTruthy();
  });

  it('shows correct avatar initial', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('JD')).toBeTruthy(); // First letter of first_name and last_name
  });

  it('handles successful logout', async () => {
    (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByText } = render(<ProfileScreen />);

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    // Wait for the confirmation alert to appear
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: expect.any(Function),
          },
        ]
      );
    });

    // Simulate pressing the "Logout" button in the alert
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const logoutButton = alertCall[2][1]; // Second button in the alert
    await act(async () => {
      await logoutButton.onPress();
    });

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(useStore.getState().user).toBeNull();
    });
  });

  it('handles logout error with alert', async () => {
    const errorMessage = 'Network error';
    (authService.logout as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { getByText } = render(<ProfileScreen />);

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    // Wait for the confirmation alert to appear
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: expect.any(Function),
          },
        ]
      );
    });

    // Simulate pressing the "Logout" button in the alert
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const logoutButton = alertCall[2][1]; // Second button in the alert

    // Clear the mock to prepare for the error alert
    jest.clearAllMocks();

    await act(async () => {
      await logoutButton.onPress();
    });

    // Now expect the error alert to be shown
    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout Error',
        'Failed to logout. Please try again.',
        [{ text: 'OK' }]
      );
    });
  });

  it('renders with no user data', () => {
    useStore.setState({ user: null });
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Logout')).toBeTruthy();
    expect(getByText('U')).toBeTruthy(); // Default avatar
  });

  it('handles user with empty email', () => {
    const userWithEmptyEmail = { ...mockUser, email: '', first_name: '', last_name: '' };
    useStore.setState({ user: userWithEmptyEmail });
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('U')).toBeTruthy(); // Default avatar for empty name
    expect(getByText('Logout')).toBeTruthy();
  });
}); 