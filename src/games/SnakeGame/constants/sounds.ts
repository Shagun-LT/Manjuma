import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const loadSounds = () => {
  const hitSound = new Sound('snake_hit.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load hit sound', error);
    }
  });

  const eatSound = new Sound('snake_eat.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load eat sound', error);
    }
  });

  const bgMusic = new Sound('snake_bg.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load background music', error);
    }
  });

  return {
    hitSound,
    eatSound,
    bgMusic,
  };
}; 