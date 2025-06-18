import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { JournalEntry } from '../types';
import { AnimatedCard } from './AnimatedCard';
import { LinearGradient } from 'expo-linear-gradient';
import { getMoodColors, getMoodEmoji } from '../utils/moodUtils';
import { formatDate } from '../utils/dateUtils';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
  delay?: number;
}

export const JournalEntryCard = ({
  entry,
  onPress,
  delay = 0,
}: JournalEntryCardProps) => {
  const { title, content, created_at, mood, mood_score } = entry;

  return (
    <AnimatedCard
      onPress={onPress}
      colors={
        mood
          ? getMoodColors(mood)
          : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']
      }
      delay={delay}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.date}>{formatDate(created_at)}</Text>
        </View>

        <Text style={styles.contentText} numberOfLines={3}>
          {content}
        </Text>

        {mood && (
          <View style={styles.moodContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']}
              style={styles.moodBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
              <Text style={styles.moodText}>{mood}</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{mood_score}/10</Text>
              </View>
            </LinearGradient>
          </View>
        )}
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
    marginBottom: 16,
  },
  moodContainer: {
    alignItems: 'flex-start',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  moodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginRight: 8,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
  },
});
