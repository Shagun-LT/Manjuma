import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const Card = ({ 
  card, 
  index, 
  cardSize, 
  position, 
  isFlipped, 
  isPreviewMode, 
  previewAnimation, 
  gradient, 
  onPress 
}) => {
  const { left, top } = position;

  const rotation = isPreviewMode ? 
    previewAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    }) :
    isFlipped ? '180deg' : '0deg';

  const frontRotation = isPreviewMode ?
    previewAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg'],
    }) :
    isFlipped ? '360deg' : '180deg';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          width: cardSize,
          height: cardSize,
          position: 'absolute',
          left,
          top,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.cardSide,
          {
            transform: [{ rotateY: rotation }],
            backfaceVisibility: 'hidden',
          },
        ]}
      >
        <LinearGradient
          colors={gradient}
          style={styles.cardBack}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardPattern}>
            <View style={styles.cardInnerPattern} />
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.cardSide,
          styles.cardFront,
          {
            transform: [{ rotateY: frontRotation }],
            backfaceVisibility: 'hidden',
          },
        ]}
      >
        <Image 
          source={card.image}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </Animated.View>

      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={() => onPress(index)}
        disabled={isFlipped || isPreviewMode}
      />
    </View>
  );
};

export default Card; 