import { StyleSheet, Text, View } from "react-native";
import { Coordinate } from "./types/types";
import { GRID_SIZE } from "./constants/layout";

interface FoodProps extends Coordinate {
  emoji: string;
}

export default function Food({ x, y, emoji }: FoodProps): JSX.Element {
  return (
    <View
      style={[
        styles.foodContainer,
        {
          left: x * GRID_SIZE - 4,
          top: y * GRID_SIZE - 4,
        },
      ]}
    >
      <Text style={styles.food}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  foodContainer: {
    width: 28,
    height: 28,
    position: "absolute",
    backgroundColor: 'rgba(50, 50, 50, 0.85)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  food: {
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    color: '#FFFFFF',
  },
});