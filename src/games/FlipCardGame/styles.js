import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  cloudsAnimation1: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    opacity: 0.7,
    top: '20%',
  },
  cloudsAnimation2: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    opacity: 0.7,
  },
  
  mainContent: {
    flex: 1,
    paddingBottom: 120, // Space for crab
  },
  
  cardsWrapper: {
    flex: 1,
    position: 'relative',
  },
  
  cardsGrid: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FF9800',
    overflow: 'hidden',
  },
  
  cardFlipped: {
    backgroundColor: '#4CAF50',
  },

  cardText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardPattern: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardPatternInner: {
    width: '60%',
    height: '60%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },

  // Level Complete styles
  levelComplete: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },

  levelCompleteInner: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },

  levelCompleteText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  levelCompleteScore: {
    fontSize: 22,
    color: '#666',
  },

  // Animation styles
  starAnimation: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  trophyAnimation: {
    width: 200,
    height: 200,
    zIndex: 2,
  },

  // Game Complete styles
  gameComplete: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  gameCompleteInner: {
    width: '85%',
    backgroundColor: '#001F3F',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },

  gameCompleteText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 2,
  },

  finalScoreText: {
    fontSize: 28,
    color: '#4CAF50',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  crabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 120,
    height: 120,
  },

  crabAnimation: {
    width: '100%',
    height: '100%',
  },

  // Complete Screen styles
  completeScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  completeContent: {
    width: '85%',
    backgroundColor: '#001F3F',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  levelCompleteText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  levelCompleteScore: {
    fontSize: 24,
    color: '#4CAF50',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  nextLevelText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },

  loadingAnimation: {
    width: 70,
    height: 70,
    marginBottom: 5,
    opacity: 0.9,
  },

  confettiAnimation: {
    position: 'absolute',
    width: '140%',
    height: '160%',
    top: '-30%',
    left: '-10%',
    opacity: 0.8,
    zIndex: 1,
  },

  highScoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },

  newHighScoreText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginVertical: 15,
  },

  playAgainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 20,
    zIndex: 5,
  },

  playAgainText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

// Card gradient themes
export const cardGradients = {
  1: ['#FF9800', '#F57C00'],  // Orange
  2: ['#2196F3', '#1976D2'],  // Blue
  3: ['#4CAF50', '#388E3C'],  // Green
  4: ['#9C27B0', '#7B1FA2'],  // Purple
  5: ['#E91E63', '#C2185B'],  // Pink
  6: ['#FF5722', '#E64A19'],  // Deep Orange
  7: ['#009688', '#00796B'],  // Teal
};

export default styles; 