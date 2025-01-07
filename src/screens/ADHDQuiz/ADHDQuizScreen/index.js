import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';
import { questions } from './questions';

// Common options for all questions
const commonOptions = {
  options: ['0 = Never', '1 = Occasionally', '2 = Often', '3 = Very Often'],
  optionsHindi: [
    '0 = कभी नहीं',
    '1 = कभी-कभी',
    '2 = अक्सर',
    '3 = बहुत अक्सर'
  ],
  scores: [0, 1, 2, 3]
};

const ADHDQuizScreen = ({ route, navigation }) => {
  const { isHindi } = useLanguage();
  const { patientInfo } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: {
        optionIndex,
        score: commonOptions.scores[optionIndex]
      }
    });
  };

  const calculateScores = () => {
    // Convert raw scores to binary (1 if score is 2 or 3, otherwise 0)
    const binaryScores = Object.values(selectedAnswers).map(answer => 
      (answer.score === 2 || answer.score === 3) ? 1 : 0
    );

    // Calculate scores for each category
    const inattentiveScore = binaryScores.slice(0, 9).reduce((sum, score) => sum + score, 0);
    const hyperactiveScore = binaryScores.slice(9, 18).reduce((sum, score) => sum + score, 0);
    
    // Determine ADHD type
    let adhdType = '';
    if (inattentiveScore >= 6) {
      adhdType = 'PREDOMINANTLY INATTENTIVE TYPE';
    }
    if (hyperactiveScore >= 6) {
      adhdType = adhdType ? 'COMBINED TYPE' : 'PREDOMINANTLY HYPERACTIVE/IMPULSIVE SUBTYPE';
    }

    return {
      inattentiveScore,
      hyperactiveScore,
      adhdType,
      totalScore: inattentiveScore + hyperactiveScore,
      binaryScores
    };
  };

  const handleSubmit = () => {
    const scores = calculateScores();
    navigation.replace('ADHDResultScreen', {
      patientInfo,
      ...scores,
      answers: selectedAnswers
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <LinearGradient
      colors={['#F472B6', '#C084FC', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.questionNumber}>
            {isHindi ? 'प्रश्न' : 'Question'} {currentQuestion + 1}/{questions.length}
          </Text>

          <View style={styles.questionCard}>
            <Text style={styles.questionTitle}>
              {isHindi ? question.titleHindi : question.title}
            </Text>
          </View>

          <View style={styles.optionsCard}>
            {commonOptions.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswers[question.id]?.optionIndex === index && styles.selectedOption
                ]}
                onPress={() => handleAnswer(question.id, index)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswers[question.id]?.optionIndex === index && styles.selectedOptionText
                  ]}
                >
                  {isHindi ? commonOptions.optionsHindi[index] : option}
                </Text>
              </TouchableOpacity>
            ))}

            

            <View style={styles.navigationButtons}>
              {currentQuestion > 0 && (
                <TouchableOpacity 
                  style={styles.navButton}
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
                style={[
                  styles.navButton,
                  !selectedAnswers[question.id] && styles.disabledButton
                ]}
                onPress={handleNext}
                disabled={!selectedAnswers[question.id]}>
                <LinearGradient
                  colors={['#F472B6', '#C084FC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}>
                  <Text style={styles.buttonText}>
                    {isLastQuestion 
                      ? (isHindi ? 'जमा करें' : 'Submit')
                      : (isHindi ? 'अगला' : 'Next')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ADHDQuizScreen; 