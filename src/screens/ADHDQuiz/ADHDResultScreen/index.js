import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Linking, Alert, ActivityIndicator } from 'react-native';
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
  const [isEmailSending, setIsEmailSending] = useState(false);

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
  }, [fadeAnim, slideAnim]);

  // Add new useEffect to trigger email on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      sendEmail();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sendEmail = async () => {
    setIsEmailSending(true);
    const subject = isHindi ? 'एडीएचडी परिणाम' : 'ADHD Results';
    const translatedType = isHindi ? (
      adhdType === 'PREDOMINANTLY INATTENTIVE TYPE' ? 'मुख्य रूप से अनवधान प्रकार' :
      adhdType === 'PREDOMINANTLY HYPERACTIVE/IMPULSIVE SUBTYPE' ? 'मुख्य रूप से अतिसक्रिय/आवेगी प्रकार' :
      'संयुक्त प्रकार'
    ) : adhdType;

    const body = `
${isHindi ? 'नाम' : 'Name'}: ${patientInfo.name}
${isHindi ? 'आयु' : 'Age'}: ${patientInfo.age}
${isHindi ? 'एडीएचडी प्रकार' : 'ADHD Type'}: ${translatedType}`;

    try {
      // Try Gmail first
      const gmailUrl = `gmail://co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const canOpenGmail = await Linking.canOpenURL(gmailUrl);
      
      if (canOpenGmail) {
        await Linking.openURL(gmailUrl);
        setIsEmailSending(false);
        return;
      }

      // Try default mailto as fallback
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      {isEmailSending && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>
            {isHindi ? 'ईमेल भेज रहा है...' : 'Sending email...'}
          </Text>
        </View>
      )}
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
            onPress={sendEmail}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={isEmailSending}
            style={[styles.homeButton, styles.emailButton]}>
            <Text style={styles.buttonText}>
              {isHindi ? 'ईमेल भेजें' : 'Send Email'}
            </Text>
          </TouchableOpacity>

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