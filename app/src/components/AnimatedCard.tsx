import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  colors?: string[];
  style?: object;
  delay?: number;
}

export const AnimatedCard = ({
  children,
  onPress,
  colors = ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  style,
  delay = 0,
}: AnimatedCardProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, delay]);

  const handlePress = () => {
    if (onPress) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <Pressable onPress={handlePress} style={styles.pressable}>
        <BlurView intensity={20} style={styles.blur}>
          <LinearGradient
            colors={colors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {children}
          </LinearGradient>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    borderRadius: 20,
  },
});
