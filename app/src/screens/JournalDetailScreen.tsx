import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, IconButton, Menu, ActivityIndicator } from 'react-native-paper';

import { Button } from '../components/Button';
import { CustomInput } from '../components/CustomInput';
import { renderBackgroundElements } from '../constants/backgroundElements';
import { journalService } from '../services/journal';
import { useStore } from '../store/useStore';
import { formatDate } from '../utils/dateUtils';

export const JournalDetailScreen = ({ route, navigation }: any) => {
  const { entry: initialEntry } = route.params;
  const [entry, setEntry] = useState(initialEntry);
  const [isEditing, setIsEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moodAnalysisLoading, setMoodAnalysisLoading] = useState(false);
  const updateEntryInStore = useStore(state => state.updateEntry);
  const deleteEntryFromStore = useStore(state => state.deleteEntry);

  const pollForMoodAnalysis = async () => {
    try {
      const updatedEntry = await journalService.getEntry(entry.id);
      if (updatedEntry.analysis_completed && updatedEntry.mood) {
        setEntry(updatedEntry);
        updateEntryInStore(updatedEntry);
        setMoodAnalysisLoading(false);

        const allEntries = await journalService.getAllEntries();
        const setEntries = useStore.getState().setEntries;
        setEntries(allEntries);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error polling for mood analysis:', error);
      setMoodAnalysisLoading(false);
      return true;
    }
  };

  useEffect(() => {
    if (!entry.analysis_completed && !entry.mood) {
      setMoodAnalysisLoading(true);

      const pollInterval = setInterval(async () => {
        const completed = await pollForMoodAnalysis();
        if (completed) {
          clearInterval(pollInterval);
        }
      }, 3000);

      return () => clearInterval(pollInterval);
    }
  }, [entry.id, entry.analysis_completed, entry.mood]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updatedEntry = await journalService.updateEntry(entry.id, {
        title: entry.title,
        content: entry.content,
      });

      setEntry(updatedEntry);
      updateEntryInStore(updatedEntry);
      setIsEditing(false);

      if (!updatedEntry.analysis_completed || !updatedEntry.mood) {
        setMoodAnalysisLoading(true);

        setTimeout(() => {
          const pollInterval = setInterval(async () => {
            const completed = await pollForMoodAnalysis();
            if (completed) {
              clearInterval(pollInterval);
            }
          }, 3000);
        }, 1000);
      }
    } catch (error) {
      Alert.alert(
        'Update Error',
        'Failed to update journal entry. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await journalService.deleteEntry(entry.id);
              deleteEntryFromStore(entry.id);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                'Delete Error',
                error.message ||
                'Failed to delete journal entry. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {renderBackgroundElements()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text variant='headlineSmall' style={styles.date}>
            {formatDate(entry.created_at)}
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon='dots-vertical'
                iconColor='#ffffff'
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setIsEditing(true);
                setMenuVisible(false);
              }}
              title='Edit'
            />
            <Menu.Item
              onPress={() => {
                handleDelete();
                setMenuVisible(false);
              }}
              title='Delete'
            />
          </Menu>
        </View>

        {isEditing ? (
          <>
            <Text variant='headlineMedium' style={styles.editTitle}>
              Edit Journal Entry
            </Text>

            <CustomInput
              label='Title'
              value={entry.title}
              onChangeText={(text: string) =>
                setEntry({ ...entry, title: text })
              }
              style={styles.inputStyle}
            />

            <CustomInput
              label='How are you feeling?'
              value={entry.content}
              onChangeText={(text: string) =>
                setEntry({ ...entry, content: text })
              }
              multiline={true}
              numberOfLines={8}
              style={[styles.inputStyle, styles.contentInputContainer]}
            />

            <Button
              onPress={handleUpdate}
              loading={loading}
              style={styles.button}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <View style={styles.contentCard}>
              <Text variant='titleLarge' style={styles.title}>
                {entry.title}
              </Text>
              <Text variant='bodyLarge' style={styles.content}>
                {entry.content}
              </Text>
            </View>

            {moodAnalysisLoading ? (
              <View style={styles.moodAnalysisLoadingContainer}>
                <ActivityIndicator size='small' color='#667eea' />
                <Text style={styles.moodAnalysisLoadingText}>
                  Analyzing your mood...
                </Text>
                <Text style={styles.moodAnalysisSubtext}>
                  This may take a few moments
                </Text>
              </View>
            ) : entry.mood ? (
              <View style={styles.moodContainer}>
                <Text variant='titleMedium' style={styles.moodTitle}>
                  Mood Analysis
                </Text>
                <View style={styles.moodDetails}>
                  <View style={styles.moodRow}>
                    <Text style={styles.moodLabel}>Overall Mood:</Text>
                    <Text style={styles.moodValue}>{entry.mood}</Text>
                  </View>
                  <View style={styles.moodRow}>
                    <Text style={styles.moodLabel}>Mood Score:</Text>
                    <Text style={styles.moodValue}>{entry.mood_score}/10</Text>
                  </View>
                  <View style={styles.moodRow}>
                    <Text style={styles.moodLabel}>Top Emotions:</Text>
                    <Text style={styles.moodValue}>
                      {entry.top_emotions.join(', ')}
                    </Text>
                  </View>
                  <Text style={styles.summary}>{entry.summary}</Text>
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },

  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  date: {
    color: '#9ca3af',
    fontWeight: '600',
  },
  contentCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  title: {
    color: '#ffffff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  content: {
    color: '#e5e7eb',
    lineHeight: 24,
  },
  inputContainer: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainerFocused: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderColor: '#667eea',
    borderWidth: 2,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    transform: [{ scale: 1.02 }],
  },
  contentInputContainer: {
    minHeight: 200,
  },
  input: {
    backgroundColor: 'transparent',
  },
  contentInput: {
    minHeight: 180,
  },
  button: {
    margin: 16,
    marginTop: 8,
  },
  moodContainer: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  moodTitle: {
    color: '#667eea',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  moodDetails: {
    gap: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodLabel: {
    color: '#9ca3af',
    fontWeight: '600',
    flex: 1,
  },
  moodValue: {
    color: '#ffffff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  summary: {
    color: '#e5e7eb',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  editTitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 16,
    fontWeight: '700',
  },
  inputStyle: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: '#374151',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  moodAnalysisLoadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 24,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  moodAnalysisLoadingText: {
    marginTop: 12,
    color: '#667eea',
    fontWeight: '600',
    fontSize: 16,
  },
  moodAnalysisSubtext: {
    marginTop: 4,
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
});
