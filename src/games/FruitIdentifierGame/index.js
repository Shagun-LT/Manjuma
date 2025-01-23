import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';

const fruits = [
  // Level 1 - Apple
  {
    id: 1,
    name: 'Apple',
    animation: require('../../res/fruits/apple.json'),
    level: 1,
    wrongAnswers: ['Orange', 'Banana'],
    funFact: 'Apples float in water because they are 25% air!'
  },
  // Level 2 - Banana
  {
    id: 2,
    name: 'Banana',
    animation: require('../../res/fruits/banana.json'),
    level: 2,
    wrongAnswers: ['Mango', 'Apple'],
    funFact: 'Bananas are berries, but strawberries are not!'
  },
  // Level 3 - Orange
  {
    id: 3,
    name: 'Orange',
    animation: require('../../res/fruits/orange.json'),
    level: 3,
    wrongAnswers: ['Watermelon', 'Mango'],
    funFact: 'Orange trees can live for up to 100 years!'
  },
  // Level 4 - Mango
  {
    id: 4,
    name: 'Mango',
    animation: require('../../res/fruits/mango.json'),
    level: 4,
    wrongAnswers: ['Orange', 'Apple'],
    funFact: 'Mangoes are known as the "King of Fruits" in many countries!'
  },
  // Level 5 - Watermelon
  {
    id: 5,
    name: 'Watermelon',
    animation: require('../../res/fruits/watermelon.json'),
    level: 5,
    wrongAnswers: ['Mango', 'Orange'],
    funFact: 'Watermelon is 92% water and is both a fruit and a vegetable!'
  }
];

const FEEDBACK_DELAY = 1500;
const QUESTIONS_PER_LEVEL = 3;
const MAX_LEVEL = 5;
const POINTS_PER_CORRECT = 10;

const GameState = {
  INTRO: 'intro',
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'levelComplete',
  LEVEL_FAILED: 'levelFailed',
  GAME_COMPLETE: 'gameComplete'
};

// Update fruit themes to only contain fruit-specific colors
const fruitThemes = {
  Apple: {
    primary: '#FF5252',
    secondary: '#FFEBEE',
  },
  Banana: {
    primary: '#FFD600',
    secondary: '#FFFDE7',
  },
  Orange: {
    primary: '#FF9800',
    secondary: '#FFF3E0',
  },
  Mango: {
    primary: '#FFA726',
    secondary: '#FFF3E0',
  },
  Watermelon: {
    primary: '#66BB6A',
    secondary: '#E8F5E9',
  }
};

// Remove dark theme and simplify theme object
const theme = {
  gradient: ['#FFE0B2', '#FFCC80'], // Warm orange gradient
  background: '#FFFFFF',
  text: '#37474F',          // Dark blue-grey
  textSecondary: '#546E7A', // Medium blue-grey
  card: '#FFFFFF',
  cardBorder: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.15)',
  primary: '#FF9800',       // Orange
  secondary: '#FFA726',     // Deep orange
};

