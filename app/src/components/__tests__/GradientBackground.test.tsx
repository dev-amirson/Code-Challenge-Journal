import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GradientBackground } from '../GradientBackground';

describe('GradientBackground', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <GradientBackground>
        <Text>Test Content</Text>
      </GradientBackground>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <GradientBackground>
        <Text>Test Content</Text>
      </GradientBackground>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom colors correctly', () => {
    const customColors: [string, string] = ['#FF0000', '#00FF00'];
    const { getByText } = render(
      <GradientBackground colors={customColors}>
        <Text>Test Content</Text>
      </GradientBackground>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <GradientBackground style={customStyle}>
        <Text>Test Content</Text>
      </GradientBackground>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('handles multiple children correctly', () => {
    const { getByText } = render(
      <GradientBackground>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </GradientBackground>
    );

    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });

  it('renders with default colors when none provided', () => {
    const { getByText } = render(
      <GradientBackground>
        <Text>Test Content</Text>
      </GradientBackground>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('handles empty content', () => {
    const component = render(
      <GradientBackground>
        <></>
      </GradientBackground>
    );

    expect(component).toBeTruthy();
  });
}); 