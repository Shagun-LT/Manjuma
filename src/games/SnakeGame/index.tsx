import { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import { Direction, Coordinate, GestureEventType } from "./types/types";
import { checkEatsFood } from "./utils/checkEatsFood";
import { checkGameOver } from "./utils/checkGameOver";
import { randomFoodPosition } from "./utils/randomFoodPosition";
import Food from "./Food";
import Header from "./Header";
import Score from "./Score";
import Snake from "./Snake";
import { getRandomFruit } from "./constants/fruits";
import GameOver from "./GameOver";
import { SNAKE_INITIAL_POSITION, FOOD_INITIAL_POSITION, GAME_BOUNDS, MOVE_INTERVAL } from "./constants/game";
import Sound from 'react-native-sound';
import { loadSounds } from "./constants/sounds";
import IntroScreen from './IntroScreen';

export default function Game(): JSX.Element {
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentFruit, setCurrentFruit] = useState(getRandomFruit());
  const [sounds, setSounds] = useState<{ 
    hitSound: Sound | null;
    eatSound: Sound | null;
    bgMusic: Sound | null;
  } | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const loadedSounds = loadSounds();
    setSounds(loadedSounds);

    if (loadedSounds.bgMusic) {
      loadedSounds.bgMusic.setNumberOfLoops(-1);
      loadedSounds.bgMusic.setVolume(0.5);
    }

    Sound.setCategory('Playback');

    const timer = setTimeout(() => {
      loadedSounds.bgMusic?.play((success) => {
        if (!success) {
          console.log('Failed to play background music');
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      loadedSounds.hitSound?.release();
      loadedSounds.eatSound?.release();
      loadedSounds.bgMusic?.release();
    };
  }, []);

  const playHitSound = useCallback(() => {
    if (!sounds?.hitSound) return;
    
    sounds.hitSound.stop();
    sounds.hitSound.play((success) => {
      if (!success) {
        console.log('Failed to play hit sound');
      }
    });
  }, [sounds]);

  const playEatSound = useCallback(() => {
    if (!sounds?.eatSound) return;
    
    sounds.eatSound.stop();
    sounds.eatSound.play((success) => {
      if (!success) {
        console.log('Failed to play eat sound');
      }
    });
  }, [sounds]);

  const moveSnake = useCallback(() => {
    if (showIntro) return;

    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }

    // Check boundary collision
    if (checkGameOver(newHead, GAME_BOUNDS, [])) {
      playHitSound();
      setIsGameOver(true);
      return;
    }

    // Check self collision with the entire body except the tail
    const willHitBody = snake.some((segment, index) => {
      // Skip checking the tail since it will move
      if (index === snake.length - 1) return false;
      return segment.x === newHead.x && segment.y === newHead.y;
    });

    if (willHitBody) {
      playHitSound();
      setIsGameOver(true);
      return;
    }

    if (checkEatsFood(newHead, food, 2)) {
      playEatSound();
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      const newScore = score + currentFruit.points;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      setCurrentFruit(getRandomFruit());
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  }, [snake, direction, food, score, currentFruit, sounds, showIntro, highScore, playEatSound, playHitSound]);

  useEffect(() => {
    if (!isGameOver && !showIntro) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
    return undefined;
  }, [snake, isGameOver, isPaused, moveSnake, showIntro]);
  const handleGesture = (event: GestureEventType) => {
    if (showIntro) return;

    const { translationX, translationY } = event.nativeEvent;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0 && direction !== Direction.Left) {
        setDirection(Direction.Right);
      } else if (translationX < 0 && direction !== Direction.Right) {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0 && direction !== Direction.Up) {
        setDirection(Direction.Down);
      } else if (translationY < 0 && direction !== Direction.Down) {
        setDirection(Direction.Up);
      }
    }
  };

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
    setCurrentFruit(getRandomFruit());
    
    if (sounds?.bgMusic) {
      sounds.bgMusic.stop();
      sounds.bgMusic.play((success) => {
        if (!success) {
          console.log('Failed to restart background music');
        }
      });
    }
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const handleStartGame = () => {
    setShowIntro(false);
  };

  // console.log(JSON.stringify(snake, null, 0));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <SafeAreaView style={styles.container}>
          <Header
            reloadGame={reloadGame}
            pauseGame={pauseGame}
            isPaused={isPaused}
          >
            <Score score={score} currentFruit={currentFruit.emoji} />
          </Header>
          <View style={styles.boundaries}>
            <ImageBackground 
              source={require('../../res/snakeBg.jpg')} 
              style={[
                StyleSheet.absoluteFillObject,
                {
                  transform: [{ rotate: '90deg' }],
                  width: '100%',
                  height: '100%',
                  margin: 0,
                  zIndex: -1,
                  opacity: 1,
                }
              ]}
              imageStyle={{ transform: [{ rotate: '90deg' }] }}
            />
            <Snake snake={snake} />
            <Food x={food.x} y={food.y} emoji={currentFruit.emoji} />
            {isGameOver && <GameOver score={score} handleRestart={reloadGame} />}
            {showIntro && <IntroScreen onStartGame={handleStartGame} highScore={highScore} />}
          </View>
        </SafeAreaView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  boundaries: {
    flex: 1,
    position: 'relative', // Ensure proper stacking context
  },
});