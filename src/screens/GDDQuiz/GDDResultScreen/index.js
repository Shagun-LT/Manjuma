import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GDDResultScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { patientInfo, totalScore, ageInMonths, developmentalQuotient } = route.params;

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

  // In useEffect
  const setQuizLockTime = async () => {
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
    const lockEndTime = new Date().getTime() + threeMonths;
    await AsyncStorage.setItem('gddQuizLockTime', lockEndTime.toString());
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
            {isHindi ? 'परीक्षण परिणाम' : 'Test Results'}
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
              <Text style={styles.value}>{totalScore.toFixed(2)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.label}>{isHindi ? 'आयु (महीने)' : 'Age (Months)'}:</Text>
              <Text style={styles.value}>{ageInMonths}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.label}>
                {isHindi ? 'विकास भागफल' : 'Developmental Quotient'}:
              </Text>
              <Text style={[styles.value, styles.quotient]}>
                {developmentalQuotient.toFixed(2)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>{ 
              setQuizLockTime(); // Also call when finishing  
              navigation.replace('DisorderScreen')
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

export default GDDResultScreen; 