const FruitIdentifierGame = () => {
  const [gameState, setGameState] = useState(GameState.INTRO);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentFruit, setCurrentFruit] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
  
  const scoreScale = useRef(new Animated.Value(1)).current;
  const lottieRef = useRef(null);
  const introLottieRef = useRef(null);
  
  const correctSound = new Sound('correct.mp3', Sound.MAIN_BUNDLE);
  const wrongSound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE);

  const [optionScales] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]);
  const questionScale = useRef(new Animated.Value(1)).current;
  
  const shuffleArray = useCallback((array) => {
    return [...array].sort(() => 0.5 - Math.random());
  }, []);

  const getCurrentLevelFruit = useCallback(() => {
    return fruits.find(fruit => fruit.level === currentLevel);
  }, [currentLevel]);

  const generateQuestion = useCallback(() => {
    const levelFruit = getCurrentLevelFruit();
    
    const allOptions = [
      { id: levelFruit.id, name: levelFruit.name },
      ...levelFruit.wrongAnswers.map((name, index) => ({
        id: `wrong-${index}`,
        name
      }))
    ];
    
    setCurrentFruit(levelFruit);
    setOptions(shuffleArray(allOptions));
    setFeedback('');
    setIsButtonsDisabled(false);
  }, [getCurrentLevelFruit, shuffleArray]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const animateScore = () => {
    Animated.sequence([
      Animated.spring(scoreScale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(scoreScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const bounceQuestion = () => {
    Animated.sequence([
      Animated.spring(questionScale, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(questionScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();
  };

  const animateOption = (index, value) => {
    if (optionScales[index]) {
      Animated.spring(optionScales[index], {
        toValue: value,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAnswer = useCallback((selectedFruit) => {
    if (isButtonsDisabled) return;
    setIsButtonsDisabled(true);
    
    const isCorrect = selectedFruit.id === currentFruit.id;
    
    if (isCorrect) {
      correctSound.play();
      setScore(prevScore => prevScore + POINTS_PER_CORRECT);
      setFeedback('Correct!');
      animateScore();
      lottieRef.current?.play();
      
      if (currentLevel >= MAX_LEVEL) {
        setTimeout(() => setGameState(GameState.GAME_COMPLETE), FEEDBACK_DELAY);
      } else {
        setTimeout(() => setGameState(GameState.LEVEL_COMPLETE), FEEDBACK_DELAY);
      }
    } else {
      wrongSound.play();
      setFeedback('Wrong answer! Try another level.');
      setTimeout(() => {
        setGameState(GameState.LEVEL_FAILED);
      }, FEEDBACK_DELAY);
    }
  }, [currentFruit, currentLevel, isButtonsDisabled, correctSound, wrongSound, animateScore]);

  const renderOption = useCallback(({ fruit, index }) => (
    <Animated.View
      key={fruit.id}
      style={[
        styles.optionWrapper,
        { 
          transform: [{ scale: optionScales[index] || 1 }],
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.optionButton,
          isButtonsDisabled && styles.optionButtonDisabled
        ]}
        onPress={() => handleAnswer(fruit)}
        disabled={isButtonsDisabled}
        onPressIn={() => animateOption(index, 0.95)}
        onPressOut={() => animateOption(index, 1)}
      >
        <Text style={[
          styles.optionText,
          isButtonsDisabled && styles.optionTextDisabled
        ]}>
          {fruit.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  ), [handleAnswer, isButtonsDisabled, optionScales, animateOption]);

  const startNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setQuestionsAnswered(0);
    setGameState(GameState.PLAYING);
    setIsButtonsDisabled(false);
    setFeedback('');
    generateQuestion();
  };

  const restartGame = () => {
    setCurrentLevel(1);
    setQuestionsAnswered(0);
    setScore(0);
    setGameState(GameState.PLAYING);
    setIsButtonsDisabled(false);
    setFeedback('');
    generateQuestion();
  };

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const levelInfoOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const animateIntroElements = useCallback(() => {
    Animated.stagger(200, [
      Animated.spring(titleOpacity, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(subtitleOpacity, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(levelInfoOpacity, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(buttonOpacity, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderIntroScreen = () => (
    <View style={[
      styles.centerScreen,
      { backgroundColor: theme.background }
    ]}>
      <Animated.Text 
        style={[
          styles.title, 
          { 
            color: theme.text,
            opacity: titleOpacity,
            transform: [{
              translateY: titleOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        Welcome to Fruit Identifier!
      </Animated.Text>
      
      <Animated.View
        style={{
          opacity: subtitleOpacity,
          transform: [{
            translateY: subtitleOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }}
      >
        <LottieView
          ref={introLottieRef}
          source={require('../../res/fruits.json')}
          style={styles.introAnimation}
          autoPlay
          loop
          speed={0.7}
        />
      </Animated.View>
      
      <Animated.Text 
        style={[
          styles.subtitle, 
          { 
            color: theme.textSecondary,
            opacity: subtitleOpacity,
            transform: [{
              translateY: subtitleOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        Master one fruit at a time!
      </Animated.Text>
      
      <Animated.View 
        style={[
          styles.levelInfo,
          {
            backgroundColor: theme.card,
            borderColor: theme.primary,
            opacity: levelInfoOpacity,
            transform: [{
              translateY: levelInfoOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        <Text style={[styles.levelInfoText, { color: theme.primary }]}>
          Level 1: Learn about Apples
        </Text>
        <Text style={[styles.levelInfoText, { color: theme.primary }]}>
          Level 2: Master Bananas
        </Text>
        <Text style={[styles.levelInfoText, { color: theme.primary }]}>
          Level 3: Discover Oranges
        </Text>
        <Text style={[styles.levelInfoText, { color: theme.primary }]}>
          Level 4: Meet Mangoes
        </Text>
        <Text style={[styles.levelInfoText, { color: theme.primary }]}>
          Level 5: Find Watermelons
        </Text>
      </Animated.View>
      
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{
            translateY: buttonOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }}
      >
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: theme.primary }
          ]}
          onPress={() => {
            setGameState(GameState.PLAYING);
            generateQuestion();
          }}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  useEffect(() => {
    if (gameState === GameState.INTRO) {
      animateIntroElements();
    }
  }, [gameState, animateIntroElements]);

  const levelCompleteScale = useRef(new Animated.Value(0)).current;
  const levelCompleteFade = useRef(new Animated.Value(0)).current;

  const animateLevelComplete = useCallback(() => {
    Animated.parallel([
      Animated.spring(levelCompleteScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(levelCompleteFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (gameState === GameState.LEVEL_COMPLETE) {
      animateLevelComplete();
    }
  }, [gameState, animateLevelComplete]);

  const renderLevelComplete = () => {
    const nextFruit = currentLevel < MAX_LEVEL ? 
      fruits.find(f => f.level === currentLevel + 1).name.toLowerCase() : 
      '';
    const currentFruit = getCurrentLevelFruit();
    const fruitTheme = fruitThemes[currentFruit.name];

    return (
      <LinearGradient
        colors={[fruitTheme.secondary, theme.background]}
        style={styles.centerScreen}
      >
        <Animated.View style={[
          styles.levelCompleteContainer,
          {
            opacity: levelCompleteFade,
            transform: [{
              scale: levelCompleteScale
            }]
          }
        ]}>
          <LottieView
            source={require('../../res/success.json')}
            style={styles.successAnimation}
            autoPlay
            loop={false}
            speed={0.7}
          />
          
          <Text style={[
            styles.levelCompleteTitle,
            { color: fruitTheme.primary }
          ]}>
            Level {currentLevel} Complete!
          </Text>
          
          <Text style={[
            styles.levelCompleteSubtitle,
            { color: theme.textSecondary }
          ]}>
            {currentLevel < MAX_LEVEL ? 
              `Great job with ${currentFruit.name}s!\nReady to learn about ${nextFruit}s?` :
              "You've mastered all the fruits!"}
          </Text>

          <View style={[
            styles.funFactContainer,
            {
              backgroundColor: theme.card,
              borderColor: fruitTheme.primary,
            }
          ]}>
            <Text style={[
              styles.funFactTitle,
              { color: fruitTheme.primary }
            ]}>
              Fun Fact
            </Text>
            <Text style={[
              styles.funFactText,
              { color: theme.text }
            ]}>
              {currentFruit.funFact}
            </Text>
          </View>

          <Animated.Text 
            style={[
              styles.levelCompleteScore,
              {
                color: fruitTheme.primary,
                transform: [{
                  scale: scoreScale
                }]
              }
            ]}
          >
            Score: {score}
          </Animated.Text>

          <TouchableOpacity 
            style={[
              styles.button,
              { backgroundColor: fruitTheme.primary }
            ]}
            onPress={startNextLevel}
          >
            <Text style={styles.buttonText}>
              {currentLevel < MAX_LEVEL ? "Next Fruit" : "Finish Game"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  };

  const renderLevelFailed = () => {
    const currentFruit = getCurrentLevelFruit();
    return (
      <View style={styles.centerScreen}>
        <Text style={[styles.title, { color: '#F44336' }]}>Level Failed!</Text>
        <Text style={styles.subtitle}>
          The correct answer was {currentFruit.name}.
          {'\n\n'}
          Don't worry! Practice makes perfect.
        </Text>
        <View style={styles.funFactContainer}>
          <Text style={styles.funFactTitle}>Did you know?</Text>
          <Text style={styles.funFactText}>{currentFruit.funFact}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.retryButton]}
            onPress={() => {
              setCurrentLevel(1);
              setScore(0);
              setGameState(GameState.PLAYING);
              setIsButtonsDisabled(false);
              setFeedback('');
              generateQuestion();
            }}
          >
            <Text style={styles.buttonText}>Start Over</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]}
            onPress={() => {
              setCurrentLevel(prev => prev + 1);
              setGameState(GameState.PLAYING);
              setIsButtonsDisabled(false);
              setFeedback('');
              generateQuestion();
            }}
          >
            <Text style={styles.buttonText}>Try Next Fruit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const gameCompleteScale = useRef(new Animated.Value(0)).current;
  const gameCompleteFade = useRef(new Animated.Value(0)).current;

  const animateGameComplete = useCallback(() => {
    Animated.parallel([
      Animated.spring(gameCompleteScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(gameCompleteFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (gameState === GameState.GAME_COMPLETE) {
      animateGameComplete();
    }
  }, [gameState, animateGameComplete]);

  const renderGameComplete = () => {
    const finalFruit = getCurrentLevelFruit();
    const fruitTheme = fruitThemes[finalFruit.name];

    return (
      <LinearGradient
        colors={[fruitTheme.secondary, theme.background]}
        style={styles.centerScreen}
      >
        <Animated.View style={[
          styles.gameCompleteContainer,
          {
            opacity: gameCompleteFade,
            transform: [{
              scale: gameCompleteScale
            }]
          }
        ]}>
          <LottieView
            source={require('../../res/trophy.json')}
            style={styles.celebrationAnimation}
            autoPlay
            loop
            speed={0.7}
          />

          <Text style={[
            styles.gameCompleteTitle,
            { color: fruitTheme.primary }
          ]}>
            Congratulations!
          </Text>

          <Text style={[
            styles.gameCompleteSubtitle,
            { color: theme.textSecondary }
          ]}>
            You've mastered all the fruits!{'\n'}You're a fruit expert now!
          </Text>

          <View style={[
            styles.statsContainer,
            {
              backgroundColor: theme.card,
              borderColor: fruitTheme.primary,
            }
          ]}>
            <Animated.Text 
              style={[
                styles.finalScore,
                {
                  color: fruitTheme.primary,
                  transform: [{
                    scale: scoreScale
                  }]
                }
              ]}
            >
              Final Score: {score}
            </Animated.Text>
            
            <Text style={[
              styles.statsText,
              { color: theme.text }
            ]}>
              You've learned about 5 different fruits{'\n'}and their unique characteristics!
            </Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.button,
              { backgroundColor: fruitTheme.primary }
            ]}
            onPress={restartGame}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  };

  const backgroundMusicRef = useRef(null);

  useEffect(() => {
    // Initialize background music
    backgroundMusicRef.current = new Sound('flip_game_bg.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load background music', error);
        return;
      }
      
      // Configure the sound
      backgroundMusicRef.current.setNumberOfLoops(-1);
      backgroundMusicRef.current.setVolume(0.3);
    });

    // Cleanup
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.release();
      }
    };
  }, []);

  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop();
      backgroundMusicRef.current.play((success) => {
        if (!success) {
          console.log('Background music playback failed');
        }
      });
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (gameState !== GameState.INTRO) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [gameState, playBackgroundMusic, stopBackgroundMusic]);

  if (gameState === GameState.INTRO) return renderIntroScreen();
  if (gameState === GameState.LEVEL_COMPLETE) return renderLevelComplete();
  if (gameState === GameState.LEVEL_FAILED) return renderLevelFailed();
  if (gameState === GameState.GAME_COMPLETE) return renderGameComplete();

  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
    >
      <View style={[
        styles.header,
        { 
          backgroundColor: theme.card,
          borderBottomColor: fruitThemes[currentFruit?.name || 'Apple'].primary,
          borderBottomWidth: 2,
        }
      ]}>
        <Text style={[styles.levelText, { color: theme.text }]}>
          Level {currentLevel}: {getCurrentLevelFruit()?.name}
        </Text>
        <Animated.Text 
          style={[
            styles.scoreText,
            { 
              transform: [{ scale: scoreScale }],
              color: theme.text,
            }
          ]}
        >
          Score: {score}
        </Animated.Text>
      </View>
      
      {currentFruit && (
        <Animated.View 
          style={[
            styles.questionContainer,
            { 
              transform: [{ scale: questionScale }],
              backgroundColor: theme.card,
              borderColor: fruitThemes[currentFruit.name].primary,
            }
          ]}
        >
          <LottieView
            ref={lottieRef}
            source={currentFruit.animation}
            style={styles.fruitAnimation}
            autoPlay
            loop
            speed={0.7}
            onLayout={() => bounceQuestion()}
          />
          <Text style={[
            styles.question,
            { color: theme.text }
          ]}>
            What fruit is this?
          </Text>
        </Animated.View>
      )}

      <View style={styles.optionsContainer}>
        {options.map((fruit, index) => (
          <Animated.View
            key={fruit.id}
            style={[
              styles.optionWrapper,
              { transform: [{ scale: optionScales[index] || 1 }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: theme.card,
                  borderColor: fruitThemes[currentFruit?.name || 'Apple'].primary,
                  shadowColor: theme.shadow,
                },
                isButtonsDisabled && styles.optionButtonDisabled
              ]}
              onPress={() => handleAnswer(fruit)}
              disabled={isButtonsDisabled}
              onPressIn={() => animateOption(index, 0.95)}
              onPressOut={() => animateOption(index, 1)}
            >
              <Text style={[
                styles.optionText,
                { color: theme.text },
                isButtonsDisabled && styles.optionTextDisabled
              ]}>
                {fruit.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {feedback && (
        <View style={styles.feedbackContainer}>
          <LottieView
            source={
              feedback === 'Correct!'
                ? require('../../res/fruits/success.json')
                : require('../../res/fruits/error.json')
            }
            style={styles.feedbackAnimation}
            autoPlay
            loop
            speed={0.8}
          />
          <Animated.Text 
            style={[
              styles.feedbackText,
              { 
                color: feedback === 'Correct!' ? '#4CAF50' : '#F44336',
                transform: [{ scale: scoreScale }]
              }
            ]}
          >
            {feedback}
          </Animated.Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 14,
    borderRadius: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
    marginTop: 30,
  },
  fruitAnimation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.primary,
    elevation: 2,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
  },
  optionText: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: '600',
  },
  optionButtonDisabled: {
    opacity: 0.7,
  },
  optionTextDisabled: {
    opacity: 0.7,
  },
  feedbackAnimation: {
    width: 150,
    height: 150,
    position: 'absolute',
    bottom: 20,
  },
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  progress: {
    fontSize: 18,
    color: '#666',
  },
  levelInfo: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    borderWidth: 1,
  },
  levelInfoText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#EF5350', // Slightly softer red
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: '#66BB6A', // Slightly softer green
    marginLeft: 10,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  funFactContainer: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: '100%',
    borderWidth: 1,
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  funFactText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  introAnimation: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  levelCompleteContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  levelCompleteTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  levelCompleteSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  levelCompleteScore: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  successAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  gameCompleteContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
  },
  gameCompleteTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gameCompleteSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
  },
  celebrationAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  statsContainer: {
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    width: '100%',
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 50,
  },
  finalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FruitIdentifierGame; 