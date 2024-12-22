import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Dimensions, Image, Animated, Alert, BackHandler, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';
import Card from './Card';
import Header from './Header';
import IntroScreen from './IntroScreen';
import styles, { cardGradients } from './styles';

// Enable playback in silence mode
Sound.setCategory('Playback');

const LEVELS = {
  1: { 
    grid: 2,
    pairs: 1,
  },
  2: { 
    grid: 2,
    pairs: 2,
  },
  3: { 
    grid: 2,
    pairs: 3,
  },
  4: { 
    grid: 3,
    pairs: 4,
  },
  5: { 
    grid: 3,
    pairs: 6,
  },
  6: { 
    grid: 3,
    pairs: 6,
  },
  7: { 
    grid: 3,
    pairs: 7,
  }
};

const TotalLevel = 7;

// Add card images mapping at the top of the file
const CARD_IMAGES = {
  0: require('../../res/flipcard/card1.png'),
  1: require('../../res/flipcard/card2.png'),
  2: require('../../res/flipcard/card3.png'),
  3: require('../../res/flipcard/card4.png'),
  4: require('../../res/flipcard/card5.png'),
  5: require('../../res/flipcard/card6.png'),
  6: require('../../res/flipcard/card7.png')
};

const FlipCardGame = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [sounds, setSounds] = useState({
    success: null,
    failure: null,
    background: null
  });
  const [crabDirection, setCrabDirection] = useState('right');
  const [crabPosition, setCrabPosition] = useState(0);
  const [beePosition, setBeePosition] = useState(0);
  const [beeDirection, setBeeDirection] = useState('right');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const previewAnimation = React.useRef(new Animated.Value(0)).current;

  // Initialize sounds
  useEffect(() => {
    const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load success sound', error);
        return;
      }
    });

    const failureSound = new Sound('failure.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load failure sound', error);
        return;
      }
    });

    const playBackgroundMusic = () => {
      const backgroundMusic = new Sound('flip_game_bg.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load background music', error);
          return;
        }
        backgroundMusic.setNumberOfLoops(-1);
        backgroundMusic.setVolume(0.3);
        backgroundMusic.play(() => {
          // In case the loop doesn't work on some devices
          backgroundMusic.play();
        });
      });
      return backgroundMusic;
    };

    const backgroundMusic = playBackgroundMusic();

    setSounds({
      success: successSound,
      failure: failureSound,
      background: backgroundMusic
    });

    return () => {
      successSound.release();
      failureSound.release();
      if (backgroundMusic) {
        backgroundMusic.stop();
        backgroundMusic.release();
      }
    };
  }, []);

  // Pause/Resume background music when game completes
  useEffect(() => {
    if (sounds.background) {
      if (isGameComplete) {
        sounds.background.pause();
      } else {
        sounds.background.play();
      }
    }
  }, [isGameComplete]);

  // Initialize cards for current level
  useEffect(() => {
    if (!showIntro && !isGameComplete) {
      const timer = setTimeout(() => {
        initializeCards();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLevel, showIntro, isGameComplete]);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    let animationFrame;
    let lastTimestamp = 0;
    const speed = 3; // Pixels per frame

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (deltaTime >= 16) { // ~60fps
        setCrabPosition(prevPosition => {
          let newPosition = prevPosition;
          
          if (crabDirection === 'right') {
            newPosition = prevPosition + speed;
            if (newPosition >= screenWidth - 120) {
              setCrabDirection('left');
              return screenWidth - 120;
            }
          } else {
            newPosition = prevPosition - speed;
            if (newPosition <= 0) {
              setCrabDirection('right');
              return 0;
            }
          }
          
          return newPosition;
        });
        
        lastTimestamp = timestamp;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [crabDirection]);

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    let animationFrame;
    let lastTimestamp = 0;
    const speed = 2; // Pixels per frame

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (deltaTime >= 16 && showIntro) { // ~60fps, only animate when intro is showing
        setBeePosition(prevPosition => {
          let newPosition = prevPosition;
          
          if (beeDirection === 'right') {
            newPosition = prevPosition + speed;
            if (newPosition >= screenWidth - 180) { // Account for bee width
              setBeeDirection('left');
              return screenWidth - 180;
            }
          } else {
            newPosition = prevPosition - speed;
            if (newPosition <= 0) {
              setBeeDirection('right');
              return 0;
            }
          }
          
          return newPosition;
        });
        
        lastTimestamp = timestamp;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [beeDirection, showIntro]);

  const playSound = (type) => {
    const sound = sounds[type];
    if (sound) {
      sound.stop(() => {
        sound.play((success) => {
          if (!success) {
            console.log('Failed to play sound');
          }
        });
      });
    }
  };

  const startPreviewAnimation = () => {
    // Reset animation value
    previewAnimation.setValue(0);
    
    // Show preview
    setIsPreviewMode(true);
    
    Animated.sequence([
      // Initial delay
      Animated.delay(100),
      // Flip to show cards
      Animated.timing(previewAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      // Hold to show cards
      Animated.delay(500),
      // Flip back
      Animated.timing(previewAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsPreviewMode(false);
    });
  };

  const initializeCards = () => {
    const { pairs } = LEVELS[currentLevel];
    const values = [];
    for (let i = 0; i < pairs; i++) {
      values.push(i, i);
    }
    
    const shuffled = values
      .sort(() => Math.random() - 0.5)
      .map((value) => ({
        value,
        image: CARD_IMAGES[value],
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setIsPreviewMode(false); // Reset preview mode
    previewAnimation.setValue(0); // Reset animation value
    
    // Start preview after a shorter delay
    setTimeout(() => {
      startPreviewAnimation();
    }, 200);
  };

  const handleCardPress = (index) => {
    if (
      flippedIndices.length === 2 || 
      flippedIndices.includes(index) || 
      matchedPairs.includes(cards[index].value) ||
      isPreviewMode
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].value === cards[secondIndex].value) {
        playSound('success');
        const newMatchedPairs = [...matchedPairs, cards[firstIndex].value];
        setMatchedPairs(newMatchedPairs);
        setScore(score + 10);
        setFlippedIndices([]);

        // Check if level is complete
        console.log('Matched pairs:', newMatchedPairs.length, 'Level pairs:', LEVELS[currentLevel].pairs);
        if (newMatchedPairs.length === LEVELS[currentLevel].pairs) {
          if (currentLevel === TotalLevel) { // Update to match your max level
            setIsGameComplete(true);
            if (score > highScore) {
              setHighScore(score);
            }
          } else {
            setShowLevelComplete(true);
            setTimeout(() => {
              const nextLevel = currentLevel + 1;
              setCurrentLevel(nextLevel);
              setShowLevelComplete(false);
              // Remove the card initialization here since it will be triggered by useEffect
            }, 2000);
          }
        }
      } else {
        playSound('failure');
        setScore(Math.max(0, score - 5));
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Move calculations outside renderCard
  const calculateCardDimensions = () => {
    const { grid } = LEVELS[currentLevel];
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    
    const cardsPerRow = grid;
    const totalCards = LEVELS[currentLevel].pairs * 2;
    const rows = Math.ceil(totalCards / cardsPerRow);
    
    const headerHeight = Math.min(screenHeight * 0.12, 80);
    const footerHeight = 120;
    
    const horizontalPadding = 40;
    const verticalPadding = 0;
    const gap = 12;
    
    const availableHeight = screenHeight - headerHeight - footerHeight - (verticalPadding * 2);
    
    const maxCardWidth = (screenWidth - (horizontalPadding * 2) - (gap * (cardsPerRow - 1))) / cardsPerRow;
    const maxCardHeight = (availableHeight - (gap * (rows - 1))) / rows;
    
    const cardSize = Math.min(maxCardWidth, maxCardHeight);
    const startY = headerHeight + verticalPadding;

    return {
      cardSize,
      startY,
      horizontalPadding,
      gap,
      cardsPerRow,
      gradient: cardGradients[currentLevel]
    };
  };

  const getCardPosition = (index, dimensions) => {
    const { cardSize, startY, horizontalPadding, gap, cardsPerRow } = dimensions;
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    
    return {
      left: horizontalPadding + (col * (cardSize + gap)),
      top: startY + (row * (cardSize + gap))
    };
  };

  const renderCard = (card, index) => {
    const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.value);
    const dimensions = calculateCardDimensions();
    const position = getCardPosition(index, dimensions);

    return (
      <Card
        key={index}
        card={card}
        index={index}
        cardSize={dimensions.cardSize}
        position={position}
        isFlipped={isFlipped}
        isPreviewMode={isPreviewMode}
        previewAnimation={previewAnimation}
        gradient={dimensions.gradient}
        onPress={handleCardPress}
      />
    );
  };

  // Add rules content
  const gameRules = [
    "Match pairs of cards to win points",
    "Each correct match: +10 points",
    "Each wrong match: -5 points",
    "Complete all 4 levels to win",
    "Each level adds more pairs to find"
  ];

  const handleStartGameClick = () => {
    console.log('Starting game...');
    setShowIntro(false);
    setScore(0);
    setCurrentLevel(1);
    setMatchedPairs([]);
    setFlippedIndices([]);
    setIsGameComplete(false);
    setShowLevelComplete(false);
    setIsPreviewMode(false);
    setCards([]);    
  };

  // Add back button handler
  useEffect(() => {
    const backAction = () => {
      if (!showIntro) {
        Alert.alert(
          "Exit Game",
          "Are you sure you want to exit the game?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { 
              text: "Exit", 
              onPress: () => {
                // Reset game state
                setShowIntro(true);
                setScore(0);
                setCurrentLevel(1);
                setMatchedPairs([]);
                setFlippedIndices([]);
                setIsGameComplete(false);
                setShowLevelComplete(false);
              }
            }
          ],
          { cancelable: false }
        );
        return true; // Prevent default back action
      }
      return false; // Let default back action happen on intro screen
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [showIntro]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#001F3F', '#034694']}
        style={styles.backgroundGradient}
      />
      <LottieView
        source={require('../../res/clouds.json')}
        autoPlay
        loop
        style={styles.cloudsAnimation1}
        speed={0.3}
      />

      <ImageBackground 
        source={require('../../res/flipcard/bg.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LottieView
          source={require('../../res/clouds.json')}
          autoPlay
          loop
          style={styles.cloudsAnimation2}
          speed={0.3}
        />
        {showIntro ? (
          <IntroScreen 
            onStartGame={handleStartGameClick}
            gameRules={gameRules}
          />
        ) : (
          <>
            <Header
              currentLevel={currentLevel}
              score={score}
              highScore={highScore}
            />

            <View style={styles.mainContent}>
              <View style={styles.cardsWrapper}>
                <View style={styles.cardsGrid}>
                  {cards.map((card, index) => {
                    const dimensions = calculateCardDimensions();
                    const position = getCardPosition(index, dimensions);
                    return (
                      <Card
                        key={index}
                        card={card}
                        index={index}
                        cardSize={dimensions.cardSize}
                        position={position}
                        isFlipped={flippedIndices.includes(index) || matchedPairs.includes(card.value)}
                        isPreviewMode={isPreviewMode}
                        previewAnimation={previewAnimation}
                        gradient={dimensions.gradient}
                        onPress={handleCardPress}
                      />
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={[
                styles.crabContainer,
                { 
                  transform: [
                    { translateX: crabPosition },
                    { scaleX: crabDirection === 'left' ? -1 : 1 }
                  ]
                }
              ]}>
                <LottieView
                  source={require('../../res/crab.json')}
                  autoPlay
                  loop
                  style={styles.crabAnimation}
                />
              </View>
            </View>

            {/* Level Complete Screen */}
            {showLevelComplete && (
              <View style={styles.completeScreen}>
                <View style={styles.completeContent}>
                  <Text style={styles.levelCompleteText}>
                    Level {currentLevel} Complete!
                  </Text>
                  <Text style={styles.levelCompleteScore}>
                    Score: {score}
                  </Text>
                  <Text style={styles.nextLevelText}>
                    Next Level Starting...
                  </Text>
                  <LottieView
                    source={require('../../res/loading.json')}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                  />
                </View>
              </View>
            )}

            {/* Game Complete Screen */}
            {isGameComplete && (
              <View style={styles.gameComplete}>
                <View style={styles.gameCompleteInner}>
                  <LottieView
                    source={require('../../res/confetti.json')}
                    autoPlay
                    loop
                    style={styles.confettiAnimation}
                    speed={0.2}
                  />
                  <LottieView
                    source={require('../../res/trophy.json')}
                    autoPlay
                    loop={false}
                    style={styles.trophyAnimation}
                  />
                  <Text style={styles.gameCompleteText}>
                    Game Complete!
                  </Text>
                  <Text style={styles.finalScoreText}>
                    Final Score: {score}
                  </Text>
                  {score > highScore && (
                    <View style={styles.highScoreContainer}>
                      <Text style={styles.newHighScoreText}>
                        New High Score!
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.playAgainButton}
                    onPress={() => {
                      console.log('Playing again...');
                      setCurrentLevel(1);
                      setScore(0);
                      setMatchedPairs([]);
                      setFlippedIndices([]);
                      setIsGameComplete(false);
                      setShowLevelComplete(false);
                      setIsPreviewMode(false);
                      previewAnimation.setValue(0);
                      setCards([]);
                    }}
                  >
                    <Text style={styles.playAgainText}>Play Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ImageBackground>
    </View>
  );
};

export default FlipCardGame; 