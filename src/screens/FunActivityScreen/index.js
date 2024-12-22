import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import styles from './styles';
import { LanguageContext } from '../../context/LanguageContext';
import { GlobalDevelopmentalDelayData, AutismSpectrumDisorderData, HyperactivityDisorderData, kidsActivityData } from '../../data/parentsActivity';

const translations = {
  en: {
    developmentActivities: 'Development Activities',
    learningThroughPlay: 'Learning through play and guidance will help',
    kidsActivities: 'Play and Learn',
    parentsActivities: 'Parents Based Activities',
    playNow: 'Play Now',
    startQuiz: 'Start Quiz',
    viewDetails: 'View Details',
  },
  hi: {
    developmentActivities: 'विकास गतिविधियां',
    learningThroughPlay: 'खेल और मार्गदर्शन के माध्यम से सीखने में मदद मिलेगी',
    kidsActivities: 'खेलो और सीखो',
    parentsActivities: 'अभिभावक गधारित गतिविधियां',
    playNow: 'अभी खेले',
    startQuiz: 'क्विज़ शुरू करें',
    viewDetails: 'विवरण देखें',
  }
};

const ActivityCard = ({item, onPress, currentLanguage}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}>
      <View 
        style={[
          styles.card,
          {
            backgroundColor: item.cardColor || '#FFFFFF'
          }
        ]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardHeading, {color: item.textColor || '#000000'}]}>
              {item.heading_text[currentLanguage] || item.heading_text}
            </Text>
          </View>
          <Text style={[styles.cardSubheading, {color: item.textColor || '#000000'}]}>
            {item.sub_heading_text[currentLanguage] || item.sub_heading_text}
          </Text>
          <LinearGradient
            colors={item.buttonGradient || ['#FF7EB6', '#FF758C']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.buttonView}>
            <Text style={[styles.buttonTitle, {color: '#FFFFFF'}]}>
              {translations[currentLanguage][item.button_text] || item.button_text}
            </Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ActivitySection = ({data, onActivityPress, currentLanguage, lottieAnimation}) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>
        {translations[currentLanguage][data.header_text] || data.header_text}
      </Text>
      {lottieAnimation && (
        <LottieView
          source={lottieAnimation}
          autoPlay
          loop
          style={styles.headerAnimation}
        />
      )}
    </View>
    {data.cardsData.map((item, index) => (
      <ActivityCard 
        key={`${data.header_text}-${index}`}
        item={item}
        onPress={() => onActivityPress(item.action, item.type, item.details)}
        currentLanguage={currentLanguage}
      />
    ))}
  </View>
);

const Header = ({ currentLanguage }) => (
  <View style={styles.header}>
    <LottieView
      source={require('../../res/play.json')}
      autoPlay
      loop
      style={styles.mainHeaderAnimation}
    />
    <View style={styles.headerTextContainer}>
      <Text style={styles.headingText}>
        {translations[currentLanguage].developmentActivities}
      </Text>
      <Text style={styles.subheadingText}>
        {translations[currentLanguage].learningThroughPlay}
      </Text>
    </View>
  </View>
);

const FunActivityScreen = (props) => {
  const {isHindi} = useContext(LanguageContext);
  const currentLanguage = isHindi ? 'hi' : 'en';
  const navigation = props.navigation;
  const [activityData, setActivityData] = useState({});
  
  useEffect(() =>{
    let finalData = {}
    let selectedDisorderId = props.route.params.disorderId;

    switch (selectedDisorderId) {
      case 1:
        finalData = GlobalDevelopmentalDelayData
        break;
      
      case 2:
        finalData = AutismSpectrumDisorderData
        break;

      case 3:
        finalData = HyperactivityDisorderData  
      default:
        break;
    }    
    setActivityData(finalData);
  }, [])

  const handleActivityPress = (action, type, details) => {
    if (action === 'game_activity') {
      navigation.navigate(type);
    } else if (action === 'parent_activity') {
      navigation.navigate('ActivityDetails', { 
        type,
        details: {
          ...details,
          title: details.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Development`
        }
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <ActivitySection
        data={item}
        onActivityPress={handleActivityPress}
        currentLanguage={currentLanguage}
        lottieAnimation={item.animation}
      />
    );
  };

  const sections = activityData && Object.keys(activityData).length > 0 ? [
    {
      ...kidsActivityData,
      animation: require('../../res/tiger.json'),
    },
    {
      ...activityData.parentsActivityData,
      animation: require('../../res/parent.json'),
    }
  ] : [];

  return (
    <LinearGradient
      colors={['#FF79B0', '#B388FF', '#8C9EFF']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => `section-${index}`}
        showsVerticalScrollIndicator={false}
        bounces={true}
        ListHeaderComponent={<Header currentLanguage={currentLanguage} />}
        contentContainerStyle={styles.scrollView}
      />
    </LinearGradient>
  );
};

export default FunActivityScreen;
