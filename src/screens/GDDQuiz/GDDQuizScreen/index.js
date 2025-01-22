import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';

const ageGroups = [
  {
    title: '3 Months',
    milestones: [
      'Birth Cry Present',
      'Equal Bilateral Movements',
      'Responds to Bell',
      'Vocalise sounds',
      'Smiles Spontaneously',
      'Eyes Follow moving Object',
      'Head Steady',
    ]
  },
  {
    title: '6 Months',
    milestones: [
      'Reaches for Objects',
      'Laughs Aloud',
      'Recognise Mother',
      'Vocalise for Pleasure/babbles',
      'Carries Objects to Mouth',
      'Rolls Over',
    ]
  },
  {
    title: '9 Months',
    milestones: [
      'Initiates Speech Sounds',
      'Sits by Self',
      'Thumb Finger Grasp',
      'Shows Curiosity',
    ]
  },
  {
    title: '1 Year',
    milestones: [
      'Says 3 words, "Dada", "Mama", etc.',
      'Stands Alone Well',
      'Follow Simple Instructions',
      'Cooperates for Dressing',
    ]
  },
  {
    title: '1 Year and 6 Months',
    milestones: [
      'Many Intelligible Words',
      'Walks, Runs well',
      'Indicates Wants',
      'Scribbles Spontaneously',
    ]
  },
  {
    title: '2 Years',
    milestones: [
      'Says Sentence of 2/3 words',
      'Points out Objects in Pictures',
      'Shows Body Parts',
      'Participates in Play',
    ]
  },
  {
    title: '3 Years',
    milestones: [
      'Copies O',
      'Relates Experiences',
      'Knows Names, uses of common objects',
      'Begins to ask Why?',
      'Takes Food by Self',
      'Toilet Control Present',
    ]
  },
  {
    title: '4 Years',
    milestones: [
      'Buttons Up',
      'Comprehends \'hunger\', \'cold\'',
      'Play Cooperatively with Children',
      'Repeats 3 Digits',
      'Tells Stories',
    ]
  },
  {
    title: '5 Years',
    milestones: [
      'Defines Words',
      'Makes simple Drawing',
      'Dresses with no Supervision',
      'Describe Actions in Pictures',
      'Give Sensible Answers to Questions',
      'Goes about Neighbourhood',
    ]
  }
];

const ageGroupScores = {
  '3 Months': 0.43,
  '6 Months': 0.5,
  '9 Months': 0.75,
  '1 Year': 0.75,
  '1 Year and 6 Months': 1.5,
  '2 Years': 1.5,
  '3 Years': 2.0,
  '4 Years': 2.4,
  '5 Years': 2.0
};

const calculateAgeInMonths = (age) => {
  try {
    // Remove any extra spaces and convert to lowercase
    const cleanAge = age.toLowerCase().trim();
    
    // Initialize years and months
    let years = 0;
    let months = 0;

    // Check if contains years
    if (cleanAge.includes('year')) {
      const yearMatch = cleanAge.match(/(\d+)\s*years?/);
      if (yearMatch) {
        years = parseInt(yearMatch[1]);
      }
    }

    // Check if contains months
    if (cleanAge.includes('month')) {
      const monthMatch = cleanAge.match(/(\d+)\s*months?/);
      if (monthMatch) {
        months = parseInt(monthMatch[1]);
      }
    }

    // If it's just a number, assume it's months
    if (/^\d+$/.test(cleanAge)) {
      months = parseInt(cleanAge);
    }

    const totalMonths = (years * 12) + months;
    
    // Ensure we have a valid number greater than 0
    if (totalMonths <= 0 || isNaN(totalMonths)) {
      console.warn('Invalid age calculation:', { age, totalMonths });
      return 1; // Return 1 to avoid division by zero
    }

    return totalMonths;
  } catch (error) {
    console.warn('Error calculating age:', error);
    return 1; // Return 1 as fallback to avoid division by zero
  }
};

const calculateTotalScore = (selectedMilestones) => {
  let totalScore = 0;

  ageGroups.forEach(group => {
    const tickedItems = group.milestones.filter(milestone => 
      selectedMilestones[`${group.title}-${milestone}`]
    ).length;
    
    totalScore += tickedItems * ageGroupScores[group.title];
  });

  return totalScore;
};

const GDDQuizScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { patientInfo } = route.params;
  const [currentAgeGroup, setCurrentAgeGroup] = useState(0);
  const [selectedMilestones, setSelectedMilestones] = useState({});

  const toggleMilestone = (ageGroup, milestone) => {
    const key = `${ageGroup}-${milestone}`;
    setSelectedMilestones(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNext = () => {
    if (currentAgeGroup < ageGroups.length - 1) {
      setCurrentAgeGroup(currentAgeGroup + 1);
    }
  };

  const handlePrev = () => {
    if (currentAgeGroup > 0) {
      setCurrentAgeGroup(currentAgeGroup - 1);
    }
  };

  const handleSubmit = () => {
    const totalScore = calculateTotalScore(selectedMilestones);
    const ageInMonths = calculateAgeInMonths(patientInfo.age);
    
    // Validate the calculations
    if (ageInMonths <= 0) {
      // You might want to show an alert here
      console.warn('Invalid age calculation');
      return;
    }

    const developmentalQuotient = (totalScore / ageInMonths) * 100;

    // Validate the quotient
    if (!isFinite(developmentalQuotient)) {
      // You might want to show an alert here
      console.warn('Invalid quotient calculation');
      return;
    }

    navigation.replace('GDDResultScreen', {
      patientInfo,
      totalScore,
      ageInMonths,
      developmentalQuotient,
      selectedMilestones,
    });
  };

  const renderCheckbox = (checked) => (
    <View style={styles.checkbox}>
      {checked && <View style={styles.checked} />}
    </View>
  );

  const isLastGroup = currentAgeGroup === ageGroups.length - 1;
  const currentGroup = ageGroups[currentAgeGroup];

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.headerText}>
            {isHindi 
              ? 'विकासात्मक स्क्रीनिंग टेस्ट (डीएसटी)'
              : 'DEVELOPMENTAL SCREENING TEST (DST)'}
          </Text>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {`${currentAgeGroup + 1}/${ageGroups.length}`}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentAgeGroup + 1) / ageGroups.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.ageGroupCard}>
            <Text style={styles.ageGroupTitle}>
              {currentGroup.title} {isHindi ? 'महीने' : '*'}
            </Text>
            
            {currentGroup.milestones.map((milestone, index) => (
              <TouchableOpacity
                key={index}
                style={styles.milestoneRow}
                onPress={() => toggleMilestone(currentGroup.title, milestone)}>
                {renderCheckbox(selectedMilestones[`${currentGroup.title}-${milestone}`])}
                <Text style={styles.milestoneText}>
                  {milestone}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            {currentAgeGroup > 0 && (
              <TouchableOpacity
                style={[styles.navigationButton, styles.prevButton]}
                onPress={handlePrev}>
                <LinearGradient
                  colors={['#C084FC', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}>
                  <Text style={styles.buttonText}>
                    {isHindi ? 'पिछला' : 'Previous'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.navigationButton, styles.nextButton]}
              onPress={isLastGroup ? handleSubmit : handleNext}>
              <LinearGradient
                colors={['#F472B6', '#C084FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text style={styles.buttonText}>
                  {isLastGroup 
                    ? (isHindi ? 'जमा करें' : 'Submit')
                    : (isHindi ? 'अगला' : 'Next')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default GDDQuizScreen; 