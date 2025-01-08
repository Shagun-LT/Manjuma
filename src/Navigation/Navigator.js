import React, {useState, lazy, Suspense} from 'react';
import {View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LanguageToggleButton from './LanguageToggleButton';

// Core screens that are frequently accessed
import DescriptionScreen from '../screens/DescriptionScreen';
import TestListScreen from '../screens/TestListScreen';
import DisordersScreen from '../screens/DisordersScreen';

// Lazy load less frequently accessed screens
const TestScreen = lazy(() => import('../screens/TestScreen'));
const FunActivityScreen = lazy(() => import('../screens/FunActivityScreen'));
const LeaderboardScreen = lazy(() => import('../screens/LeaderboardScreen'));
const GameActivity = lazy(() => import('../screens/GameActivity'));
const DietScreen = lazy(() => import('../screens/DietScreen'));
const ActivityDetails = lazy(() => import('../screens/ActivityDetails'));

// Lazy load games
const BallSortGame = lazy(() => import('../games/BallSortGame'));
const FlipCardGame = lazy(() => import('../games/FlipCardGame'));
const FlappyBirdGame = lazy(() => import('../games/FlappyBirdGame'));

// Lazy load quiz screens
const GDDScreeningForm = lazy(() => import('../screens/GDDQuiz/GDDScreeningForm'));

// Global Developmental Delay (GDD) Quiz
import GDDQuizScreen from '../screens/GDDQuiz/GDDQuizScreen';
import GDDResultScreen from '../screens/GDDQuiz/GDDResultScreen';

// Autism Spectrum Disorder (ASD) Quiz
import ASDScreeningForm from '../screens/ASDQuiz/ASDScreeningForm';
import ASDQuizScreen from '../screens/ASDQuiz/ASDQuizScreen';
import ASDResultScreen from '../screens/ASDQuiz/ASDResultScreen';

// Attention Deficit/Hyperactivity Disorder (ADHD) Quiz
import ADHDScreeningForm from '../screens/ADHDQuiz/ADHDScreeningForm';
import ADHDQuizScreen from '../screens/ADHDQuiz/ADHDQuizScreen';
import ADHDResultScreen from '../screens/ADHDQuiz/ADHDResultScreen';

import SnakeGame from '../games/SnakeGame';

const Stack = createNativeStackNavigator();

// Add this function to check if current screen is a game
const isGameScreen = (screenName) => {
  const gameScreens = ['FlipCardGame', 'BallSortGame', 'GameActivity', 'FlappyBirdGame', 'SnakeGame'];
  return gameScreens.includes(screenName);
};

const Navigator = () => {
  const [currentScreen, setCurrentScreen] = useState('DescriptionScreen');

  return (
    <View style={{flex: 1}}>
      <Stack.Navigator 
        initialRouteName="DescriptionScreen"
        screenListeners={{
          state: (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            setCurrentScreen(currentRoute.name);
          },
        }}>
        <Stack.Screen
          name="DescriptionScreen"
          component={DescriptionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DisorderScreen"
          component={DisordersScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TestListScreen"
          component={TestListScreen}
          options={{title: 'Test List', headerShown: false}}
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FunActivityScreen"
          component={FunActivityScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LeaderboardScreen"
          component={LeaderboardScreen}
          options={{title: 'Leaderboard'}}
        />
        <Stack.Screen
          name="GameActivity"
          component={GameActivity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DietScreen"
          component={DietScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="ActivityDetails" 
          component={ActivityDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BallSortGame"
          component={BallSortGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FlipCardGame"
          component={FlipCardGame}
          options={{
            title: 'Flip Card',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="GDDScreeningForm" 
          component={GDDScreeningForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="GDDQuizScreen" 
          component={GDDQuizScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="GDDResultScreen" 
          component={GDDResultScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="ASDScreeningForm" 
          component={ASDScreeningForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ASDQuizScreen" 
          component={ASDQuizScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="ASDResultScreen" 
          component={ASDResultScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="ADHDScreeningForm" 
          component={ADHDScreeningForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ADHDQuizScreen" 
          component={ADHDQuizScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="ADHDResultScreen" 
          component={ADHDResultScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="FlappyBirdGame"
          component={FlappyBirdGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SnakeGame"
          component={SnakeGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      {!isGameScreen(currentScreen) && (
        <View style={styles.languageToggleContainer}>
          <LanguageToggleButton currentScreen={currentScreen} />
        </View>
      )}
    </View>
  );
};

export default Navigator;

const styles = StyleSheet.create({
  languageToggleContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
});
