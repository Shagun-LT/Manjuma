import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ASDResultScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { patientInfo, totalScore } = route.params;

  // Prevent going back with hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('DisorderScreen');
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  // Prevent going back with gesture/swipe
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  // Call setQuizLockTime when component mounts
  useEffect(() => {
    setQuizLockTime();
  }, []);

  const getAutismCategory = (score) => {
    if (score < 70) {
      return {
        category: isHindi ? 'ऑटिज्म नहीं' : 'No Autism',
        color: '#4CAF50' // Green
      };
    } else if (score >= 70 && score <= 106) {
      return {
        category: isHindi ? 'हल्का ऑटिज्म' : 'Mild Autism',
        color: '#FFC107' // Yellow
      };
    } else if (score >= 107 && score <= 153) {
      return {
        category: isHindi ? 'मध्यम ऑटिज्म' : 'Moderate Autism',
        color: '#FF9800' // Orange
      };
    } else {
      return {
        category: isHindi ? 'गंभीर ऑटिज्म' : 'Severe Autism',
        color: '#F44336' // Red
      };
    }
  };

  const result = getAutismCategory(totalScore);

  const setQuizLockTime = async () => {
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
    const lockEndTime = new Date().getTime() + threeMonths;
    await AsyncStorage.setItem('asdQuizLockTime', lockEndTime.toString());
  };

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.headerText}>
            {isHindi ? 'आई.एस.ए.ए परिणाम' : 'ISAA Results'}
          </Text>

          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.label}>{isHindi ? 'नाम' : 'Name'}:</Text>
              <Text style={styles.value}>{patientInfo.name}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.label}>{isHindi ? 'आयु' : 'Age'}:</Text>
              <Text style={styles.value}>{patientInfo.age}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.label}>{isHindi ? 'कुल अंक' : 'Total Score'}:</Text>
              <Text style={styles.value}>{totalScore}</Text>
            </View>

            <View style={[styles.categoryContainer, { backgroundColor: result.color + '20' }]}>
              <Text style={styles.categoryLabel}>
                {isHindi ? 'श्रेणी' : 'Category'}:
              </Text>
              <Text style={[styles.categoryValue, { color: result.color }]}>
                {result.category}
              </Text>
            </View>

            <View style={styles.scaleContainer}>
              <Text style={styles.scaleHeader}>
                {isHindi ? 'अंक श्रेणियां' : 'Score Categories'}:
              </Text>
              <Text style={styles.scaleItem}>• {'<70: '} {isHindi ? 'ऑटिज्म नहीं' : 'No Autism'}</Text>
              <Text style={styles.scaleItem}>• 70-106: {isHindi ? 'हल्का ऑटिज्म' : 'Mild Autism'}</Text>
              <Text style={styles.scaleItem}>• 107-153: {isHindi ? 'मध्यम ऑटिज्म' : 'Moderate Autism'}</Text>
              <Text style={styles.scaleItem}>• {'>153: '} {isHindi ? 'गंभीर ऑटिज्म' : 'Severe Autism'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setQuizLockTime(); // Also call when finishing
              navigation.replace('DisorderScreen');
            }}>
            <LinearGradient
              colors={['#F472B6', '#C084FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>
                {isHindi ? 'समाप्त' : 'Finish'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ASDResultScreen; 