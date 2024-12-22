import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const Header = ({ currentLevel, score, highScore }) => {
  return (
    <View style={styles.header}>
      <View style={styles.levelDisplay}>
        <Text style={styles.labelText}>LEVEL</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{currentLevel}</Text>
          <Text style={styles.maxLevelText}>/7</Text>
        </View>
      </View>
      <View style={styles.scoreDisplay}>
        <Text style={styles.labelText}>SCORE</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreNumber}>{score}</Text>
          {highScore > 0 && (
            <Text style={styles.bestScoreText}>BEST: {highScore}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header; 