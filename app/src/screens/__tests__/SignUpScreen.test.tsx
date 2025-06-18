import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SignUpScreen } from '../SignUpScreen';
import { authService } from '../../services/auth';
import { useStore } from '../../store/useStore';

// Mock the auth service
jest.mock('../../services/auth', () => ({
  authService: {
    register: jest.fn(),
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

describe('SignUpScreen', () => {
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
    const { getByPlaceholderText, getByText } = render(<SignUpScreen navigation={mockNavigation} />);

    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Already have an account? Login')).toBeTruthy();
  });

  it('handles first name input correctly', () => {
    const { getByPlaceholderText } = render(<SignUpScreen navigation={mockNavigation} />);
    const firstNameInput = getByPlaceholderText('First Name');

    fireEvent.changeText(firstNameInput, 'John');
    expect(firstNameInput.props.value).toBe('John');
  });

  it('handles last name input correctly', () => {
    const { getByPlaceholderText } = render(<SignUpScreen navigation={mockNavigation} />);
    const lastNameInput = getByPlaceholderText('Last Name');

    fireEvent.changeText(lastNameInput, 'Doe');
    expect(lastNameInput.props.value).toBe('Doe');
  });

  it('handles email input correctly', () => {
    const { getByPlaceholderText } = render(<SignUpScreen navigation={mockNavigation} />);
    const emailInput = getByPlaceholderText('Email');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('handles password input correctly', () => {
    const { getByPlaceholderText } = render(<SignUpScreen navigation={mockNavigation} />);
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(passwordInput, 'password123');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('handles confirm password input correctly', () => {
    const { getByPlaceholderText } = render(<SignUpScreen navigation={mockNavigation} />);
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');

    fireEvent.changeText(confirmPasswordInput, 'password123');
    expect(confirmPasswordInput.props.value).toBe('password123');
  });

  it('shows validation error for empty fields', async () => {
    const { getByText, getByTestId } = render(<SignUpScreen navigation={mockNavigation} />);

    await act(async () => {
      fireEvent.press(getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(getByTestId('snackbar')).toBeTruthy();
      expect(getByText('Please fill in all fields')).toBeTruthy();
    });
  });

  it('shows validation error for password mismatch', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<SignUpScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'different');

    await act(async () => {
      fireEvent.press(getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(getByTestId('snackbar')).toBeTruthy();
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('handles successful registration', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    (authService.register as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    const { getByPlaceholderText, getByText } = render(<SignUpScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    await act(async () => {
      fireEvent.press(getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        password_confirm: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(useStore.getState().user).toEqual(mockUser);
    });
  });

  it('handles registration error with alert', async () => {
    const errorMessage = 'Registration failed';
    (authService.register as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { getByPlaceholderText, getByText } = render(<SignUpScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    await act(async () => {
      fireEvent.press(getByText('Sign Up'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Registration Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    });
  });

  it('shows loading state during registration', async () => {
    (authService.register as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ user: { id: '1' } }), 100))
    );

    const { getByPlaceholderText, getByText, queryByText } = render(<SignUpScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    act(() => {
      fireEvent.press(getByText('Sign Up'));
    });

    // During loading, the text should not be visible
    expect(queryByText('Sign Up')).toBeNull();
  });

  it('navigates to login screen', () => {
    const { getByText } = render(<SignUpScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Already have an account? Login'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('clears error message when snackbar is dismissed', async () => {
    const { getByText, getByTestId, queryByTestId } = render(<SignUpScreen navigation={mockNavigation} />);

    // Trigger error
    await act(async () => {
      fireEvent.press(getByText('Sign Up'));
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
