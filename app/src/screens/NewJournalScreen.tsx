import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import { Button } from '../components/Button';
import { CustomInput } from '../components/CustomInput';
import { renderBackgroundElements } from '../constants/backgroundElements';
import { journalService } from '../services/journal';
import { useStore } from '../store/useStore';

export const NewJournalScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const addEntry = useStore(state => state.addEntry);

  const handleSubmit = async () => {
    if (!title || !content) return;

    try {
      setLoading(true);

      const result = await journalService.createEntry({ title, content });

      addEntry(result);
      navigation.navigate('JournalDetail', { entry: result });
    } catch (error: any) {
      Alert.alert(
        'Save Error',
        'Failed to save journal entry. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {renderBackgroundElements()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.content}>
          <Text variant='headlineMedium' style={styles.pageTitle}>
            New Journal Entry
          </Text>

          <CustomInput label='Title' value={title} onChangeText={setTitle} />

          <CustomInput
            label='How are you feeling today?'
            value={content}
            onChangeText={setContent}
            multiline={true}
            numberOfLines={8}
            style={styles.contentInputContainer}
          />

          {loading && (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size='small' color='#667eea' />
              <Text style={styles.analyzingText}>Analyzing your mood...</Text>
            </View>
          )}

          <Button
            onPress={handleSubmit}
            loading={loading}
            disabled={!title || !content || loading}
            style={styles.submitButton}
          >
            Save Entry
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
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  pageTitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '700',
  },
  contentInputContainer: {
    minHeight: 200,
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  analyzingText: {
    marginLeft: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
});
