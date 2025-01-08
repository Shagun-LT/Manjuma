import { StyleSheet, Text, View } from "react-native";

interface ScoreProps {
  score: number;
  currentFruit: string;
}

export default function Score({ score, currentFruit }: ScoreProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.score}>
        {currentFruit} {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  score: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A90E2",
  },
});