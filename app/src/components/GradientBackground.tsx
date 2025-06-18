import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: [string, string];
  style?: object;
}

export const GradientBackground = ({
  children,
  colors = ['#667eea', '#764ba2'],
  style,
}: GradientBackgroundProps) => {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width,
    height,
  },
});
