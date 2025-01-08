import React from "react";
import { StyleSheet, View } from "react-native";
import { Coordinate } from "./types/types";
import { GRID_SIZE } from "./constants/layout";

interface SnakeProps {
  snake: Coordinate[];
}

export default function Snake({ snake }: SnakeProps): JSX.Element {
  return (
    <>
      {snake.map((segment: Coordinate, index: number) => {
        const isHead = index === 0;
        const segmentStyle = {
          left: segment.x * GRID_SIZE,
          top: segment.y * GRID_SIZE,
          backgroundColor: isHead ? '#2E7D32' : '#4A90E2', // Green head, blue body
          borderWidth: isHead ? 2 : 0,
          borderColor: '#1B5E20',
        };
        return <View key={index} style={[styles.snake, segmentStyle]} />;
      })}
    </>
  );
}

const styles = StyleSheet.create({
  snake: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
  },
});