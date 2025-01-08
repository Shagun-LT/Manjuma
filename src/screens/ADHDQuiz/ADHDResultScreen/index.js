import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const { width } = Dimensions.get('window');

const ADHDResultScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { 
    patientInfo, 
    adhdType,
  } = route.params;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Set quiz lock time when showing results
    const setQuizLockTime = async () => {
      const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000; // 3 months in milliseconds
      const lockEndTime = new Date().getTime() + threeMonths;
      await AsyncStorage.setItem('adhdQuizLockTime', lockEndTime.toString());
    };
    
    setQuizLockTime();
    // Initial animations
    Animated.sequence([
      // Fade in header
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Slide in card
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulsing animation for type text
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 40,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const onPressHome = () => {
    // Animate out before navigation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('DisorderScreen');
    });
  };

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      style={styles.container}>
      <View style={styles.content}>
        <Animated.Text 
          style={[
            styles.headerText,
            { opacity: fadeAnim }
          ]}>
          {isHindi ? 'आडीएचडी स्क्रीनिंग परिणाम' : 'ADHD Screening Results'}
        </Animated.Text>

        <Animated.View 
          style={[
            styles.resultCard,
            {
              opacity: fadeAnim,
              transform: [
                { translateX: slideAnim },
                { scale: fadeAnim }
              ]
            }
          ]}>
          <Text style={styles.resultText}>
            {isHindi ? 'नाम' : 'Name'}: {patientInfo.name}
          </Text>
          <Text style={styles.resultText}>
            {isHindi ? 'आयु' : 'Age'}: {patientInfo.age}
          </Text>

          <Text style={styles.typeLabel}>
            {isHindi ? 'एडीएचडी प्रकार' : 'ADHD Type'}:
          </Text>
          <Animated.Text 
            style={[
              styles.typeText,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}>
            {isHindi ? (
              adhdType === 'PREDOMINANTLY INATTENTIVE TYPE' ? 'मुख्य रूप से अनवधान प्रकार' :
              adhdType === 'PREDOMINANTLY HYPERACTIVE/IMPULSIVE SUBTYPE' ? 'मुख्य रूप से अतिसक्रिय/आवेगी प्रकार' :
              'संयुक्त प्रकार'
            ) : adhdType}
          </Animated.Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: buttonScale }]
            }
          ]}>
          <TouchableOpacity
            onPress={onPressHome}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={styles.homeButton}>
            <Text style={styles.buttonText}>
              {isHindi ? 'होम पर जाएं' : 'Go to Home'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default ADHDResultScreen; 