import React, { useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native";

interface HeaderProps {
  children: React.ReactNode;
  reloadGame: () => void;
  pauseGame: () => void;
  isPaused: boolean;
}

export default function Header({ children, reloadGame, pauseGame, isPaused }: HeaderProps): JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePausePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    pauseGame();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, styles.reloadContainer]}>
          <TouchableOpacity 
            onPress={reloadGame}
            style={styles.buttonContainer}
            activeOpacity={0.7}
          >
            <Text style={[styles.button, styles.reloadButton]}>↺</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.iconContainer, styles.pauseContainer]}>
          <TouchableOpacity 
            onPress={handlePausePress}
            style={styles.buttonContainer}
            activeOpacity={0.7}
          >
            <Animated.Text 
              style={[
                styles.button,
                styles.pauseButton,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              {isPaused ? "▶" : "⏸"}
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightSection}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: '#F0F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  reloadContainer: {
    backgroundColor: '#FFE4E1', // Light red background
  },
  pauseContainer: {
    marginLeft: 10,
    backgroundColor: '#E6E6FA', // Light purple background
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 28,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 32,
  },
  reloadButton: {
    color: '#FF6B6B', // Red color for reload
  },
  pauseButton: {
    color: '#6B66FF', // Purple color for pause
  },
});