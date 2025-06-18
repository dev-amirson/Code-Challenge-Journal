import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Test Button</Button>
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Test Button</Button>
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const { queryByText } = render(
      <Button onPress={mockOnPress} disabled>
        Test Button
      </Button>
    );

    const button = queryByText('Test Button');
    if (button) {
      fireEvent.press(button);
    }
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const { queryByText } = render(
      <Button onPress={mockOnPress} loading>
        Test Button
      </Button>
    );

    const button = queryByText('Test Button');
    if (button) {
      fireEvent.press(button);
    }
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loading state when loading prop is true', () => {
    const { queryByText } = render(
      <Button onPress={mockOnPress} loading>
        Test Button
      </Button>
    );

    expect(queryByText('Test Button')).toBeNull();
  });

  it('renders with outlined mode correctly', () => {
    const { getByText } = render(
      <Button onPress={mockOnPress} mode="outlined">
        Test Button
      </Button>
    );

    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('renders with text mode correctly', () => {
    const { getByText } = render(
      <Button onPress={mockOnPress} mode="text">
        Test Button
      </Button>
    );

    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <Button onPress={mockOnPress} style={customStyle}>
        Test Button
      </Button>
    );

    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('applies custom colors correctly', () => {
    const customColors = ['#FF0000', '#00FF00'];
    const { getByText } = render(
      <Button onPress={mockOnPress} colors={customColors}>
        Test Button
      </Button>
    );

    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('handles press in and press out animations', () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Test Button</Button>
    );

    const button = getByText('Test Button');
    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when both disabled and loading', () => {
    const { queryByText } = render(
      <Button onPress={mockOnPress} disabled loading>
        Test Button
      </Button>
    );

    expect(queryByText('Test Button')).toBeNull();
  });

  it('has accessible button behavior', () => {
    const { getByText } = render(
      <Button onPress={mockOnPress}>Test Button</Button>
    );

    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });
}); 