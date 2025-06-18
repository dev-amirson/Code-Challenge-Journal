import '@testing-library/jest-native/extend-expect';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('expo/virtual/env', () => ({
  env: process.env,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => { };
  return Reanimated;
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 0, height: 0 }),
}));

jest.mock('react-native-paper', () => {
  const actualPaper = jest.requireActual('react-native-paper');
  return {
    ...actualPaper,
    Text: actualPaper.Text,
    Avatar: {
      ...actualPaper.Avatar,
      Text: ({ label, size, style, ...props }) => {
        const React = require('react');
        const { Text, View } = require('react-native');
        return React.createElement(View, { style: [{ width: size, height: size }, style], ...props },
          React.createElement(Text, {}, label)
        );
      },
    },
    ActivityIndicator: ({ color, size, ...props }) => {
      const React = require('react');
      const { View } = require('react-native');
      return React.createElement(View, { testID: 'activity-indicator', ...props });
    },
    Snackbar: ({ children, visible, onDismiss, duration, ...props }) => {
      const React = require('react');
      const { View, Text } = require('react-native');
      if (!visible) return null;
      return React.createElement(View, { testID: 'snackbar', ...props },
        React.createElement(Text, {}, children)
      );
    },
  };
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.StatusBarManager = {
    getHeight: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
  };
  return RN;
}); 