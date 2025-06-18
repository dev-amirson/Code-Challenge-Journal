import React, { useRef } from 'react';
import { StyleSheet, Pressable, Animated, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  mode?: 'contained' | 'outlined' | 'text';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: object;
  colors?: string[];
}

export const Button = ({
  mode = 'contained',
  onPress,
  loading = false,
  disabled = false,
  children,
  style,
  colors = ['#667eea', '#764ba2'],
}: ButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  if (mode === 'contained') {
    return (
      <Animated.View
        style={[styles.container, { transform: [{ scale: scaleAnim }] }, style]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={styles.pressable}
        >
          <LinearGradient
            colors={
              disabled || loading ? (['#ccc', '#999'] as any) : (colors as any)
            }
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color='white' size='small' />
            ) : (
              <Text style={styles.text}>{children}</Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }, style]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.pressable, mode === 'outlined' && styles.outlined]}
      >
        {loading ? (
          <ActivityIndicator color={colors[0]} size='small' />
        ) : (
          <Text
            style={[
              styles.text,
              mode === 'outlined' && { color: colors[0] },
              mode === 'text' && { color: colors[0] },
            ]}
          >
            {children}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pressable: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  outlined: {
    borderWidth: 2,
    borderColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
