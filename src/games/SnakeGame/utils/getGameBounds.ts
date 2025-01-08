import { Dimensions } from 'react-native';
import { GRID_SIZE, HEADER_HEIGHT } from '../constants/layout';

export const getGameBounds = () => {
  const screen = Dimensions.get('window');

  // Calculate maximum cells that can fit in the screen
  const xMax = Math.floor((screen.width - 30) / GRID_SIZE); // -30 for padding
  const yMax = Math.floor((screen.height - HEADER_HEIGHT - 30) / GRID_SIZE); // -30 for padding

  return {
    xMin: 0,
    xMax,
    yMin: 0,
    yMax,
  };
}; 