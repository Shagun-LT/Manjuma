import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: width,
    height: height,
  },
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  lottieAnimation: {
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
    zIndex: 2,
    opacity: 1,
  },
  sparkle1: {
    top: 0,
    left: width * 0.25,
    transform: [{rotate: '-45deg'}],
  },
  sparkle2: {
    top: 10,
    right: width * 0.25,
    transform: [{rotate: '45deg'}],
  },
  sparkle3: {
    bottom: -5,
    left: width * 0.3,
    transform: [{rotate: '15deg'}],
  },
  sparkle4: {
    bottom: -5,
    right: width * 0.3,
    transform: [{rotate: '15deg'}],
  },
  headingText: {
    fontSize: 52,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 80, 0, 1)',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 4,
    letterSpacing: 2,
    zIndex: 3,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
    textShadowColor: 'rgba(0, 80, 0, 1)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
    paddingHorizontal: 10,
    maxWidth: width * 0.9,
    fontWeight: '500',
  },
  btnStyle: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 20,
    elevation: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 22,
    color: '#1B5E20',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  letterText: {
    fontSize: 52,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 80, 0, 0.5)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
    letterSpacing: 2,
  },
});

export default styles;
