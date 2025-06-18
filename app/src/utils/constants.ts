import { JournalEntry } from '../types';

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 1,
    user_id: 1,
    title: 'My First Journal Entry',
    content:
      'Today was a great day! I felt really happy and accomplished. I finished my work early and had time to relax.',
    created_at: '2024-06-13T10:00:00.000Z',
    updated_at: '2024-06-13T10:00:00.000Z',
    mood: 'Happy',
    mood_score: 8,
    top_emotions: ['Joy', 'Satisfaction', 'Calm'],
    summary:
      'The user expresses positive emotions and satisfaction with their day.',
    analysis_completed: true,
  },
  {
    id: 2,
    user_id: 1,
    title: 'Challenging Day',
    content:
      'Had some difficulties at work today. Feeling a bit stressed but trying to stay positive.',
    created_at: '2024-06-12T10:00:00.000Z',
    updated_at: '2024-06-12T10:00:00.000Z',
    mood: 'Anxious',
    mood_score: 4,
    top_emotions: ['Stress', 'Worry', 'Hope'],
    summary:
      'The user is experiencing stress but maintains a positive outlook.',
    analysis_completed: true,
  },
  {
    id: 3,
    user_id: 1,
    title: 'Peaceful Evening',
    content:
      'Spent the evening reading a good book and drinking tea. Feeling very calm and centered.',
    created_at: '2024-06-11T10:00:00.000Z',
    updated_at: '2024-06-11T10:00:00.000Z',
    mood: 'Calm',
    mood_score: 9,
    top_emotions: ['Peace', 'Contentment', 'Relaxation'],
    summary: 'The user is in a very peaceful and relaxed state.',
    analysis_completed: true,
  },
];
