import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardContainer: {
    position: 'relative',
    perspective: 1000,
  },
  cardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
  cardFront: {
    padding: 10,
  },
  cardInnerPattern: {
    width: '60%',
    height: '60%',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
}); 