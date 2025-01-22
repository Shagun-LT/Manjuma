/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useLanguage} from '../../context/LanguageContext';
import styles from './styles';
import {quiz1} from '../../data/test1data';
import {quiz2} from '../../data/test2data';
import {quiz3} from '../../data/test3data';

const DisordersScreen = ({navigation}) => {
  const {isHindi} = useLanguage();

  const testData = [
    {
      name: isHindi ? 'वैश्विक विकासात्मक देरी' : 'Global Developmental Delay',
      color: '#FEF08A',
      secondaryColor: '#FDE047',
      lottie: require('../../res/brain2.json'),
      disorderId: 1,
      data: quiz1,
      textColor: '#6B7280',
    },
    {
      name: isHindi ? 'ऑटिज्म स्पेक्ट्रम विकार' : 'Autism Spectrum Disorder',
      color: '#FDA4AF',
      secondaryColor: '#FB7185',
      lottie: require('../../res/brain3.json'),
      disorderId: 2,
      data: quiz2,
      textColor: '#7F1D1D',
    },
    {
      name: isHindi 
        ? 'ध्यान की कमी/अतिसक्रियता विकार' 
        : 'Attention Deficit/Hyperactivity Disorder',
      color: '#93C5FD',
      secondaryColor: '#60A5FA',
      lottie: require('../../res/brain.json'),
      disorderId: 3,
      data: quiz3,
      textColor: '#1E3A8A',
    },
  ];

  const renderDisorderCard = (test, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={1}
      onPress={() =>
        navigation.navigate('TestListScreen', {
          disorderId: test.disorderId,
          disorderName: test.name,
          data: test.data,
        })
      }>
      <LinearGradient
        colors={[test.color, test.secondaryColor]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.boxStyle}>
        <LottieView
          source={test.lottie}
          style={{height: 100, width: 100}}
          autoPlay
          loop
        />
        <Text style={[styles.testName, {color: test.textColor}]}>{test.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <Text style={styles.headingText}>
        {isHindi ? 'विकार' : 'Disorders'}
      </Text>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {testData.map(renderDisorderCard)}
      </ScrollView>
    </LinearGradient>
  );
};

export default DisordersScreen;
