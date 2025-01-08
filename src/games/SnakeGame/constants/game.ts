import { getGameBounds } from '../utils/getGameBounds';
import { GRID_SIZE } from './layout';

export { GRID_SIZE };
export const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
export const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
export const GAME_BOUNDS = getGameBounds();
export const MOVE_INTERVAL = 50; 