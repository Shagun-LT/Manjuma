import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';

const ADHDScreeningForm = ({ navigation, route }) => {
  const { isHindi } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    place: '',
    contactNumber: '',
  });

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { label: isHindi ? 'पुरुष' : 'Male', value: 'male' },
    { label: isHindi ? 'महिला' : 'Female', value: 'female' },
    { label: isHindi ? 'अन्य' : 'Others', value: 'others' },
  ];

  const validateAge = (age) => {
    // Check for valid formats: "5 years 3 months", "5 years", "3 months", or just numbers
    const yearMonthPattern = /^(\d+)\s*years?\s*(\d+)\s*months?$/i;
    const yearPattern = /^(\d+)\s*years?$/i;
    const monthPattern = /^(\d+)\s*months?$/i;
    const numberPattern = /^\d+$/;

    if (yearMonthPattern.test(age) || yearPattern.test(age) || 
        monthPattern.test(age) || numberPattern.test(age)) {
      return true;
    }
    return false;
  };

  const formatAge = (age) => {
    // Remove extra spaces and convert to lowercase
    const cleanAge = age.toLowerCase().trim();

    // If it's just a number, assume it's months
    if (/^\d+$/.test(cleanAge)) {
      return `${cleanAge} months`;
    }

    // If it's already in a valid format, return as is
    if (validateAge(cleanAge)) {
      return cleanAge;
    }

    return age;
  };

  const handleAgeChange = (text) => {
    setFormData({ ...formData, age: text });
    if (errors.age) setErrors({ ...errors, age: '' });
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.name) newErrors.name = '*';
    if (!formData.age) {
      newErrors.age = '*';
    } else if (!validateAge(formData.age)) {
      newErrors.age = 'Invalid format';
    }
    if (!formData.gender) newErrors.gender = '*';
    if (!formData.place) newErrors.place = '*';
    if (!formData.contactNumber) newErrors.contactNumber = '*';

    if (formData.contactNumber && formData.contactNumber.length < 10) {
      newErrors.contactNumber = isHindi ? 'कृपया 10 अंकों का नंबर दर्ज करें' : 'Please enter a 10-digit number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigation.navigate('ADHDQuizScreen', {
        ...route.params,
        patientInfo: {
          ...formData,
          age: formatAge(formData.age),
        },
      });
    }
  };

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formWrapper}>
          <Text style={styles.headerText}>
            {isHindi 
              ? 'ध्यान की कमी/अतिसक्रियता विकार (एडीएचडी)'
              : 'Attention Deficit/Hyperactivity Disorder (ADHD)'}
          </Text>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              {isHindi 
                ? 'वैंडरबिल्ट एडीएचडी डायग्नोस्टिक पैरेंट रेटिंग स्केल (वीएडीपीआरएस)'
                : 'VANDERBILT ADHD DIAGNOSTIC PARENT RATING SCALE (VADPRS)'}
            </Text>
                        
            <Text style={styles.instructionsHeader}>
              {isHindi ? 'निर्देश:' : 'Instructions:'}
            </Text>
            
            <View style={styles.bulletPoints}>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  {isHindi
                    ? 'प्रत्येक रेटिंग को आपके बच्चे की उम्र के लिए उपयुक्त संदर्भ में माना जाना चाहिए।'
                    : 'Each rating should be considered in the context of what is appropriate for the age of your child.'}
                </Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  {isHindi
                    ? '0 = कभी नहीं; 1 = कभी-कभी; 2 = अक्सर; 3 = बहुत अक्सर'
                    : '0 = Never; 1 = Occasionally; 2 = Often; 3 = Very Often'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isHindi ? 'नाम' : 'Name'} 
                <Text style={styles.required}>{errors.name ? ' *' : ' *'}</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder={isHindi ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isHindi ? 'आयु' : 'Age'}
                <Text style={styles.required}>{errors.age ? ' *' : ' *'}</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                value={formData.age}
                onChangeText={handleAgeChange}
                placeholder={isHindi 
                  ? 'उदाहरण: 5 years 3 months' 
                  : 'Example: 5 years 3 months'}
                placeholderTextColor="#9CA3AF"
              />
              {errors.age && errors.age !== '*' && (
                <Text style={styles.errorText}>
                  {isHindi 
                    ? 'सही प्रारूप: "X years Y months", "X years", या "Y months"'
                    : 'Valid format: "X years Y months", "X years", or "Y months"'}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isHindi ? 'लिंग' : 'Gender'}
                <Text style={styles.required}>{errors.gender ? ' *' : ' *'}</Text>
              </Text>
              <View style={styles.radioGroup}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioOption}
                    onPress={() => {
                      setFormData({ ...formData, gender: option.value });
                      if (errors.gender) setErrors({ ...errors, gender: '' });
                    }}>
                    <View style={styles.radio}>
                      {formData.gender === option.value && <View style={styles.radioSelected} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isHindi ? 'स्थान' : 'Place'}
                <Text style={styles.required}>{errors.place ? ' *' : ' *'}</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.place && styles.inputError]}
                value={formData.place}
                onChangeText={(text) => {
                  setFormData({ ...formData, place: text });
                  if (errors.place) setErrors({ ...errors, place: '' });
                }}
                placeholder={isHindi ? 'स्थान दर्ज करें' : 'Enter place'}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isHindi ? 'संपर्क नंबर' : 'Contact Number'}
                <Text style={styles.required}>{errors.contactNumber ? ' *' : ' *'}</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.contactNumber && styles.inputError]}
                value={formData.contactNumber}
                maxLength={10}
                onChangeText={(text) => {
                  setFormData({ ...formData, contactNumber: text });

                  // Validation for 10-digit contact number
                  if (text.length < 10) {
                    setErrors({ ...errors, contactNumber: isHindi ? 'कृपया 10 अंकों का नंबर दर्ज करें' : 'Please enter a 10-digit number' });
                  }
                  if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                }}
                placeholder={isHindi ? 'संपर्क नंबर दर्ज करें' : 'Enter contact number'}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmit}>
            <LinearGradient
              colors={['#F472B6', '#C084FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>{isHindi ? 'आगे बढ़ें' : 'Next'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ADHDScreeningForm; 