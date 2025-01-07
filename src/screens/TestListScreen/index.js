/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, Text, TouchableWithoutFeedback, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './styles';
import Colors from '../../CustomeStyles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {useLanguage} from '../../context/LanguageContext';

const TestListScreen = props => {
  const params = props.route.params;
  const {navigation} = props;
  const {isHindi} = useLanguage();

  const navigate = (screen) => {
    const disorderForms = {
      1: 'GDDScreeningForm',
      2: 'ASDScreeningForm',
      3: 'ADHDScreeningForm'
    };

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

  const ItemBox = (test, index) => (
    <TouchableWithoutFeedback
      key={index}
      onPress={() => navigate(test.action)}>
      <LinearGradient
        colors={test.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.boxStyle]}>
        <LottieView
          source={test.lottie}
          style={{height: 80, width: 80}}
          autoPlay
          loop
        />
        <Text style={[styles.testName, {color: test.textColor}]}>{test.name}</Text>
        <Text style={[styles.descriptionText, {color: test.textColor + 'CC'}]}>
          {test.description}
        </Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <Text style={styles.headingText}>
        {isHindi ? 'गतिविधि क्षेत्र' : 'Activity Area'}
      </Text>
      {testData.map((item, index) => {
        return ItemBox(item, index);
      })}
    </LinearGradient>
  );
};

export default TestListScreen;
