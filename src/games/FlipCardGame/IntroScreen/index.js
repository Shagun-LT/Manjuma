import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const IntroScreen = ({ onStartGame, gameRules }) => {
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRuleIndex((prev) => (prev + 1) % gameRules.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeRuleIndex]);

  return (
    <View style={styles.introScreen}>
      <LinearGradient
        colors={['#FFC107', '#FF9800']}
        style={styles.backgroundGradient}
      />
      <View style={styles.contentContainer}>
        <View style={styles.introContent}>
          <Text style={styles.introTitle}>Memory Card Game</Text>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>How to Play:</Text>
            {gameRules.map((rule, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.ruleRow,
                  {
                    backgroundColor: activeRuleIndex === index ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                    transform: [{
                      scale: activeRuleIndex === index ? scaleAnim : 1
                    }],
                  }
                ]}
              >
                <Text style={[
                  styles.bulletPoint,
                  activeRuleIndex === index && styles.activeBulletPoint
                ]}>•</Text>
                <Text style={[
                  styles.ruleText,
                  activeRuleIndex === index && styles.activeRuleText
                ]}>{rule}</Text>
              </Animated.View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={onStartGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>

          <View style={styles.beeContainer}>
            <Image 
              source={require('../../../res/flipcard/bee.png')}
              style={styles.beeImage}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default IntroScreen; 