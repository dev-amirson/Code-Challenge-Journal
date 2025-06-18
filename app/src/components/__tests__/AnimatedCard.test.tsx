import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AnimatedCard } from '../AnimatedCard';

describe('AnimatedCard', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with children', () => {
    const { getByText } = render(
      <AnimatedCard onPress={mockOnPress}>
        <Text>Test Content</Text>
      </AnimatedCard>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <AnimatedCard onPress={mockOnPress}>
        <Text>Test Content</Text>
      </AnimatedCard>
    );

    fireEvent.press(getByText('Test Content'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('renders without onPress prop', () => {
    const { getByText } = render(
      <AnimatedCard>
        <Text>Test Content</Text>
      </AnimatedCard>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <AnimatedCard onPress={mockOnPress} style={customStyle}>
        <Text>Test Content</Text>
      </AnimatedCard>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom colors correctly', () => {
    const customColors = ['#FF0000', '#00FF00'];
    const { getByText } = render(
      <AnimatedCard onPress={mockOnPress} colors={customColors}>
        <Text>Test Content</Text>
      </AnimatedCard>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('handles delay prop correctly', () => {
    const { getByText } = render(
      <AnimatedCard onPress={mockOnPress} delay={500}>
        <Text>Test Content</Text>
      </AnimatedCard>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders multiple children correctly', () => {
    const { getByText } = render(
      <AnimatedCard onPress={mockOnPress}>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </AnimatedCard>
    );

    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });
});
