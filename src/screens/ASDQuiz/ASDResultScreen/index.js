import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Linking, Share, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ASDResultScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { patientInfo, totalScore } = route.params;
  const [isEmailSending, setIsEmailSending] = useState(false);

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

  // Add new useEffect to trigger email on mount
  useEffect(() => {
    // Small delay to ensure the screen is fully rendered
    const timer = setTimeout(() => {
      sendEmail();
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once when component mounts

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
    const twoMonths = 2 * 30 * 24 * 60 * 60 * 1000;
    const lockEndTime = new Date().getTime() + twoMonths;
    await AsyncStorage.setItem('asdQuizLockTime', lockEndTime.toString());
  };

  const sendEmail = async () => {
    setIsEmailSending(true);
    const toEmail = 'garimabehl1310@gmail.com';
    const subject = isHindi ? 'आई.एस.ए.ए परिणाम' : 'ISAA Results';
    const body = `
${isHindi ? 'नाम' : 'Name'}: ${patientInfo.name}
${isHindi ? 'आयु' : 'Age'}: ${patientInfo.age}
${isHindi ? 'कुल अंक' : 'Total Score'}: ${totalScore}
${isHindi ? 'श्रेणी' : 'Category'}: ${result.category}

${isHindi ? 'अंक श्रेणियां' : 'Score Categories'}:
• <70: ${isHindi ? 'ऑटिज्म नहीं' : 'No Autism'}
• 70-106: ${isHindi ? 'हल्का ऑटिज्म' : 'Mild Autism'}
• 107-153: ${isHindi ? 'मध्यम ऑटिज्म' : 'Moderate Autism'}
• >153: ${isHindi ? 'गंभीर ऑटिज्म' : 'Severe Autism'}`;

    try {
      // Try Gmail first
      const gmailUrl = `gmail://co?to=${toEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const canOpenGmail = await Linking.canOpenURL(gmailUrl);
      
      if (canOpenGmail) {
        await Linking.openURL(gmailUrl);
        setIsEmailSending(false);
        return;
      }

      // Try default mailto as fallback
      const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(mailtoUrl);
      setIsEmailSending(false);

    } catch (error) {
      console.error('Error opening email:', error);
      Alert.alert(
        isHindi ? 'त्रुटि' : 'Error',
        isHindi ? 'ईमेल क्लाइंट नहीं मिला' : 'Email client not found'
      );
      setIsEmailSending(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      {isEmailSending && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>
            {isHindi ? 'ईमेल भेज रहा है...' : 'Sending email...'}
          </Text>
        </View>
      )}
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
            onPress={sendEmail}
            disabled={isEmailSending}>
            <LinearGradient
              colors={['#F472B6', '#C084FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientButton, isEmailSending && styles.disabledButton]}>
              <Text style={styles.buttonText}>
                {isHindi ? 'ईमेल भेजें' : 'Send Email'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setQuizLockTime();
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