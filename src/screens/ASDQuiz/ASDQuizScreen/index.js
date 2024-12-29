import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../../../context/LanguageContext';
import styles from './styles';
import { questions } from './questions';

// Common options for all questions
const commonOptions = {
  options: ['Rarely', 'Sometimes', 'Frequently', 'Mostly', 'Always'],
  optionsHindi: ['शायद ही कभी', 'कभी-कभी', 'अक्सर', 'ज्यादातर', 'हमेशा'],
  scores: [1, 2, 3, 4, 5]
};

const ASDQuizScreen = ({ route, navigation }) => {
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

  const calculateTotalScore = () => {
    return Object.values(selectedAnswers).reduce((sum, answer) => sum + answer.score, 0);
  };

  const handleSubmit = () => {
    const totalScore = calculateTotalScore();
    navigation.replace('ASDResultScreen', {
      patientInfo,
      totalScore,
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

            <Text style={styles.questionDescription}>
              {isHindi ? question.descriptionHindi : question.description}
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
          </View>

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
      </ScrollView>
    </LinearGradient>
  );
};

export default ASDQuizScreen; 