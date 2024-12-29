import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { styles, TUBE_WIDTH, BALL_SIZE } from './styles';

const COLORS = {
  1: '#DC143C', // crimson
  2: '#9ACD32', // yellowgreen
  3: '#FFD700', // gold
  4: '#00BFFF', // deepskyblue
  5: '#4169E1', // royalblue
  6: '#FF69B4', // hotpink
  7: '#00FFFF', // cyan
  8: '#9400D3', // darkviolet
  9: '#228B22', // forestgreen
  10: '#FF4500', // orangered
};

const translations = {
  en: {
    title: 'Ball Sort Puzzle',
    backToActivities: 'Back to Activities',
    congratulations: 'Congratulations!',
    completed: 'You completed the game!',
    playAgain: 'Play Again',
  },
  hi: {
    title: 'बॉल सॉर्ट पज़ल',
    backToActivities: 'गतिविधियों पर वापस जाएं',
    congratulations: 'बधाई हो!',
    completed: 'आपने खेल पूरा कर लिया!',
    playAgain: 'फिर से खेलें',
  },
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Update the game configuration
const GAME_CONFIG = {
  easy: {
    tubeCount: 5,  // 3 filled + 2 empty
    ballsPerTube: 4,
    colors: ['#FF0000', '#0000FF', '#00FF00'] // Red, Blue, Green
  },
  medium: {
    tubeCount: 7,  // 5 filled + 2 empty
    ballsPerTube: 4,
    colors: ['#FF0000', '#0000FF', '#00FF00', '#FFD700', '#800080'] // Add Yellow and Purple
  },
  hard: {
    tubeCount: 9,  // 7 filled + 2 empty
    ballsPerTube: 4,
    colors: ['#FF0000', '#0000FF', '#00FF00', '#FFD700', '#800080', '#FFA500', '#FF69B4'] // Add Orange and Pink
  }
};

const BallSortGame = ({ navigation, difficulty = 'easy' }) => {
  const { isHindi } = useContext(LanguageContext);
  const currentLanguage = isHindi ? 'hi' : 'en';
  
  const [tubes, setTubes] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [selectedTube, setSelectedTube] = useState(null);
  
  const ballPosition = useRef(new Animated.ValueXY()).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const tubeRefs = useRef({});
  const successAnimation = useRef(null);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const findClosestTube = (x, y) => {
    let closestTube = null;
    let minDistance = Infinity;

    Object.entries(tubeRefs.current).forEach(([index, layout]) => {
      if (!layout) return;
      
      // Calculate center of the tube
      const tubeX = layout.x + layout.width / 2;
      const tubeY = layout.y + layout.height / 2;
      
      // Calculate distance to tube center
      const distance = Math.sqrt(
        Math.pow(x - tubeX, 2) +
        Math.pow(y - tubeY, 2)
      );

      // Check if this tube is closer than previous closest
      if (distance < minDistance) {
        minDistance = distance;
        closestTube = parseInt(index);
      }
    });

    // Only return a tube if it's within a reasonable distance (half the screen width)
    return minDistance < SCREEN_WIDTH / 2 ? closestTube : null;
  };

  const handleTubePress = (tubeIndex) => {
    if (selectedTube === null) {
      if (tubes[tubeIndex].balls.length > 0) {
        setSelectedTube(tubeIndex);
      }
    } else {
      if (selectedTube === tubeIndex) {
        setSelectedTube(null);
      } else {
        if (isValidMove(selectedTube, tubeIndex)) {
          // Save current state to history
          setMoveHistory(prev => [...prev, { tubes: JSON.parse(JSON.stringify(tubes)) }]);
          
          const newTubes = [...tubes];
          const ball = newTubes[selectedTube].balls.pop();
          newTubes[tubeIndex].balls.push(ball);
          setTubes(newTubes);
          setMoves(moves + 1);
          
          checkTubeCompletion(newTubes, tubeIndex);
          
          if (checkWinCondition(newTubes)) {
            handleGameComplete();
          }
        }
        setSelectedTube(null);
      }
    }
  };

  const initializeGame = () => {
    let items = [];
    const numColors = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    
    // Create 4 balls of each color
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= numColors; j++) {
        items.push(j);
      }
    }
    
    // Shuffle the balls
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    
    // Create tubes and distribute balls
    const newTubes = [];
    const totalTubes = numColors + 2; // Add 2 empty tubes
    
    // Create filled tubes
    for (let i = 0; i < numColors; i++) {
      newTubes.push({
        id: i,
        balls: items.slice(i * 4, (i + 1) * 4),
        completed: false
      });
    }
    
    // Add empty tubes
    for (let i = numColors; i < totalTubes; i++) {
      newTubes.push({
        id: i,
        balls: [],
        completed: false
      });
    }
    
    setTubes(newTubes);
    setSelectedTube(null);
    setMoves(0);
    setMoveHistory([]);
    setGameCompleted(false);
  };

  const checkTubeCompletion = (tubes, tubeIndex) => {
    const tube = tubes[tubeIndex];
    if (tube.balls.length === 4) {
      const firstBall = tube.balls[0];
      tube.completed = tube.balls.every(ball => ball === firstBall);
    } else {
      tube.completed = false;
    }
  };

  const checkWinCondition = (currentTubes) => {
    return currentTubes.every(tube => {
      if (tube.balls.length === 0) return true;
      if (tube.balls.length !== 4) return false;
      const firstBall = tube.balls[0];
      return tube.balls.every(ball => ball === firstBall);
    });
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    successAnimation.current?.play();
    setTimeout(() => {
      Alert.alert(
        translations[currentLanguage].congratulations,
        translations[currentLanguage].completed,
        [
          {
            text: translations[currentLanguage].playAgain,
            onPress: initializeGame,
          },
        ]
      );
    }, 1500);
  };

  const isValidMove = (fromTube, toTube) => {
    if (fromTube === toTube) return false;
    
    const sourceTube = tubes[fromTube];
    const targetTube = tubes[toTube];
    
    if (sourceTube.balls.length === 0) return false;
    if (targetTube.balls.length >= 4) return false;
    
    if (targetTube.balls.length === 0) return true;
    
    const movingBall = sourceTube.balls[0];
    const targetBall = targetTube.balls[0];
    return movingBall === targetBall;
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      const lastState = moveHistory[moveHistory.length - 1];
      setTubes(lastState.tubes);
      setMoves(moves - 1);
      setMoveHistory(prev => prev.slice(0, -1));
      setSelectedTube(null);
    }
  };

  const findHint = () => {
    for (let fromTube = 0; fromTube < tubes.length; fromTube++) {
      if (tubes[fromTube].balls.length === 0) continue;
      
      const topBall = tubes[fromTube].balls[tubes[fromTube].balls.length - 1];
      
      for (let toTube = 0; toTube < tubes.length; toTube++) {
        if (fromTube === toTube) continue;
        
        if (isValidMove(fromTube, toTube)) {
          return { fromTube, toTube };
        }
      }
    }
    return null;
  };

  const renderHint = () => {
    if (!showHint) return null;
    
    const hint = findHint();
    if (!hint) {
      setShowHint(false);
      return null;
    }

    return (
      <View style={styles.hintOverlay}>
        <View style={[styles.hintArrow, {
          // Add arrow positioning based on tube positions
          position: 'absolute',
          left: tubeRefs.current[hint.fromTube]?.x || 0,
          top: tubeRefs.current[hint.fromTube]?.y || 0,
        }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF79B0', '#B388FF', '#8C9EFF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>
              {translations[currentLanguage].backToActivities}
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {translations[currentLanguage].title}
          </Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>Moves: {moves}</Text>
            <TouchableOpacity 
              style={styles.undoButton}
              onPress={handleUndo}
              disabled={moveHistory.length === 0}>
              <Text style={styles.buttonText}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.hintButton}
              onPress={() => setShowHint(true)}>
              <Text style={styles.buttonText}>Hint</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gameContainer}>
          {gameCompleted && (
            <LottieView
              ref={successAnimation}
              source={require('../../res/success.json')}
              style={styles.successAnimation}
              loop={false} 
            />
          )}
          <View style={styles.tubesContainer}>
            {tubes.map((tube, index) => (
              <TouchableOpacity
                key={tube.id}
                style={[
                  styles.tube,
                  selectedTube === index && styles.selectedTube,
                  tube.completed && styles.completedTube,
                  selectedTube !== null && 
                  selectedTube !== index && 
                  isValidMove(selectedTube, index) && 
                  styles.validTargetTube
                ]}
                onPress={() => handleTubePress(index)}
              >
                {tube.balls.map((colorId, ballIndex) => (
                  <View
                    key={ballIndex}
                    style={[
                      styles.ball,
                      { backgroundColor: COLORS[colorId] }
                    ]}
                  />
                ))}
              </TouchableOpacity>
            ))}
          </View>
          {showHint && renderHint()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default BallSortGame; 