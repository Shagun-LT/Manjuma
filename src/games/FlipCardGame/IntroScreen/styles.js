import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  introScreen: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    paddingBottom: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    marginTop: 10,
  },
  rulesContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: '#FFF',
  },
  rulesTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#666',
    marginRight: 10,
  },
  activeBulletPoint: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  ruleText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    lineHeight: 22,
  },
  activeRuleText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 45,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '65%',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  beeContainer: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    zIndex: 1,
  },
  beeImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
}); 