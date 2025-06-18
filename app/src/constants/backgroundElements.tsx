import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const renderBackgroundElements = () => (
  <View style={backgroundStyles.backgroundContainer}>
    <View style={[backgroundStyles.circle, backgroundStyles.circle1]} />
    <View style={[backgroundStyles.circle, backgroundStyles.circle2]} />
    <View style={[backgroundStyles.circle, backgroundStyles.circle3]} />

    <View style={[backgroundStyles.triangle, backgroundStyles.triangle1]} />
    <View style={[backgroundStyles.triangle, backgroundStyles.triangle2]} />

    <View style={[backgroundStyles.square, backgroundStyles.square1]} />
    <View style={[backgroundStyles.square, backgroundStyles.square2]} />
    <View style={[backgroundStyles.square, backgroundStyles.square3]} />

    <View style={[backgroundStyles.line, backgroundStyles.line1]} />
    <View style={[backgroundStyles.line, backgroundStyles.line2]} />

    <View style={backgroundStyles.patternOverlay} />
  </View>
);

export const backgroundStyles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: '#667eea',
    top: -150,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: '#764ba2',
    bottom: -50,
    left: -75,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: '#f093fb',
    top: height * 0.3,
    right: -50,
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    opacity: 0.08,
  },
  triangle1: {
    borderLeftWidth: 80,
    borderRightWidth: 80,
    borderBottomWidth: 140,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#667eea',
    top: height * 0.1,
    left: width * 0.1,
    transform: [{ rotate: '25deg' }],
  },
  triangle2: {
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f093fb',
    bottom: height * 0.2,
    right: width * 0.2,
    transform: [{ rotate: '-45deg' }],
  },
  square: {
    position: 'absolute',
    opacity: 0.06,
  },
  square1: {
    width: 60,
    height: 60,
    backgroundColor: '#667eea',
    top: height * 0.15,
    right: width * 0.15,
    transform: [{ rotate: '45deg' }],
    borderRadius: 8,
  },
  square2: {
    width: 40,
    height: 40,
    backgroundColor: '#764ba2',
    bottom: height * 0.35,
    left: width * 0.8,
    transform: [{ rotate: '30deg' }],
    borderRadius: 6,
  },
  square3: {
    width: 30,
    height: 30,
    backgroundColor: '#f093fb',
    top: height * 0.6,
    left: width * 0.1,
    transform: [{ rotate: '15deg' }],
    borderRadius: 4,
  },
  line: {
    position: 'absolute',
    backgroundColor: '#667eea',
    opacity: 0.05,
  },
  line1: {
    width: 2,
    height: height * 0.4,
    top: height * 0.1,
    left: width * 0.7,
    transform: [{ rotate: '20deg' }],
  },
  line2: {
    width: 2,
    height: height * 0.3,
    bottom: height * 0.1,
    right: width * 0.3,
    transform: [{ rotate: '-30deg' }],
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 20, 40, 0.4)',
  },
});
