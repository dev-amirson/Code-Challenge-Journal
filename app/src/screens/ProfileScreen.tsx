import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Alert, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Text, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { AnimatedCard } from '../components/AnimatedCard';
import { Button } from '../components/Button';
import { renderBackgroundElements } from '../constants/backgroundElements';
import { authService } from '../services/auth';
import { useStore } from '../store/useStore';
import { getMoodColors, getMoodEmoji } from '../utils/moodUtils';
import { formatDate } from '../utils/dateUtils';
import { journalService } from '../services/journal';

const { width } = Dimensions.get('window');

// Simple stats card component
const StatsCard = ({ icon, title, value, subtitle }: {
  icon: string;
  title: string;
  value: string;
  subtitle?: string;
}) => (
  <View style={styles.statsCard}>
    <View style={styles.statsCardContent}>
      <Text style={styles.statsIcon}>{icon}</Text>
      <View style={styles.statsTextContainer}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.statsSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  </View>
);

// Simple mood chart component
const MoodChart = ({ entries }: { entries: any[] }) => {
  const chartData = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayEntry = entries.find(entry =>
        entry.created_at.split('T')[0] === dateStr
      );

      last7Days.push({
        date: dateStr,
        mood_score: dayEntry?.mood_score || null,
        mood: dayEntry?.mood || null,
        day: date.toLocaleDateString('en', { weekday: 'short' })
      });
    }

    return last7Days;
  }, [entries]);

  const maxScore = 10;
  const chartHeight = 100;
  const chartWidth = width - 80;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>7-Day Mood Trend</Text>

      <View style={styles.chart}>
        {/* Simple grid lines */}
        {[2, 4, 6, 8, 10].map(line => (
          <View
            key={line}
            style={[
              styles.gridLine,
              { bottom: (line / maxScore) * chartHeight }
            ]}
          />
        ))}

        {/* Data visualization */}
        <View style={styles.chartData}>
          {chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * (chartWidth - 40);
            const y = point.mood_score
              ? chartHeight - (point.mood_score / maxScore) * chartHeight
              : null;

            return (
              <View key={point.date} style={styles.dataPointContainer}>
                {/* Data point */}
                {y !== null && (
                  <View
                    style={[
                      styles.dataPoint,
                      {
                        left: x,
                        top: y,
                        backgroundColor: point.mood ? getMoodColors(point.mood)[0] : '#6366f1'
                      }
                    ]}
                  />
                )}

                {/* Day label */}
                <Text
                  style={[
                    styles.dayLabel,
                    { left: x - 12, top: chartHeight + 12 }
                  ]}
                >
                  {point.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const ProfileScreen = () => {
  const user = useStore(state => state.user);
  const entries = useStore(state => state.entries);
  const setUser = useStore(state => state.setUser);
  const setEntries = useStore(state => state.setEntries);

  const [refreshing, setRefreshing] = useState(false);
  const [moodAnalysisInProgress, setMoodAnalysisInProgress] = useState(false);

  // Check for incomplete mood analysis and poll for updates
  useEffect(() => {
    const incompleteEntries = entries.filter(entry =>
      !entry.analysis_completed || !entry.mood
    );

    if (incompleteEntries.length > 0) {
      setMoodAnalysisInProgress(true);

      const pollForUpdates = async () => {
        try {
          const updatedEntries = await journalService.getAllEntries();
          setEntries(updatedEntries);

          const stillIncomplete = updatedEntries.filter(entry =>
            !entry.analysis_completed || !entry.mood
          );

          if (stillIncomplete.length === 0) {
            setMoodAnalysisInProgress(false);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error polling for mood analysis updates:', error);
          setMoodAnalysisInProgress(false);
          return true;
        }
      };

      const pollInterval = setInterval(async () => {
        const completed = await pollForUpdates();
        if (completed) {
          clearInterval(pollInterval);
        }
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [entries, setEntries]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const updatedEntries = await journalService.getAllEntries();
      setEntries(updatedEntries);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [setEntries]);

  const calculateStreak = (entries: any[]) => {
    if (entries.length === 0) return 0;

    const sortedEntries = [...entries].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.created_at);
      entryDate.setHours(0, 0, 0, 0);

      const diffTime = currentDate.getTime() - entryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays === streak + 1) {
        continue;
      } else {
        break;
      }
    }

    return streak;
  };

  const userStats = useMemo(() => {
    const recentEntries = entries.slice(0, 30);
    const avgMoodScore = recentEntries.length > 0
      ? (recentEntries.reduce((sum, entry) => sum + (entry.mood_score || 0), 0) / recentEntries.length).toFixed(1)
      : '0';

    const mostCommonMood = recentEntries.length > 0
      ? recentEntries
        .filter(entry => entry.mood)
        .reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {};

    const topMood = Object.keys(mostCommonMood).length > 0
      ? Object.keys(mostCommonMood).reduce((a, b) => mostCommonMood[a] > mostCommonMood[b] ? a : b)
      : 'Neutral';

    const streakDays = entries.length > 0 ? calculateStreak(entries) : 0;

    return {
      totalEntries: entries.length,
      avgMoodScore,
      mostCommonMood: topMood,
      streakDays,
    };
  }, [entries]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              setUser(null);
            } catch (error) {
              Alert.alert(
                'Logout Error',
                'Failed to logout. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const getInitials = () => {
    if (!user?.first_name && !user?.last_name) return 'U';
    const firstInitial = user.first_name?.charAt(0) || '';
    const lastInitial = user.last_name?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.email || 'User';
  };

  return (
    <View style={styles.container}>
      {renderBackgroundElements()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
      >
        {/* Analysis Progress */}
        {moodAnalysisInProgress && (
          <View style={styles.analysisCard}>
            <ActivityIndicator size="small" color="#6366f1" />
            <Text style={styles.analysisText}>Analyzing mood patterns...</Text>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.profileSection}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <Text style={styles.displayName}>{getDisplayName()}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            icon="📝"
            title="Entries"
            value={userStats.totalEntries.toString()}
          />
          <StatsCard
            icon="📊"
            title="Avg Mood"
            value={userStats.avgMoodScore}
            subtitle="/10"
          />
          <StatsCard
            icon={getMoodEmoji(userStats.mostCommonMood)}
            title="Common"
            value={userStats.mostCommonMood}
          />
          <StatsCard
            icon="🔥"
            title="Streak"
            value={userStats.streakDays.toString()}
            subtitle="days"
          />
        </View>

        {/* Mood Chart */}
        {entries.length > 0 && (
          <View style={styles.section}>
            <MoodChart entries={entries} />
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptyText}>Start journaling to track your mood</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {entries.slice(0, 5).map((entry, index) => (
                <View key={entry.id} style={styles.activityItem}>
                  <View style={[
                    styles.moodIndicator,
                    { backgroundColor: entry.mood ? getMoodColors(entry.mood)[0] : '#64748b' }
                  ]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{entry.title}</Text>
                    <Text style={styles.activityDate}>{formatDate(entry.created_at)}</Text>
                  </View>
                  {entry.mood && (
                    <Chip
                      mode="outlined"
                      style={styles.moodChip}
                      textStyle={styles.moodChipText}
                    >
                      {entry.mood}
                    </Chip>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    marginBottom: 50,
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Analysis Progress
  analysisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  analysisText: {
    color: '#ffffff',
    marginLeft: 12,
    fontSize: 14,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  avatarLabel: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#94a3b8',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statsCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  statsIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statsTextContainer: {
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  statsSubtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },

  // Sections
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },

  // Chart
  chartContainer: {
    paddingBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    height: 140,
    position: 'relative',
    marginHorizontal: 20,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartData: {
    position: 'relative',
    height: 100,
  },
  dataPointContainer: {
    position: 'absolute',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  dayLabel: {
    position: 'absolute',
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    width: 24,
  },

  // Activity
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  moodIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  moodChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  moodChipText: {
    color: '#ffffff',
    fontSize: 12,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },

  // Logout
  logoutSection: {
    paddingHorizontal: 24,
  },
  logoutButton: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
});
