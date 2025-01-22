/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useRef } from 'react';
import {View, Text, TouchableWithoutFeedback, Animated, ScrollView} from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Colors from '../../CustomeStyles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {useLanguage} from '../../context/LanguageContext';

const TestListScreen = props => {
  const params = props.route.params;
  const {navigation} = props;
  const {isHindi} = useLanguage();
  const [quizLocks, setQuizLocks] = useState({});
  const [timeRemaining, setTimeRemaining] = useState({});
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Extract the complex expression to a variable
  const currentDisorderLock = quizLocks[params.disorderId];

  useEffect(() => {
    checkQuizLocks();
    const interval = setInterval(checkQuizLocks, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentDisorderLock) {
      // Start pulsing animation
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

      // Fade in/out animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations when unlocked
      pulseAnim.setValue(1);
      fadeAnim.setValue(1);
    }
  }, [currentDisorderLock, fadeAnim, pulseAnim]);

  const checkQuizLocks = async () => {
    try {
      // Check locks for all quiz types
      const quizTypes = ['gdd', 'asd', 'adhd'];
      const locks = {};
      const times = {};

      for (const type of quizTypes) {
        const lockTime = await AsyncStorage.getItem(`${type}QuizLockTime`);
        if (lockTime) {
          const remainingTime = parseInt(lockTime) - new Date().getTime();
          if (remainingTime > 0) {
            locks[type] = parseInt(lockTime);
            const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
            times[type] = `${days} days`;
          } else {
            await AsyncStorage.removeItem(`${type}QuizLockTime`);
          }
        }
      }

      setQuizLocks(locks);
      setTimeRemaining(times);
    } catch (error) {
      console.error('Error checking quiz locks:', error);
    }
  };

  const navigate = (screen) => {
    const disorderForms = {
      1: 'GDDScreeningForm',
      2: 'ASDScreeningForm',
      3: 'ADHDScreeningForm'
    };

    const quizTypes = {
      1: 'gdd',
      2: 'asd',
      3: 'adhd'
    };

    const quizType = quizTypes[params.disorderId];
    
    if (screen === 'TestScreen' && quizLocks[quizType]) {
      // Quiz is locked
      return;
    }

    if (screen === 'TestScreen' && disorderForms[params.disorderId]) {
      navigation.navigate(disorderForms[params.disorderId], params);
    } else {
      navigation.navigate(screen, params);
    }
  };

  const testData = [
    {
      name: isHindi ? 'प्रश्नोत्तरी' : 'Quiz',
      color: Colors.yellow,
      lottie: require('../../res/quiz2.json'),
      action: 'TestScreen',
      description: isHindi 
        ? 'मजेदार प्रश्नोत्तरी के साथ अपना ज्ञान जांचें'
        : 'Test your knowledge with fun quizzes',
      gradient: ['#FFE0B2', '#FFB74D'],
      textColor: '#E65100',
    },
    {
      name: isHindi ? 'गतिविधियाँ' : 'Activities',
      color: Colors.lightPink,
      lottie: require('../../res/art1.json'),
      action: 'FunActivityScreen',
      description: isHindi
        ? 'रचनात्मक गतिविधियों में भाग लें'
        : 'Engage in creative activities',
      gradient: ['#E1BEE7', '#CE93D8'],
      textColor: '#4A148C',
    },
    {
      name: isHindi ? 'आहार' : 'Diet',
      color: Colors.lightBlue,
      lottie: require('../../res/food1.json'),
      action: 'DietScreen',
      description: isHindi
        ? 'स्वस्थ आहार योजनाओं का पता लगाएं'
        : 'Explore healthy diet plans',
      gradient: ['#B3E5FC', '#81D4FA'],
      textColor: '#01579B',
    },
  ];

  const ItemBox = (test, index) => {
    const quizType = params.disorderId ? {
      1: 'gdd',
      2: 'asd',
      3: 'adhd'
    }[params.disorderId] : null;

    const isQuizLocked = test.action === 'TestScreen' && quizType && quizLocks[quizType];
    const currentTimeRemaining = quizType ? timeRemaining[quizType] : '';

    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => navigate(test.action)}>
        <View style={styles.boxWrapper}>
          <Animated.View
            style={[
              styles.boxContainer,
              isQuizLocked && {
                transform: [{scale: pulseAnim}],
                opacity: fadeAnim,
              },
            ]}>
            <LinearGradient
              colors={test.gradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={[
                styles.boxStyle,
                isQuizLocked && styles.lockedBox
              ]}>
              <LottieView
                source={test.lottie}
                style={{height: 80, width: 80}}
                autoPlay
                loop
              />
              <Text style={[styles.testName, {color: test.textColor}]}>
                {test.name}
              </Text>
              <Text 
                style={[
                  styles.descriptionText, 
                  {color: test.textColor + 'CC'}
                ]}>
                {test.description}
              </Text>
            </LinearGradient>
          </Animated.View>
          
          {isQuizLocked && (
            <View style={styles.lockOverlay}>
              <LottieView
                source={require('../../res/lock.json')}
                style={styles.lockAnimation}
                autoPlay
                loop
              />
              <Text style={styles.lockTimeText}>
                {currentTimeRemaining}
              </Text>
              <Text style={styles.lockDescriptionText}>
                {isHindi 
                  ? 'कृपया प्रतीक्षा करें'
                  : 'Please wait'}
              </Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>
          {isHindi ? 'गतिविधि क्षेत्र' : 'Activity Area'}
        </Text>
        {testData.map((item, index) => {
          return ItemBox(item, index);
        })}
      </ScrollView>
    </LinearGradient>
  );
};

export default TestListScreen;
