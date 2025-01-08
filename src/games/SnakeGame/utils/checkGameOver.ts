import { Coordinate } from "../types/types";

export const checkGameOver = (
  head: Coordinate,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  body: Coordinate[]
): boolean => {
  // Only check boundary collision
  return (
    head.x < bounds.xMin || 
    head.x > bounds.xMax || 
    head.y < bounds.yMin || 
    head.y > bounds.yMax
  );
};