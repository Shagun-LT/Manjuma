import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 20,
  },
  headingText: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 50,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  boxStyle: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  testName: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 15,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
