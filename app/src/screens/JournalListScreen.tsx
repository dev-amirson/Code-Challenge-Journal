import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { FAB, Chip, Menu, Divider, Text } from 'react-native-paper';

import { JournalEntryCard } from '../components/JournalEntryCard';
import { renderBackgroundElements } from '../constants/backgroundElements';
import { useStore } from '../store/useStore';
import { JournalEntry } from '../types';
import { journalService } from '../services/journal';

export const JournalListScreen = ({ navigation }: any) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const entries = useStore(state => state.entries);
  const selectedMood = useStore(state => state.selectedMood);
  const sortBy = useStore(state => state.sortBy);
  const setEntries = useStore(state => state.setEntries);
  const setSelectedMood = useStore(state => state.setSelectedMood);
  const setSortBy = useStore(state => state.setSortBy);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await journalService.getAllEntries();
      setEntries(data);
    } catch (error: any) {
      Alert.alert(
        'Load Error',
        'Failed to load journal entries. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const filteredEntries = entries
    .filter(entry => !selectedMood || entry.mood === selectedMood)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return (b.mood_score || 0) - (a.mood_score || 0);
    });

  const moods = Array.from(
    new Set(
      entries.map(entry => entry.mood).filter((mood): mood is string => !!mood)
    )
  );

  const renderItem = ({ item }: { item: JournalEntry }) => (
    <JournalEntryCard
      entry={item}
      onPress={() => navigation.navigate('JournalDetail', { entry: item })}
    />
  );

  return (
    <View style={styles.container}>
      {renderBackgroundElements()}

      <View style={styles.contentContainer}>
        {entries.length > 0 && (
          <View style={styles.filterContainer}>
            <FlatList
              horizontal
              data={moods}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Chip
                  selected={selectedMood === item}
                  onPress={() =>
                    setSelectedMood(selectedMood === item ? null : item)
                  }
                  style={styles.moodChip}
                >
                  {item}
                </Chip>
              )}
              showsHorizontalScrollIndicator={false}
            />
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Chip onPress={() => setMenuVisible(true)}>
                  Sort by: {sortBy === 'date' ? 'Date' : 'Mood Score'}
                </Chip>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSortBy('date');
                  setMenuVisible(false);
                }}
                title='Date'
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  setSortBy('moodScore');
                  setMenuVisible(false);
                }}
                title='Mood Score'
              />
            </Menu>
          </View>
        )}

        {entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant='bodyLarge' style={styles.emptyText}>
              No journal entries yet
            </Text>
            <Text variant='bodyMedium' style={styles.emptySubtext}>
              Tap the + button to create your first entry
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}

        <FAB
          icon='plus'
          style={styles.fab}
          onPress={() => navigation.navigate('NewJournal')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  contentContainer: {
    flex: 1,
    zIndex: 10,
  },
  filterContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  moodChip: {
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 80,
    paddingTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70,
    backgroundColor: '#667eea',
  },
});
