import { getMoodColors, getMoodEmoji } from '../moodUtils';

describe('moodUtils', () => {
  describe('getMoodColors', () => {
    it('should return correct colors for Happy mood', () => {
      const colors = getMoodColors('Happy');
      expect(colors).toEqual(['#FFE59D', '#FFC371']);
    });

    it('should return correct colors for Sad mood', () => {
      const colors = getMoodColors('Sad');
      expect(colors).toEqual(['#B3C6E7', '#8BADD8']);
    });

    it('should return correct colors for Angry mood', () => {
      const colors = getMoodColors('Angry');
      expect(colors).toEqual(['#FFB199', '#FF8A80']);
    });

    it('should return correct colors for Fearful mood', () => {
      const colors = getMoodColors('Fearful');
      expect(colors).toEqual(['#E1BEE7', '#CE93D8']);
    });

    it('should return correct colors for Neutral mood', () => {
      const colors = getMoodColors('Neutral');
      expect(colors).toEqual(['#E8EAF6', '#C5CAE9']);
    });

    it('should return correct colors for Anxious mood', () => {
      const colors = getMoodColors('Anxious');
      expect(colors).toEqual(['#FFF59D', '#FFF176']);
    });

    it('should return correct colors for Excited mood', () => {
      const colors = getMoodColors('Excited');
      expect(colors).toEqual(['#C8E6C9', '#A5D6A7']);
    });

    it('should return correct colors for Calm mood', () => {
      const colors = getMoodColors('Calm');
      expect(colors).toEqual(['#B2EBF2', '#80DEEA']);
    });

    it('should return default colors for unknown mood', () => {
      const colors = getMoodColors('Unknown');
      expect(colors).toEqual(['#E8EAF6', '#C5CAE9']);
    });

    it('should handle case-insensitive mood names', () => {
      const colors = getMoodColors('happy');
      expect(colors).toEqual(['#FFE59D', '#FFC371']);
    });
  });

  describe('getMoodEmoji', () => {
    it('should return correct emoji for Happy mood', () => {
      const emoji = getMoodEmoji('Happy');
      expect(emoji).toBe('😊');
    });

    it('should return correct emoji for Sad mood', () => {
      const emoji = getMoodEmoji('Sad');
      expect(emoji).toBe('😢');
    });

    it('should return correct emoji for Angry mood', () => {
      const emoji = getMoodEmoji('Angry');
      expect(emoji).toBe('😠');
    });

    it('should return correct emoji for Fearful mood', () => {
      const emoji = getMoodEmoji('Fearful');
      expect(emoji).toBe('😨');
    });

    it('should return correct emoji for Neutral mood', () => {
      const emoji = getMoodEmoji('Neutral');
      expect(emoji).toBe('😐');
    });

    it('should return correct emoji for Anxious mood', () => {
      const emoji = getMoodEmoji('Anxious');
      expect(emoji).toBe('😰');
    });

    it('should return correct emoji for Excited mood', () => {
      const emoji = getMoodEmoji('Excited');
      expect(emoji).toBe('🤩');
    });

    it('should return correct emoji for Calm mood', () => {
      const emoji = getMoodEmoji('Calm');
      expect(emoji).toBe('😌');
    });

    it('should return default emoji for unknown mood', () => {
      const emoji = getMoodEmoji('Unknown');
      expect(emoji).toBe('😐');
    });

    it('should handle case-insensitive mood names', () => {
      const emoji = getMoodEmoji('happy');
      expect(emoji).toBe('😊');
    });
  });
}); 