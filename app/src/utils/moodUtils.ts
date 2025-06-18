export const getMoodColors = (mood: string): string[] => {
  const moodColorMap: { [key: string]: string[] } = {
    Happy: ['#FFE59D', '#FFC371'],
    Sad: ['#B3C6E7', '#8BADD8'],
    Angry: ['#FFB199', '#FF8A80'],
    Fearful: ['#E1BEE7', '#CE93D8'],
    Neutral: ['#E8EAF6', '#C5CAE9'],
    Anxious: ['#FFF59D', '#FFF176'],
    Excited: ['#C8E6C9', '#A5D6A7'],
    Calm: ['#B2EBF2', '#80DEEA'],
  };
  const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
  return moodColorMap[normalizedMood] || ['#E8EAF6', '#C5CAE9'];
};

export const getMoodEmoji = (mood: string): string => {
  const emojiMap: { [key: string]: string } = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😠',
    Fearful: '😨',
    Neutral: '😐',
    Anxious: '😰',
    Excited: '🤩',
    Calm: '😌',
  };
  const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
  return emojiMap[normalizedMood] || '😐';
};
