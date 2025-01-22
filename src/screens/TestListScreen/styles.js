import {StyleSheet} from 'react-native';
import Colors from '../../CustomeStyles/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headingText: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 20,
    alignSelf: 'center',
    elevation: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    marginBottom: 50,
  },
  boxWrapper: {
    marginHorizontal: 25,
    marginBottom: 30,
    position: 'relative',
  },
  boxContainer: {
    width: '100%',
  },
  boxStyle: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    height: 200,
  },
  testName: {
    fontSize: 28,
    fontWeight: '600',
    paddingBottom: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontWeight: '400',
    marginBottom: 10,
  },
  lockedBox: {
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
  },
  lockAnimation: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  lockTimeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
  },
  lockDescriptionText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default styles;
