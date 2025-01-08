import React, {useRef} from 'react';
import {Text, Animated, TouchableOpacity, View, Dimensions, Easing} from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';

// Add Sparkle component
const Sparkle = ({delay, style}) => {
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(sparkleOpacity, {
              toValue: 0.8,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleScale, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(sparkleOpacity, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleScale, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(300),
        ])
      ).start();
    };

    setTimeout(startAnimation, 1500);
  }, []);

  return (
    <Animated.Text
      style={[
        styles.sparkle,
        style,
        {
          opacity: sparkleOpacity,
          transform: [{scale: sparkleScale}],
        },
      ]}>
      ✨
    </Animated.Text>
  );
};

const AnimatedLetter = ({ letter, index, startAnimation }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const colorProgress = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (startAnimation) {
      // First animate the color draw
      Animated.sequence([
        Animated.timing(colorProgress, {
          toValue: 1,
          duration: 1000,
          delay: index * 200, // Stagger the color animation
          useNativeDriver: false, // Color animations can't use native driver
        }),
        // Then start the bounce animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -10,
              duration: 400,
              delay: index * 100,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ])
        ),
      ]).start();
    }
  }, [startAnimation]);

  const colorInterpolation = colorProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ffffff', '#90EE90', '#E8F5E9']
  });

  return (
    <Animated.Text
      style={[
        styles.letterText,
        {
          color: colorInterpolation,
          transform: [{ translateY }],
        },
      ]}>
      {letter}
    </Animated.Text>
  );
};

const DescriptionScreen = props => {
  const navigation = props.navigation;
  const lottieRef = useRef(null);
  const titleFadeAnim = new Animated.Value(0);
  const descriptionFadeAnim = new Animated.Value(0);
  const titleTranslateY = new Animated.Value(50);
  const titleScale = new Animated.Value(0.5);
  const titlePulseScale = new Animated.Value(1);
  const descriptionTranslateY = new Animated.Value(50);
  const descriptionScale = new Animated.Value(0.8);
  const buttonScale = new Animated.Value(1);
  const [startLetterAnimation, setStartLetterAnimation] = React.useState(false);
  const titleLetters = 'Manjuma'.split('');

  const descriptionText =
    'Manjuma is a comprehensive mental health app designed to provide kids with tools, resources, and support for their psychological well - being.Whether youre looking to manage stress, improve mindfulness, or track your mood, MindBalance offers a variety of features tailored to meet your needs.';

  const startTitlePulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(titlePulseScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(titlePulseScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  };

  const startTextAnimations = () => {
    Animated.stagger(200, [
      // Title animations
      Animated.parallel([
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Description animations
      Animated.parallel([
        Animated.timing(descriptionFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
        }),
        Animated.spring(descriptionTranslateY, {
          toValue: 0,
          tension: 30,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(descriptionScale, {
          toValue: 1,
          tension: 30,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Start letter animations after initial animations
      setStartLetterAnimation(true);
    });
  };

  const onLottieLoaded = () => {
    // Add 2 second delay before starting text animations
    setTimeout(() => {
      startTextAnimations();
    }, 1500);
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    // Don't animate back if we're navigating away
    if (!startLetterAnimation) return;
    
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  function navigateToTaskScreen() {
    Animated.parallel([
      Animated.timing(titleFadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionFadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleScale, {
        toValue: 0.5,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionScale, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('DisorderScreen');
    });
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#2E7D32',
          '#388E3C',
          '#43A047',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require('../../res/splash.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
            resizeMode="cover"
            onLayout={onLottieLoaded}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Sparkle delay={0} style={styles.sparkle1} />
            <Sparkle delay={400} style={styles.sparkle2} />
            <Sparkle delay={800} style={styles.sparkle3} />
            <Sparkle delay={1200} style={styles.sparkle4} />
            
            <Animated.View 
              style={[
                styles.titleRow,
                {
                  opacity: titleFadeAnim,
                  transform: [
                    { translateY: titleTranslateY },
                    { scale: titleScale }
                  ],
                }
              ]}>
              {titleLetters.map((letter, index) => (
                <AnimatedLetter
                  key={index}
                  letter={letter}
                  index={index}
                  startAnimation={startLetterAnimation}
                />
              ))}
            </Animated.View>
          </View>
          
          <Animated.Text 
            style={[
              styles.descriptionText,
              {
                opacity: descriptionFadeAnim,
                transform: [
                  { translateY: descriptionTranslateY },
                  { scale: descriptionScale }
                ],
              }
            ]}>
            {descriptionText}
          </Animated.Text>

          <Animated.View 
            style={[
              {
                opacity: descriptionFadeAnim,
                transform: [{ scale: buttonScale }]
              }
            ]}>
            <TouchableOpacity 
              style={styles.btnStyle}
              onPress={navigateToTaskScreen}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              activeOpacity={0.9}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default DescriptionScreen;
