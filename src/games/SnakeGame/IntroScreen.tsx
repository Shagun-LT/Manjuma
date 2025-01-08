import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Dimensions
} from 'react-native';

interface IntroScreenProps {
  onStartGame: () => void;
  highScore?: number;
}

const IntroScreen = ({ onStartGame, highScore = 0 }: IntroScreenProps): JSX.Element => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const snakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    // Animated.timing(fadeAnim, {
    //   toValue: 1,
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start();

    // Pulsing animation for the start button
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Snake movement animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(snakeAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(snakeAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const snakeTranslateX = snakeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  return (
    <Animated.View style={[styles.container, { opacity: 1 }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Snake Game</Text>

        <Animated.View
          style={{
            transform: [{ translateX: snakeTranslateX }],
            marginBottom: 20,
          }}
        >
          <Text style={styles.snakeEmoji}>🐍</Text>
        </Animated.View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            • Swipe to control the snake{'\n'}
            • Collect fruits to grow longer{'\n'}
            • Each fruit has different points{'\n'}
            • Don't hit the walls or yourself!
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={onStartGame}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  snakeEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scoreContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  highScore: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    // marginTop: 20,
    marginBottom: 60,
  },
  instructions: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default IntroScreen; 