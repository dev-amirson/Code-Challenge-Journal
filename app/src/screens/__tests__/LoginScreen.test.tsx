import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { LoginScreen } from '../LoginScreen';
import { authService } from '../../services/auth';
import { useStore } from '../../store/useStore';

// Mock the auth service
jest.mock('../../services/auth', () => ({
  authService: {
    login: jest.fn(),
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  const mockNavigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.setState({
      user: null,
      isLoading: false,
      error: null,
    });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Sign up")).toBeTruthy();
    expect(getByText('Welcome Back')).toBeTruthy();
  });

  it('handles email input correctly', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('handles password input correctly', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation} />);
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows validation error for invalid email on blur', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent(emailInput, 'blur');

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('shows validation error for empty password on blur', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(passwordInput, '');
    fireEvent(passwordInput, 'blur');

    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for short password on blur', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(passwordInput, '123');
    fireEvent(passwordInput, 'blur');

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters long')).toBeTruthy();
    });
  });

  it('shows snackbar error when validation fails', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');

    fireEvent.changeText(emailInput, 'invalid-email');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(getByTestId('snackbar')).toBeTruthy();
      expect(getByText('Please fix the errors above')).toBeTruthy();
    });
  });

  it('handles successful login', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    (authService.login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(useStore.getState().user).toEqual(mockUser);
    });
  });

  it('handles login error with alert', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Error',
        'An unexpected error occurred. Please check your credentials and try again..',
        [{ text: 'OK' }]
      );
    });
  });

  it('shows loading state during login', async () => {
    (authService.login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ user: { id: '1' } }), 100))
    );

    const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    act(() => {
      fireEvent.press(getByText('Login'));
    });

    // During loading, the text should not be visible
    expect(queryByText('Login')).toBeNull();
  });

  it('navigates to sign up screen', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    fireEvent.press(getByText("Don't have an account? Sign up"));
    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });

  it('clears error message when input changes', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');

    // Trigger error
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent(emailInput, 'blur');

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    // Clear error by changing input
    fireEvent.changeText(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(queryByText('Please enter a valid email address')).toBeNull();
    });
  });

  it('clears password error when input changes', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen navigation={mockNavigation} />);
    const passwordInput = getByPlaceholderText('Password');

    // Trigger error
    fireEvent.changeText(passwordInput, '');
    fireEvent(passwordInput, 'blur');

    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });

    // Clear error by changing input
    fireEvent.changeText(passwordInput, 'password123');

    await waitFor(() => {
      expect(queryByText('Password is required')).toBeNull();
    });
  });

  it('dismisses snackbar correctly', async () => {
    const { getByPlaceholderText, getByText, getByTestId, queryByTestId } = render(<LoginScreen navigation={mockNavigation} />);

    // Trigger snackbar error
    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(getByTestId('snackbar')).toBeTruthy();
    });

    // Dismiss snackbar
    fireEvent(getByTestId('snackbar'), 'onDismiss');

    await waitFor(() => {
      expect(queryByTestId('snackbar')).toBeNull();
    });
  });
}); 