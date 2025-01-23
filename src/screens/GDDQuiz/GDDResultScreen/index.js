import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Linking, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GDDResultScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { patientInfo, totalScore, ageInMonths, developmentalQuotient } = route.params;
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
  }, []);

  // In useEffect
  const setQuizLockTime = async () => {
    const twoMonths = 2 * 30 * 24 * 60 * 60 * 1000;
    const lockEndTime = new Date().getTime() + twoMonths;
    await AsyncStorage.setItem('gddQuizLockTime', lockEndTime.toString());
  };

  const sendEmail = async () => {
    setIsEmailSending(true);
    const toEmail = 'garimabehl1310@gmail.com';
    const subject = isHindi ? 'जी.डी.डी परिणाम' : 'GDD Results';
    const body = `
${isHindi ? 'नाम' : 'Name'}: ${patientInfo.name}
${isHindi ? 'आयु' : 'Age'}: ${patientInfo.age}
${isHindi ? 'कुल अंक' : 'Total Score'}: ${totalScore.toFixed(2)}
${isHindi ? 'आयु (महीने)' : 'Age (Months)'}: ${ageInMonths}
${isHindi ? 'विकास भागफल' : 'Developmental Quotient'}: ${developmentalQuotient.toFixed(2)}`;

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

export default GDDResultScreen; 