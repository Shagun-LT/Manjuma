import React, {useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {useLanguage} from '../../context/LanguageContext';
import LottieView from 'lottie-react-native';
import styles from './styles';

const FloatingAnimation = ({source, style}) => {
  const animationRef = useRef(null);

  React.useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <LottieView
      ref={animationRef}
      source={source}
      autoPlay={true}
      loop={true}
      speed={0.8}
      style={[styles.floatingAnimation, style]}
      renderMode="SOFTWARE"
    />
  );
};

const lottieIcons = {
  banana: require('../../res/banana.json'),
  chicken: require('../../res/chicken.json'),
  fish: require('../../res/fish.json'),
  fruits: require('../../res/fruits.json'),
  orange: require('../../res/orange.json'),
  avoidFood: require('../../res/avoidFood.json'),
  diet: require('../../res/diet.json'),
};

const DietScreen = props => {
  const cardRefs = useRef([]);
  const {isHindi} = useLanguage();

  const dietPlans = {
    en: [
      {
        title: 'Zinc',
        description: 'Helps to produce dopamine, serotonin and melatonin which helps to reduce inattention and hyperactivity.',
        tips: [
          'Chicken',
          'Legumes',
          'Yogurt'
        ],
        timeOfDay: 'Daily Essential',
        lottieIcon: lottieIcons.chicken,
      },
      {
        title: 'Iron',
        description: 'Produces dopamine and plays an important factor in controlling symptoms of ADHD.',
        tips: [
          'Red meat',
          'Turkey and chicken',
          'Shellfish',
          'Beans and lentils'
        ],
        timeOfDay: 'Daily Essential',
        lottieIcon: lottieIcons.chicken
      },
      {
        title: 'Magnesium',
        description: 'Creates neurotransmitters involved in executive functions such as attention.',
        tips: [
          'Leafy green cereals',
          'Nuts',
          'Fish'
        ],
        timeOfDay: 'Daily Essential',
        lottieIcon: lottieIcons.fish
      },
      {
        title: 'Vitamin B',
        description: 'Essential for proper metabolism and brain function.',
        tips: [
          'Chicken and turkey',
          'Tuna and brown rice',
          'Cheese and sunflower seeds',
          'Carrots'
        ],
        timeOfDay: 'Daily',
        lottieIcon: lottieIcons.chicken
      },
      {
        title: 'Omega-3',
        description: 'Necessary for normal brain function, improves attention duration and reduces hyperactivity.',
        tips: [
          'Walnuts and flaxseeds',
          'Chia seeds',
          'Fish',
          'Leafy greens'
        ],
        timeOfDay: 'Daily',
        lottieIcon: lottieIcons.fish
      },
      {
        title: 'Gluten-free Diet',
        description: 'Helps reduce gastrointestinal inflammation.',
        tips: [
          'Fruits and vegetables',
          'Beans, seeds, and legumes',
          'Nuts and eggs',
          'Low-fat dairy products'
        ],
        timeOfDay: 'Daily',
        lottieIcon: lottieIcons.fruits
      },
      {
        title: 'Probiotics & Gut Health',
        description: 'Improves immune function, produces vitamins and aids in nutrient absorption.',
        tips: [
          'Yogurt',
          'Bananas',
          'Onions',
          'Garlic'
        ],
        timeOfDay: 'Daily',
        lottieIcon: lottieIcons.banana
      },
      {
        title: 'Antioxidants',
        description: 'Protects brain health and supports overall cognitive function.',
        tips: [
          'Oranges, grapes, kiwi',
          'Watermelon',
          'Spinach',
          'Almonds and olive oil'
        ],
        timeOfDay: 'Daily',
        lottieIcon: lottieIcons.orange
      },
      {
        title: 'Foods to Avoid',
        description: 'These foods can worsen ADHD symptoms and should be limited or avoided.',
        tips: [
          'High sugar foods (increases inattention)',
          'Artificial colors and additives',
          'Fast food and processed snacks',
          'Ready-made meals',
          'Sodas and artificial beverages'
        ],
        timeOfDay: 'Avoid',
        isWarning: true,
        lottieIcon: lottieIcons.avoidFood
      },
    ],
    hi: [
      {
        title: 'आवश्यक खनिज',
        description: 'ADHD के लक्षणों को कम करने में मदद करने वाले प्रमुख खनिज',
        tips: [
          'जिंक: चिकन, दालें, दही',
          'आयरन: लाल मांस, टर्की, शेलफिश, फलियां',
          'मैग्नीशियम: हरी पत्तेदार सब्जियां, मेवे, मछली, अनाज',
        ],
        timeOfDay: 'दैनिक आवश्यक',
        lottieIcon: lottieIcons.chicken 
      },
      {
        title: 'दिमाग को बढ़ावा देने वाले खाद्य पदार्थ',
        description: 'संज्ञानात्मक कार्य और ध्यान बढ़ाने वाले खाद्य पदार्थ',
        tips: [
          'ओमेगा-3: अखरोट, अलसी, चिया बीज, मछली',
          'विटामिन बी: चिकन, टर्की, टूना, भूरा चावल',
          'विटामिन बी: पनीर, सूरजमुखी के बीज, गाजर',
        ],
        timeOfDay: 'सभी भोजन',
        lottieIcon: lottieIcons.fish
      },
      {
        title: 'प्रोटीन युक्त खाद्य पदार्थ',
        description: 'प्रोटीन न्यूरोट्रांसमीटर उत्पादन में मदद करते हैं',
        tips: [
          'दुबला मांस: चिकन, टर्की, लाल मांस',
          'समुद्री भोजन: टूना, शेलफिश',
          'पौधे प्रोटीन: दाल, फलियां, दलहन',
        ],
        timeOfDay: 'मुख्य भोजन',
        lottieIcon: lottieIcons.chicken
      },
      {
        title: 'पाचन स्वास्थ्य खाद्य पदार्थ',
        description:
          'पाचन और मानसिक स्वास्थ्य का समर्थन करने वाले खाद्य पदार्थ',
        tips: [
          'प्रोबायोटिक्स: दही, केला',
          'प्रीबायोटिक्स: प्याज, लहसुन',
          'ग्लूटेन मुक्त विकल्प',
        ],
        timeOfDay: 'दैनिक',
        lottieIcon: lottieIcons.banana
      },
      {
        title: 'एंटीऑक्सीडेंट युक्त खाद्य पदार्थ',
        description: 'मस्तिष्क स्वास्थ्य की रक्षा करने वले खाद्य पदार्थ',
        tips: [
          'फल: संतरा, अंगूर, कीवी, तरबूज',
          'सब्जियां: पालक',
          'स्वस्थ वसा: बादाम, जैतून का तेल',
        ],
        timeOfDay: 'दैनिक',
        lottieIcon: lottieIcons.orange
      },
      {
        title: 'परहेज करने योग्य खाद्य पदार्थ',
        description: 'ADHD के लक्षणों को बढ़ा सकने वाले खाद्य पदार्थ',
        tips: [
          'अधिक चीनी वाले खाद्य पदार्थ और पेय',
          'कृत्रिम रंग और एडिटिव्स',
          'फास्ट फूड और प्रोसेस्ड स्नैक्स',
          'रेडी-मेड भोजन',
          'सोडा और कृत्रिम पेय',
        ],
        timeOfDay: 'बचें',
        isWarning: true,
        lottieIcon: lottieIcons.avoidFood
      },
    ],
  };

  const getCardColors = index => {
    const colorSets = [
      ['#B3E5FC', '#81D4FA'], // Blue
      ['#C8E6C9', '#81C784'], // Green
      ['#E1BEE7', '#BA68C8'], // Purple
      ['#FFE0B2', '#FFB74D'], // Orange
      ['#F8BBD0', '#F06292'], // Pink
      ['#B2DFDB', '#4DB6AC'], // Teal
    ];
    return colorSets[index % colorSets.length];
  };

  // Optimize initial card animation
  const getInitialDelay = index => {
    // Reduce delay between cards and cap maximum delay
    return Math.min(index * 100, 500);
  };

  // Custom animation definition for smoother card entry
  Animatable.initializeRegistryWithDefinitions({
    smoothEntry: {
      from: {
        opacity: 0,
        translateY: 20,
      },
      to: {
        opacity: 1,
        translateY: 0,
      },
    },
  });

  const renderDietCard = (diet, index) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={1}
      key={index}>
      <Animatable.View ref={ref => (cardRefs.current[index] = ref)}>
        <LinearGradient
          colors={
            diet.isWarning 
              ? ['#FF8A80', '#FF5252'] // Lighter, more pleasant red gradient
              : getCardColors(index)
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientCard}>
          <View style={styles.cardHeader}>
            <Text style={[
              styles.cardTitle,
              // diet.isWarning && { color: '#FFFFFF' }
            ]}>{diet.title}</Text>
            <Animatable.Text
              animation="pulse"
              iterationCount="infinite"
              style={[styles.timeOfDay, diet.isWarning && styles.warningText]}>
              {diet.timeOfDay}
            </Animatable.Text>
          </View>
          <View style={styles.descriptionWrapper}>
          <Text style={styles.cardDescription}>{diet.description}</Text>
            <View style={styles.lottieWrapper}>
              <LottieView
                source={diet.lottieIcon}
                autoPlay
                loop
                style={styles.cardLottie}
              />
            </View>
          </View>
          <View style={styles.tipsContainer}>
            <View style={styles.tipsContent}>
              {diet.tips.map((tip, tipIndex) => (
                <Animatable.View
                  key={tipIndex}
                  animation="fadeInLeft"
                  delay={tipIndex * 100}>
                  <Text style={styles.tipText}>
                    {diet.isWarning ? '⚠️' : '🌟'} {tip}
                  </Text>
                </Animatable.View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      {/* Background Animations */}
      <View style={styles.animationContainer}>
        <FloatingAnimation
          source={lottieIcons.diet}
          style={{
            top: '2%',
            left: '2%',
            transform: [{scale: 1.3}],
            opacity: 1,
          }}
        />
      </View>

      <Animatable.Text
        animation="fadeInDown"
        duration={800}
        useNativeDriver={true}
        style={styles.headerText}>
        {isHindi ? 'अनुकूल आहार गाइड' : 'Friendly Diet Guide'}
      </Animatable.Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEventThrottle={16}>
        {dietPlans[isHindi ? 'hi' : 'en'].map((diet, index) =>
          renderDietCard(diet, index),
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default DietScreen;
